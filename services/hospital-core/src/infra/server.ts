import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger.js';
import { router } from './http/routes.js';
import { env } from './env.js';
import { redisClient } from './cache/index.js';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: env.FRONT_END_URL,
    // credentials: true,
  }),
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(router);

async function bootstrap() {
  await redisClient.connect();
  console.log('[Redis] Connected');

  app.listen({ port: env.PORT }, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
    console.log(`📄 Documentation available at http://localhost:${env.PORT}/docs`);
  });
}

async function shutdown() {
  await redisClient.quit();
  console.log('[Redis] Disconnected');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

bootstrap();
