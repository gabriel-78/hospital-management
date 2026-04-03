import { env } from './env';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { router } from './routes';
import { swaggerDocument } from './swagger';

const app = express();

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(router);

app.use(
  cors({
    origin: env.FRONT_END_URL,
    credentials: true,
  }),
);

async function bootstrap() {
  app.listen({ port: env.PORT }, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
    console.log(`📄 Documentation available at http://localhost:${env.PORT}/docs`);
  });
}

bootstrap();
