import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Hospital Management API',
    version: '1.0.0',
  },
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health Check',
        description: 'Verifica a saúde da API e Banco',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/companies': {
      get: {
        tags: ['Companies'],
        summary: 'List all companies',
        description: 'Returns all active companies (not soft-deleted)',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Company' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Companies'],
        summary: 'Create a company',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCompanyInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Company' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/DomainError' },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/consultations': {
      get: {
        tags: ['Consultations'],
        summary: 'List consultations',
        description:
          'Returns active consultations (not soft-deleted). Supports optional filtering by patientId and one or more status values. When no status is provided, all statuses are returned. Each item includes the doctor name resolved from the relation.',
        parameters: [
          {
            name: 'patientId',
            in: 'query',
            required: false,
            schema: { type: 'string', format: 'uuid' },
            description: 'Filter consultations by patient ID.',
          },
          {
            name: 'status',
            in: 'query',
            required: false,
            explode: true,
            schema: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['SCHEDULED', 'CANCELLED', 'COMPLETED'],
              },
            },
            description:
              'Filter by one or more statuses. Accepts repeated query params: ?status=SCHEDULED&status=COMPLETED. Omit to return all statuses.',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ConsultationListItem' },
                    },
                  },
                },
              },
            },
          },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
      post: {
        tags: ['Consultations'],
        summary: 'Schedule a consultation',
        description:
          'Creates a new consultation with SCHEDULED status. scheduledAt must be a future datetime. Doctor and patient must exist and have no conflicting consultation at the same time.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateConsultationInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Consultation' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/DomainError' },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/consultations/{id}': {
      get: {
        tags: ['Consultations'],
        summary: 'Find consultation by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Consultation' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Consultations'],
        summary: 'Soft-delete a consultation',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          204: { description: 'No Content' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/consultations/{id}/cancel': {
      patch: {
        tags: ['Consultations'],
        summary: 'Cancel a consultation',
        description: 'Cancels a consultation. Only allowed when status is SCHEDULED.',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Cancelled',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Consultation' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/DomainError' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/consultations/{id}/complete': {
      patch: {
        tags: ['Consultations'],
        summary: 'Complete a consultation',
        description:
          'Marks a consultation as COMPLETED. Only allowed when status is SCHEDULED and scheduledAt is in the past.',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Completed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Consultation' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/DomainError' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/consultations/{id}/reschedule': {
      patch: {
        tags: ['Consultations'],
        summary: 'Reschedule a consultation',
        description:
          'Updates scheduledAt. Only allowed when status is SCHEDULED, new date must be future, and neither doctor nor patient can have a conflicting consultation at the new time.',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RescheduleConsultationInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Rescheduled',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Consultation' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/DomainError' },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/patients': {
      get: {
        tags: ['Patients'],
        summary: 'List all patients',
        description: 'Returns all active patients (not soft-deleted)',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Patient' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Patients'],
        summary: 'Create a patient',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePatientInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Patient' },
                  },
                },
              },
            },
          },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/patients/{id}': {
      get: {
        tags: ['Patients'],
        summary: 'Find patient by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Patient' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Patients'],
        summary: 'Update patient name',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdatePatientInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Patient' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
      delete: {
        tags: ['Patients'],
        summary: 'Soft-delete a patient',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          204: { description: 'No Content' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/doctors': {
      get: {
        tags: ['Doctors'],
        summary: 'List all doctors',
        description: 'Returns all active doctors (not soft-deleted)',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Doctor' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Doctors'],
        summary: 'Create a doctor',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDoctorInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Doctor' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/DomainError' },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/doctors/{id}': {
      get: {
        tags: ['Doctors'],
        summary: 'Find doctor by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Doctor' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Doctors'],
        summary: 'Update doctor name and/or CRM',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateDoctorInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Doctor' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/DomainError' },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
      delete: {
        tags: ['Doctors'],
        summary: 'Soft-delete a doctor',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          204: { description: 'No Content' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/companies/{id}': {
      get: {
        tags: ['Companies'],
        summary: 'Find company by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Company' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Companies'],
        summary: 'Update company name and/or address',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCompanyInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isSuccess: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Company' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
      delete: {
        tags: ['Companies'],
        summary: 'Soft-delete a company',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          204: { description: 'No Content' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
  components: {
    parameters: {
      IdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
      },
    },
    schemas: {
      Address: {
        type: 'object',
        required: ['street', 'number', 'neighborhood', 'city', 'state', 'zipCode'],
        properties: {
          street: { type: 'string', example: 'Avenida Paulista' },
          number: { type: 'string', example: '1000' },
          complement: { type: 'string', example: 'Bloco A', nullable: true },
          neighborhood: { type: 'string', example: 'Bela Vista' },
          city: { type: 'string', example: 'São Paulo' },
          state: { type: 'string', minLength: 2, maxLength: 2, example: 'SP' },
          zipCode: { type: 'string', minLength: 8, maxLength: 8, example: '01310100' },
        },
      },
      Company: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Hospital São Lucas' },
          cnpj: { type: 'string', minLength: 14, maxLength: 14, example: '11222333000181' },
          type: { type: 'string', enum: ['HOSPITAL', 'CLINIC'], example: 'HOSPITAL' },
          address: { $ref: '#/components/schemas/Address' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Consultation: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          doctorId: { type: 'string', format: 'uuid' },
          patientId: { type: 'string', format: 'uuid' },
          scheduledAt: { type: 'string', format: 'date-time' },
          status: {
            type: 'string',
            enum: ['SCHEDULED', 'CANCELLED', 'COMPLETED'],
            example: 'SCHEDULED',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      ConsultationListItem: {
        allOf: [
          { $ref: '#/components/schemas/Consultation' },
          {
            type: 'object',
            required: ['doctorName'],
            properties: {
              doctorName: { type: 'string', example: 'Ana Paula Ferreira' },
            },
          },
        ],
      },
      CreateConsultationInput: {
        type: 'object',
        required: ['doctorId', 'patientId', 'scheduledAt'],
        properties: {
          doctorId: { type: 'string', format: 'uuid' },
          patientId: { type: 'string', format: 'uuid' },
          scheduledAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-01T10:00:00.000Z',
          },
        },
      },
      RescheduleConsultationInput: {
        type: 'object',
        required: ['scheduledAt'],
        properties: {
          scheduledAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-15T14:00:00.000Z',
          },
        },
      },
      Patient: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'João Pedro Alves' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      CreatePatientInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 255, example: 'João Pedro Alves' },
        },
      },
      UpdatePatientInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 255, example: 'João Pedro Alves' },
        },
      },
      Doctor: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Ana Paula Ferreira' },
          crm: { type: 'string', pattern: '^\\d{4,6}-[A-Z]{2}$', example: '123456-SP' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      CreateDoctorInput: {
        type: 'object',
        required: ['name', 'crm'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 255, example: 'Ana Paula Ferreira' },
          crm: { type: 'string', pattern: '^\\d{4,6}-[A-Za-z]{2}$', example: '123456-SP' },
        },
      },
      UpdateDoctorInput: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 255, example: 'Ana Paula Ferreira' },
          crm: { type: 'string', pattern: '^\\d{4,6}-[A-Za-z]{2}$', example: '654321-RJ' },
        },
      },
      CreateCompanyInput: {
        type: 'object',
        required: ['name', 'cnpj', 'type', 'address'],
        properties: {
          name: { type: 'string', example: 'Hospital São Lucas' },
          cnpj: { type: 'string', minLength: 14, maxLength: 14, example: '11222333000181' },
          type: { type: 'string', enum: ['HOSPITAL', 'CLINIC'], example: 'HOSPITAL' },
          address: { $ref: '#/components/schemas/Address' },
        },
      },
      UpdateCompanyInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Hospital São Lucas Atualizado' },
          address: { $ref: '#/components/schemas/Address' },
        },
      },
    },
    responses: {
      NotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                isSuccess: { type: 'boolean', example: false },
                error: { type: 'string', example: 'COMPANY_NOT_FOUND' },
              },
            },
          },
        },
      },
      DomainError: {
        description: 'Domain rule violation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                isSuccess: { type: 'boolean', example: false },
                error: { type: 'string', example: 'CNPJ_ALREADY_EXISTS' },
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                isSuccess: { type: 'boolean', example: false },
                error: { type: 'string', example: 'ADDRESS_STATE_INVALID' },
              },
            },
          },
        },
      },
    },
  },
};

export { swaggerUi, swaggerDocument };
