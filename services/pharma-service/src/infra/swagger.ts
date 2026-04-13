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
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Listar produtos',
        description:
          'Retorna todos os produtos ativos (não deletados). ' +
          'Aceita filtros opcionais por IDs, nomes e princípios ativos — os filtros são combinados com lógica OR.',
        parameters: [
          {
            name: 'ids',
            in: 'query',
            required: false,
            description: 'Lista de UUIDs de produtos a filtrar',
            schema: { type: 'array', items: { type: 'string', format: 'uuid' } },
            style: 'form',
            explode: true,
          },
          {
            name: 'names',
            in: 'query',
            required: false,
            description: 'Lista de nomes de produtos a filtrar',
            schema: { type: 'array', items: { type: 'string' } },
            style: 'form',
            explode: true,
          },
          {
            name: 'activeIngredients',
            in: 'query',
            required: false,
            description: 'Lista de nomes de princípios ativos a filtrar',
            schema: { type: 'array', items: { type: 'string' } },
            style: 'form',
            explode: true,
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
                    data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                  },
                },
              },
            },
          },
          422: { $ref: '#/components/responses/ValidationError' },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Criar produto',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProductInput' },
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
                    data: { $ref: '#/components/schemas/Product' },
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
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Buscar produto por ID',
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
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Atualizar produto',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProductInput' },
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
                    data: { $ref: '#/components/schemas/Product' },
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
        tags: ['Products'],
        summary: 'Deletar produto (soft delete)',
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
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'AMOXICILINA' },
          category: { type: 'string', example: 'ANTIBIOTICOS' },
          activeIngredient: { type: 'string', example: 'AMOXICILINA' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      CreateProductInput: {
        type: 'object',
        required: ['name', 'category', 'activeIngredient'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 255, example: 'AMOXICILINA' },
          category: { type: 'string', minLength: 1, maxLength: 100, example: 'ANTIBIOTICOS' },
          activeIngredient: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            example: 'AMOXICILINA',
          },
        },
      },
      UpdateProductInput: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 255, example: 'AMOXICILINA 500MG' },
          category: { type: 'string', minLength: 1, maxLength: 100, example: 'ANTIBIOTICOS' },
          activeIngredient: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
            example: 'AMOXICILINA',
          },
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
                error: { type: 'string', example: 'PRODUCT_NOT_FOUND' },
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
                error: { type: 'string', example: 'PRODUCT_NAME_ALREADY_EXISTS' },
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
                error: { type: 'string', example: 'PRODUCT_CATEGORY_REQUIRED' },
              },
            },
          },
        },
      },
    },
  },
};

export { swaggerUi, swaggerDocument };
