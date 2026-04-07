/**
 * OpenAPI 3 document for Swagger UI (`/api-docs`) and `/openapi.json`.
 */
export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'DespesAI API',
    version: '1.0.0',
    description:
      'Backend HTTP API. Auth responses include a JWT `token` (also set as httpOnly cookie when using the Next.js BFF).',
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Local development',
    },
    {
      url: '/',
      description: 'Same origin as this server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Cadastro e login' },
    { name: 'Users', description: 'Perfis de usuário' },
    { name: 'Banks', description: 'Gerenciamento de contas bancárias' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuário',
        operationId: 'authRegister',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuário criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthSuccessResponse' },
              },
            },
          },
          '400': {
            description: 'Validação inválida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '409': {
            description: 'E-mail já cadastrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorMessage' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        operationId: 'authLogin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthSuccessResponse' },
              },
            },
          },
          '400': {
            description: 'Validação inválida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '401': {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorMessage' },
              },
            },
          },
        },
      },
    },
    '/user': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuário (legado)',
        description: 'Alias de `POST /auth/register` para compatibilidade.',
        operationId: 'userRegisterLegacy',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuário criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthSuccessResponse' },
              },
            },
          },
          '400': {
            description: 'Validação inválida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '409': {
            description: 'E-mail já cadastrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorMessage' },
              },
            },
          },
        },
      },
    },
    '/user/me': {
      post: {
        tags: ['Auth'],
        summary: 'Login (legado)',
        description: 'Alias de `POST /auth/login` para compatibilidade.',
        operationId: 'userLoginLegacy',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthSuccessResponse' },
              },
            },
          },
          '400': {
            description: 'Validação inválida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '401': {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorMessage' },
              },
            },
          },
        },
      },
    },
    '/user/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Buscar usuário por ID',
        operationId: 'getUserById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Usuário (sem senha)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PublicUser' },
              },
            },
          },
          '404': {
            description: 'Não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorMessage' },
              },
            },
          },
        },
      },
    },
    '/banks': {
      get: {
        tags: ['Banks'],
        summary: 'Listar contas bancárias',
        operationId: 'listBanks',
        responses: {
          '200': {
            description: 'Lista de contas ativas do usuário',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/BankResponse' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Banks'],
        summary: 'Cadastrar conta bancária',
        operationId: 'createBank',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateBankRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Conta criada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BankResponse' },
              },
            },
          },
        },
      },
    },
    '/banks/{id}': {
      put: {
        tags: ['Banks'],
        summary: 'Editar conta bancária',
        operationId: 'updateBank',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateBankRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Conta atualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BankResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Banks'],
        summary: 'Remover conta bancária (Soft Delete)',
        operationId: 'deleteBank',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': { description: 'Conta inativada com sucesso' },
        },
      },
    },
  },
  components: {
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 1, example: 'João Silva' },
          email: { type: 'string', format: 'email', example: 'joao@email.com' },
          password: {
            type: 'string',
            format: 'password',
            minLength: 8,
            example: 'senha-segura',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
      },
      PublicUser: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthSuccessResponse: {
        type: 'object',
        required: ['id', 'name', 'email', 'createdAt', 'updatedAt', 'token'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          token: {
            type: 'string',
            description: 'JWT (ex.: Bearer para rotas protegidas no futuro)',
          },
        },
      },
      ErrorMessage: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'User already exists' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Validation failed' },
          details: {
            type: 'object',
            description: 'Campos inválidos (formato Zod flatten)',
          },
        },
      },
      CreateBankRequest: {
        type: 'object',
        required: ['bankCode', 'name', 'agency', 'accountNumber'],
        properties: {
          bankCode: {
            type: 'string',
            example: '341',
            description: 'Código do banco (3 dígitos)',
          },
          name: { type: 'string', example: 'Itaú' },
          agency: { type: 'string', example: '0001' },
          accountNumber: { type: 'string', example: '12345-6' },
          balance: { type: 'number', example: 100.0 },
        },
      },
      BankResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          bankCode: { type: 'string' },
          name: { type: 'string' },
          agency: { type: 'string' },
          accountNumber: { type: 'string' },
          balance: { type: 'number' },
          isActive: { type: 'boolean' },
          userId: { type: 'string', format: 'uuid' },
        },
      },
    },
  },
}
