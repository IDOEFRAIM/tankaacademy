import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'
import { db } from '@/lib/db'

// Mock the db module
vi.mock('@/lib/db', () => ({
  db: mockDeep<PrismaClient>(),
}))

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>
