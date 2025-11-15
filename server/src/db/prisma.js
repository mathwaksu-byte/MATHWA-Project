import { PrismaClient } from '@prisma/client'

let prisma
function resolveDbUrl() {
  const explicit = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
  if (explicit) return explicit
  const tx = process.env.SUPABASE_DB_TX_POOLER_URL
  const direct = process.env.SUPABASE_DB_DIRECT_URL
  if (tx) return `${tx}?pgbouncer=true&connection_limit=1`
  if (direct) return direct
  return null
}

export function getPrisma() {
  const url = resolveDbUrl()
  if (!url) return null
  if (!prisma) prisma = new PrismaClient()
  return prisma
}

export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect()
    prisma = null
  }
}
