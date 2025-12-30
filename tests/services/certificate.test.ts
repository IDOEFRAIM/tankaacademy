import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockDeep } from 'vitest-mock-extended'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: mockDeep(),
}))

// Mock ProgressService
vi.mock('@/services/progress', () => ({
  ProgressService: {
    getCourseProgress: vi.fn(),
  },
}))

import { CertificateService } from '@/services/certificate'
import { prisma } from '@/lib/prisma'
import { ProgressService } from '@/services/progress'

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep>

describe('CertificateService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkCertificateEligibility', () => {
    it('should return true if progress is 100%', async () => {
      // @ts-ignore
      vi.mocked(ProgressService.getCourseProgress).mockResolvedValue(100)

      const result = await CertificateService.checkCertificateEligibility('user-1', 'course-1')

      expect(result).toBe(true)
    })

    it('should return false if progress is less than 100%', async () => {
      // @ts-ignore
      vi.mocked(ProgressService.getCourseProgress).mockResolvedValue(99)

      const result = await CertificateService.checkCertificateEligibility('user-1', 'course-1')

      expect(result).toBe(false)
    })
  })

  describe('getCertificateData', () => {
    it('should return certificate data if eligible', async () => {
      // Arrange
      // @ts-ignore
      vi.mocked(ProgressService.getCourseProgress).mockResolvedValue(100)
      
      const mockUser = { name: 'John Doe' }
      const mockCourse = { title: 'React Mastery', instructor: { name: 'Jane Doe' } }

      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(mockUser)
      // @ts-ignore
      prismaMock.course.findUnique.mockResolvedValue(mockCourse)

      // Act
      const result = await CertificateService.getCertificateData('user-1', 'course-1')

      // Assert
      expect(result).toEqual({
        studentName: 'John Doe',
        courseTitle: 'React Mastery',
        instructorName: 'Jane Doe',
        completionDate: expect.any(Date)
      })
    })

    it('should return null if not eligible', async () => {
      // @ts-ignore
      vi.mocked(ProgressService.getCourseProgress).mockResolvedValue(50)

      const result = await CertificateService.getCertificateData('user-1', 'course-1')

      expect(result).toBeNull()
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled()
    })

    it('should return null if user or course not found', async () => {
      // @ts-ignore
      vi.mocked(ProgressService.getCourseProgress).mockResolvedValue(100)
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null)

      const result = await CertificateService.getCertificateData('user-1', 'course-1')

      expect(result).toBeNull()
    })
  })
})
