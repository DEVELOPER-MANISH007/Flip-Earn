import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Prisma 7 config: URLs ab .env se yahan se read honge, schema.prisma me nahi.

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'),
  },
});


