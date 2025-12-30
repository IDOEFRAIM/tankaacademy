import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockDeep } from 'vitest-mock-extended'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: mockDeep(),
}))

import { ProgressService } from '@/services/progress'
import { prisma } from '@/lib/prisma'

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep>

describe('ProgressService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('updateProgress', () => {
    it('should upsert user progress', async () => {
      const mockProgress = { id: 'prog-1', userId: 'user-1', lessonId: 'lesson-1', isCompleted: true }
      // @ts-ignore
      prismaMock.userProgress.upsert.mockResolvedValue(mockProgress)

      const result = await ProgressService.updateProgress('user-1', 'lesson-1', true)

      expect(result).toEqual(mockProgress)
      expect(prismaMock.userProgress.upsert).toHaveBeenCalledWith({
        where: { userId_lessonId: { userId: 'user-1', lessonId: 'lesson-1' } },
        update: { isCompleted: true },
        create: { userId: 'user-1', lessonId: 'lesson-1', isCompleted: true }
      })
    })
  })

  describe('getCourseProgress', () => {
    it('should calculate progress correctly', async () => {
      // Arrange
      const mockLessons = [{ id: 'l1' }, { id: 'l2' }, { id: 'l3' }, { id: 'l4' }]
      // @ts-ignore
      prismaMock.lesson.findMany.mockResolvedValue(mockLessons)
      // @ts-ignore
      prismaMock.userProgress.count.mockResolvedValue(2) // 2 out of 4 completed = 50%

      // Act
      const result = await ProgressService.getCourseProgress('user-1', 'course-1')

      // Assert
      expect(result).toBe(50)
      expect(prismaMock.lesson.findMany).toHaveBeenCalled()
      expect(prismaMock.userProgress.count).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-1',
          isCompleted: true
        })
      }))
    })

    it('should return 0 if no published lessons', async () => {
      // @ts-ignore
      prismaMock.lesson.findMany.mockResolvedValue([])

      const result = await ProgressService.getCourseProgress('user-1', 'course-1')

      expect(result).toBe(0)
      expect(prismaMock.userProgress.count).not.toHaveBeenCalled()
    })

    it('should return 100 if all lessons completed', async () => {
      const mockLessons = [{ id: 'l1' }]
      // @ts-ignore
      prismaMock.lesson.findMany.mockResolvedValue(mockLessons)
      // @ts-ignore
      prismaMock.userProgress.count.mockResolvedValue(1)

      const result = await ProgressService.getCourseProgress('user-1', 'course-1')

      expect(result).toBe(100)
    })
  })
})
