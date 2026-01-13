import { existsSync } from 'fs'
import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Only load .env.local if it exists (for local development)
// In production/Vercel, environment variables are set directly
if (existsSync('.env.local')) {
  config({ path: '.env.local', override: false })
}
// Load default .env if it exists
if (existsSync('.env')) {
  config({ override: false })
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DIRECT_URL'),
  },
})
