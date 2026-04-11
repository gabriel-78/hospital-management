import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Pharma API',
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
    schemas: {},
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
