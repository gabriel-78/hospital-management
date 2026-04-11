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
