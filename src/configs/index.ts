import { StatusCodes } from 'http-status-codes'

const envConfigs = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,

  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
}

const configs = {
  ...envConfigs,
  OK: StatusCodes.OK,
  CREATED: StatusCodes.CREATED,
  BAD_REQUEST: StatusCodes.BAD_REQUEST,
  UNAUTHORIZED: StatusCodes.UNAUTHORIZED,
  FORBIDDEN: StatusCodes.FORBIDDEN,
  NOT_FOUND: StatusCodes.NOT_FOUND,
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
}

export default configs
