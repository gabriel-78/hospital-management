import { env } from './env';
import express from 'express';
import cors from 'cors';
import { prisma } from './database/prisma';

const app = express();

app.use(express.json());

app.get('/healthcheck', async (req, res) => {
  const check = await prisma.healthCheck.findFirst();
  res.json({
    status: 'ok',
    database: !!check,
    message: check?.message,
  });
});

app.use(
  cors({
    origin: env.FRONT_END_URL,
    credentials: true,
  }),
);

async function bootstrap() {
  app.listen({ port: env.PORT }, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
  });
}

bootstrap();
