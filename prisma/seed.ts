import { PrismaPg } from '@prisma/adapter-pg'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { PrismaClient, Role } from '../src/generated/prisma/client'

dotenv.config({ path: '.env.local' })
dotenv.config()

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const adminEmail = 'admin@gmail.com'
  const adminPassword = 'securepassword123'
  const adminPhone = '+8801700000000'

  console.log('Seeding admin user...')

  // 1. Create User in Supabase Auth
  // We try to get the user first to avoid duplication error if seed runs twice
  const {
    data: { users },
  } = await supabaseAdmin.auth.admin.listUsers()
  let authUser = users.find((u) => u.email === adminEmail)

  if (!authUser) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto confirm email
      phone: adminPhone,
      phone_confirm: true,
      user_metadata: { name: 'Super Admin' },
    })

    if (error) {
      console.error('Error creating auth user:', error)
      throw error
    }
    authUser = data.user
    console.log('Supabase Auth user created.')
  } else {
    console.log('Supabase Auth user already exists.')
  }

  if (!authUser || !authUser.id) {
    throw new Error('Failed to resolve Auth User ID')
  }

  // 2. Create User in Prisma (Database)
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        supabaseId: authUser.id,
        phone: adminPhone,
        name: 'Super Admin',
        role: Role.ADMIN, // Set role to ADMIN
      },
    })
    console.log('Database Admin user created.')
  } else {
    // Ensure existing user is connected to Supabase ID and is ADMIN
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        supabaseId: authUser.id,
        role: Role.ADMIN,
      },
    })
    console.log('Database Admin user updated.')
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
