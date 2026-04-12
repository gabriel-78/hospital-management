export const queryKeys = {
  patients: {
    list: () => ["list-patients"],
    invalidations: {
      delete: (id?: string) => [queryKeys.patients.list()],
      create: (id?: string) => [queryKeys.patients.list()],
      update: (id?: string) => [queryKeys.patients.list()],
    },
  },
};
