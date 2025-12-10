import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not set, using default SQLite path')
  process.env.DATABASE_URL = 'file:./prisma/dev.db'
}

let db: PrismaClient

try {
  if (globalForPrisma.prisma) {
    db = globalForPrisma.prisma
  } else {
    db = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = db
    }
  }
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error)
  throw new Error(
    'Prisma Client initialization failed. Please run: npx prisma generate'
  )
}

export { db }

