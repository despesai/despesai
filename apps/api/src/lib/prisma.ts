import { PrismaPg } from '@prisma/adapter-pg'
import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '../../generated/prisma/client'

loadEnv({ path: '.env.local', quiet: true })
loadEnv({ quiet: true })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })
export default prisma
