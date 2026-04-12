export const queryKeys = {
  patients: {
    list: () => ["list-patients"],
    invalidations: {
      delete: (id?: string) => [queryKeys.patients.list()],
      create: (id?: string) => [queryKeys.patients.list()],
      update: (id?: string) => [queryKeys.patients.list()],
    },
  },
  doctors: {
    list: () => ["list-doctors"],
    invalidations: {
      delete: (id?: string) => [queryKeys.doctors.list()],
      create: (id?: string) => [queryKeys.doctors.list()],
      update: (id?: string) => [queryKeys.doctors.list()],
    },
  },
};
