import type { Options } from 'swagger-jsdoc';

const currentDir = process.cwd();

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ThanhHoa API',
      version: '1.0.0',
      description: 'API documentation for ThanhHoa framework',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [`${currentDir}/src/modules/**/*.controller.ts`],
};
