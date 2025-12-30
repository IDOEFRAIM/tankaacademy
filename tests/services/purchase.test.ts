import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockDeep } from 'vitest-mock-extended'

// Mock must be hoisted and defined before imports
vi.mock('@/lib/db', () => ({
  db: mockDeep(),
}))

import { PurchaseService } from '@/services/purchase'
import { db } from '@/lib/db'

const prismaMock = db as unknown as ReturnType<typeof mockDeep>

describe('PurchaseService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkCourseAccess', () => {
    it('should return false if userId is null or undefined', async () => {
      const resultNull = await PurchaseService.checkCourseAccess(null, 'course-1')
      const resultUndefined = await PurchaseService.checkCourseAccess(undefined, 'course-1')
      
      expect(resultNull).toBe(false)
      expect(resultUndefined).toBe(false)
      expect(prismaMock.purchase.findUnique).not.toHaveBeenCalled()
    })

    it('should return true if purchase exists', async () => {
      // Arrange
      prismaMock.purchase.findUnique.mockResolvedValue({
        id: 'purchase-1',
        userId: 'user-1',
        courseId: 'course-1',
        price: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // Act
      const result = await PurchaseService.checkCourseAccess('user-1', 'course-1')

      // Assert
      expect(result).toBe(true)
      expect(prismaMock.purchase.findUnique).toHaveBeenCalledWith({
        where: {
          userId_courseId: {
            userId: 'user-1',
            courseId: 'course-1',
          },
        },
      })
    })

    it('should return false if purchase does not exist', async () => {
      // Arrange
      prismaMock.purchase.findUnique.mockResolvedValue(null)

      // Act
      const result = await PurchaseService.checkCourseAccess('user-1', 'course-1')

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('getUserEnrollments', () => {
    it('should return list of purchases with course details', async () => {
      // Arrange
      const mockPurchases = [
        {
          id: 'purchase-1',
          userId: 'user-1',
          courseId: 'course-1',
          price: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
          course: {
            id: 'course-1',
            title: 'Course 1',
            category: { id: 'cat-1', name: 'Tech' },
            chapters: []
          }
        }
      ]

      // @ts-ignore - Partial mock is enough for this test
      prismaMock.purchase.findMany.mockResolvedValue(mockPurchases)

      // Act
      const result = await PurchaseService.getUserEnrollments('user-1')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].course.title).toBe('Course 1')
      expect(prismaMock.purchase.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      })
    })
  })
})
