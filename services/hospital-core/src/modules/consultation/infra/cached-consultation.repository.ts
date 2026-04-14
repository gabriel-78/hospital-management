import { Either, isLeft, makeRight } from '@shared/core';
import { AppError } from '@shared/core';
import type { CacheProvider } from '@/shared/domain/cache/cache-provider.interface.js';
import { Consultation, ConsultationPersistenceRaw } from '../consultation.domain.js';
import {
  IConsultationRepository,
  ConsultationListItem,
  ListConsultationsFilters,
} from './consultation.repository.js';
import { ConsultationMapper } from './consultation.mapper.js';

const LIST_PATTERN = 'consultations:list*';
const LIST_TTL = 60;
const FIND_TTL = 300;

interface RawCached extends Omit<ConsultationPersistenceRaw, 'scheduledAt' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface RawCachedListItem {
  consultation: RawCached;
  doctorName: string;
  patientName: string;
}

function buildListKey(filters?: ListConsultationsFilters): string {
  if (!filters) return 'consultations:list';
  const parts: string[] = [];
  if (filters.patientId) parts.push(`patientId=${filters.patientId}`);
  if (filters.doctorId) parts.push(`doctorId=${filters.doctorId}`);
  if (filters.status?.length) parts.push(`status=${[...filters.status].sort().join(',')}`);
  return parts.length > 0 ? `consultations:list:${parts.join(':')}` : 'consultations:list';
}

function rawToDomain(raw: RawCached): Either<AppError, Consultation> {
  return Consultation.fromPersistence({
    id: raw.id,
    doctorId: raw.doctorId,
    patientId: raw.patientId,
    scheduledAt: new Date(raw.scheduledAt),
    status: raw.status,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : null,
  });
}

export class CachedConsultationRepository implements IConsultationRepository {
  constructor(
    private readonly inner: IConsultationRepository,
    private readonly cache: CacheProvider,
  ) {}

  async list(filters?: ListConsultationsFilters): Promise<Either<AppError, ConsultationListItem[]>> {
    const key = buildListKey(filters);
    const cached = await this.cache.get<RawCachedListItem[]>(key);

    if (cached !== null) {
      const items: ConsultationListItem[] = [];

      for (const item of cached) {
        const result = rawToDomain(item.consultation);

        if (isLeft(result)) {
          await this.cache.delByPattern(LIST_PATTERN);
          return this.fetchAndCacheList(filters, key);
        }

        items.push({ consultation: result.right, doctorName: item.doctorName, patientName: item.patientName });
      }

      return makeRight(items);
    }

    return this.fetchAndCacheList(filters, key);
  }

  private async fetchAndCacheList(
    filters: ListConsultationsFilters | undefined,
    key: string,
  ): Promise<Either<AppError, ConsultationListItem[]>> {
    const result = await this.inner.list(filters);
    if (isLeft(result)) return result;

    const raw: RawCachedListItem[] = result.right.map((item) => ({
      consultation: ConsultationMapper.toPersistence(item.consultation) as unknown as RawCached,
      doctorName: item.doctorName,
      patientName: item.patientName,
    }));

    await this.cache.set(key, raw, LIST_TTL);
    return result;
  }

  async findById(id: string): Promise<Either<AppError, Consultation | null>> {
    const key = `consultations:${id}`;
    const cached = await this.cache.get<RawCached>(key);

    if (cached !== null) {
      const result = rawToDomain(cached);

      if (isLeft(result)) {
        await this.cache.del(key);
        return this.inner.findById(id);
      }

      return makeRight(result.right);
    }

    const result = await this.inner.findById(id);

    if (!isLeft(result) && result.right !== null) {
      await this.cache.set(key, ConsultationMapper.toPersistence(result.right), FIND_TTL);
    }

    return result;
  }

  async create(consultation: Consultation): Promise<Either<AppError, Consultation>> {
    const result = await this.inner.create(consultation);
    if (!isLeft(result)) await this.cache.delByPattern(LIST_PATTERN);
    return result;
  }

  async save(consultation: Consultation): Promise<Either<AppError, Consultation>> {
    const result = await this.inner.save(consultation);
    if (!isLeft(result)) {
      await this.cache.delByPattern(LIST_PATTERN);
      await this.cache.del(`consultations:${consultation.id.value}`);
    }
    return result;
  }

  async softDelete(id: string): Promise<Either<AppError, void>> {
    const result = await this.inner.softDelete(id);
    if (!isLeft(result)) {
      await this.cache.delByPattern(LIST_PATTERN);
      await this.cache.del(`consultations:${id}`);
    }
    return result;
  }

  async findConflictingForDoctor(
    doctorId: string,
    scheduledAt: Date,
    excludeId?: string,
  ): Promise<Either<AppError, Consultation | null>> {
    return this.inner.findConflictingForDoctor(doctorId, scheduledAt, excludeId);
  }

  async findConflictingForPatient(
    patientId: string,
    scheduledAt: Date,
    excludeId?: string,
  ): Promise<Either<AppError, Consultation | null>> {
    return this.inner.findConflictingForPatient(patientId, scheduledAt, excludeId);
  }
}
