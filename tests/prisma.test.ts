import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

describe('Prisma Client', () => {
  it('should be instantiated without error', () => {
    expect(() => new PrismaClient()).not.toThrow()
  })

  it('should have $disconnect method', async () => {
    await prisma.$disconnect()
    expect(true).toBe(true)
  })
})