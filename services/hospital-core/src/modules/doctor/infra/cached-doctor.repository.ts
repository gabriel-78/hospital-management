import { Either, isLeft, makeRight } from '@shared/core';
import { AppError } from '@shared/core';
import type { CacheProvider } from '@/shared/domain/cache/cache-provider.interface.js';
import { Doctor, DoctorPersistenceRaw } from '../doctor.domain.js';
import { IDoctorRepository } from './doctor.repository.js';
import { DoctorMapper } from './doctor.mapper.js';

const CACHE_KEY = 'doctors:list';
const TTL = 300;

interface RawCached extends Omit<DoctorPersistenceRaw, 'createdAt' | 'updatedAt' | 'deletedAt'> {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

function rawToDomain(raw: RawCached): Either<AppError, Doctor> {
  return Doctor.fromPersistence({
    id: raw.id,
    name: raw.name,
    crm: raw.crm,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : null,
  });
}

export class CachedDoctorRepository implements IDoctorRepository {
  constructor(
    private readonly inner: IDoctorRepository,
    private readonly cache: CacheProvider,
  ) {}

  async list(): Promise<Either<AppError, Doctor[]>> {
    const cached = await this.cache.get<RawCached[]>(CACHE_KEY);

    if (cached !== null) {
      const doctors: Doctor[] = [];

      for (const raw of cached) {
        const result = rawToDomain(raw);

        if (isLeft(result)) {
          await this.cache.del(CACHE_KEY);
          return this.fetchAndCache();
        }

        doctors.push(result.right);
      }

      return makeRight(doctors);
    }

    return this.fetchAndCache();
  }

  private async fetchAndCache(): Promise<Either<AppError, Doctor[]>> {
    const result = await this.inner.list();
    if (isLeft(result)) return result;

    const raw = result.right.map(DoctorMapper.toPersistence);
    await this.cache.set(CACHE_KEY, raw, TTL);

    return result;
  }

  async findById(id: string): Promise<Either<AppError, Doctor | null>> {
    const key = `doctors:${id}`;
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
      await this.cache.set(key, DoctorMapper.toPersistence(result.right), TTL);
    }

    return result;
  }

  async findByCrm(crm: string): Promise<Either<AppError, Doctor | null>> {
    return this.inner.findByCrm(crm);
  }

  async create(doctor: Doctor): Promise<Either<AppError, Doctor>> {
    const result = await this.inner.create(doctor);
    if (!isLeft(result)) await this.cache.del(CACHE_KEY);
    return result;
  }

  async save(doctor: Doctor): Promise<Either<AppError, Doctor>> {
    const result = await this.inner.save(doctor);
    if (!isLeft(result)) {
      await this.cache.del(CACHE_KEY);
      await this.cache.del(`doctors:${doctor.id.value}`);
    }
    return result;
  }

  async softDelete(id: string): Promise<Either<AppError, void>> {
    const result = await this.inner.softDelete(id);
    if (!isLeft(result)) {
      await this.cache.del(CACHE_KEY);
      await this.cache.del(`doctors:${id}`);
    }
    return result;
  }
}
