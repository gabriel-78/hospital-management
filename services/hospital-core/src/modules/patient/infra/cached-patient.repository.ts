import { Either, isLeft, makeRight } from '@shared/core';
import { AppError } from '@shared/core';
import type { CacheProvider } from '@/shared/domain/cache/cache-provider.interface.js';
import { Patient, PatientPersistenceRaw } from '../patient.domain.js';
import { IPatientRepository } from './patient.repository.js';
import { PatientMapper } from './patient.mapper.js';

const CACHE_KEY = 'patients:list';
const TTL = 300;

interface RawCached extends Omit<PatientPersistenceRaw, 'createdAt' | 'updatedAt' | 'deletedAt'> {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export class CachedPatientRepository implements IPatientRepository {
  constructor(
    private readonly inner: IPatientRepository,
    private readonly cache: CacheProvider,
  ) {}

  async list(): Promise<Either<AppError, Patient[]>> {
    const cached = await this.cache.get<RawCached[]>(CACHE_KEY);

    if (cached !== null) {
      const patients: Patient[] = [];

      for (const raw of cached) {
        const result = Patient.fromPersistence({
          id: raw.id,
          name: raw.name,
          createdAt: new Date(raw.createdAt),
          updatedAt: new Date(raw.updatedAt),
          deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : null,
        });

        if (isLeft(result)) {
          await this.cache.del(CACHE_KEY);
          return this.fetchAndCache();
        }

        patients.push(result.right);
      }

      return makeRight(patients);
    }

    return this.fetchAndCache();
  }

  private async fetchAndCache(): Promise<Either<AppError, Patient[]>> {
    const result = await this.inner.list();
    if (isLeft(result)) return result;

    const raw = result.right.map(PatientMapper.toPersistence);
    await this.cache.set(CACHE_KEY, raw, TTL);

    return result;
  }

  async create(patient: Patient): Promise<Either<AppError, Patient>> {
    const result = await this.inner.create(patient);
    if (!isLeft(result)) await this.cache.del(CACHE_KEY);
    return result;
  }

  async findById(id: string): Promise<Either<AppError, Patient | null>> {
    return this.inner.findById(id);
  }

  async save(patient: Patient): Promise<Either<AppError, Patient>> {
    const result = await this.inner.save(patient);
    if (!isLeft(result)) await this.cache.del(CACHE_KEY);
    return result;
  }

  async softDelete(id: string): Promise<Either<AppError, void>> {
    const result = await this.inner.softDelete(id);
    if (!isLeft(result)) await this.cache.del(CACHE_KEY);
    return result;
  }
}
