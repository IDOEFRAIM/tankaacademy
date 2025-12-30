import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkout } from '@/actions/checkout'
import { AuthService } from '@/services'
import { PurchaseService } from '@/services/purchase'
import { mockDeep } from 'vitest-mock-extended'

// Mock dependencies
vi.mock('@/services', () => ({
  AuthService: {
    getCurrentUser: vi.fn(),
  },
}))

vi.mock('@/services/purchase', () => ({
  PurchaseService: {
    checkCourseAccess: vi.fn(),
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock DB
vi.mock('@/lib/db', async () => {
  const actual = await vi.importActual<typeof import('vitest-mock-extended')>('vitest-mock-extended')
  return {
    db: actual.mockDeep(),
  }
})

import { db } from '@/lib/db'
const dbMock = db as unknown as ReturnType<typeof mockDeep>

describe('Checkout Action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return error if user is not authorized', async () => {
    // @ts-ignore
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue(null)

    const result = await checkout('course-1')

    expect(result).toEqual({ error: "Non autorisé" })
  })

  it('should return error if course not found', async () => {
    // @ts-ignore
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue({ id: 'user-1', email: 'test@test.com' })
    // @ts-ignore
    dbMock.course.findUnique.mockResolvedValue(null)

    const result = await checkout('course-1')

    expect(result).toEqual({ error: "Cours introuvable" })
  })

  it('should return error if already enrolled', async () => {
    // @ts-ignore
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue({ id: 'user-1', email: 'test@test.com' })
    // @ts-ignore
    dbMock.course.findUnique.mockResolvedValue({ id: 'course-1', price: 100 })
    // @ts-ignore
    vi.mocked(PurchaseService.checkCourseAccess).mockResolvedValue(true)

    const result = await checkout('course-1')

    expect(result).toEqual({ error: "Déjà inscrit" })
  })

  it('should create purchase successfully', async () => {
    // @ts-ignore
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue({ id: 'user-1', email: 'test@test.com' })
    // @ts-ignore
    dbMock.course.findUnique.mockResolvedValue({ id: 'course-1', price: 100 })
    // @ts-ignore
    vi.mocked(PurchaseService.checkCourseAccess).mockResolvedValue(false)
    // @ts-ignore
    dbMock.purchase.create.mockResolvedValue({ id: 'purchase-1' })

    const result = await checkout('course-1')

    expect(result).toEqual({ success: true })
    expect(dbMock.purchase.create).toHaveBeenCalledWith({
      data: {
        courseId: 'course-1',
        userId: 'user-1',
        price: 100
      }
    })
  })

  it('should handle internal errors', async () => {
    // @ts-ignore
    vi.mocked(AuthService.getCurrentUser).mockRejectedValue(new Error('DB Error'))

    const result = await checkout('course-1')

    expect(result).toEqual({ error: "Erreur interne" })
  })
})
