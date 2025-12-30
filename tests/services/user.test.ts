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

// Mock bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
  },
}))

import { UserService } from '@/services/user'
import { prisma } from '@/lib/prisma'
import { ProgressService } from '@/services/progress'
import bcrypt from 'bcryptjs'

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep>

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserByEmail', () => {
    it('should return user if found', async () => {
      const mockUser = { id: 'user-1', email: 'test@test.com' }
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(mockUser)

      const result = await UserService.getUserByEmail('test@test.com')

      expect(result).toEqual(mockUser)
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' }
      })
    })

    it('should return null if not found', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null)

      const result = await UserService.getUserByEmail('notfound@test.com')

      expect(result).toBeNull()
    })
  })

  describe('createUser', () => {
    it('should hash password and create user', async () => {
      const userData = { name: 'Test', email: 'test@test.com', password: 'password123', role: 'STUDENT' }
      const hashedPassword = 'hashed_password'
      const createdUser = { id: 'user-1', ...userData, password: hashedPassword }

      // @ts-ignore
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword)
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue(createdUser)

      const result = await UserService.createUser(userData)

      expect(result).toEqual(createdUser)
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Test',
          email: 'test@test.com',
          password: hashedPassword,
          role: 'STUDENT'
        }
      })
    })
  })

  describe('hasAccess', () => {
    it('should return true if user is ADMIN', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({ id: 'admin-1', role: 'ADMIN' })
      // @ts-ignore
      prismaMock.course.findUnique.mockResolvedValue({ id: 'course-1', instructorId: 'inst-1' })

      const result = await UserService.hasAccess('admin-1', 'course-1')

      expect(result).toBe(true)
    })

    it('should return true if user is instructor of the course', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({ id: 'inst-1', role: 'INSTRUCTOR' })
      // @ts-ignore
      prismaMock.course.findUnique.mockResolvedValue({ id: 'course-1', instructorId: 'inst-1' })

      const result = await UserService.hasAccess('inst-1', 'course-1')

      expect(result).toBe(true)
    })

    it('should return true if user purchased the course', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({ id: 'student-1', role: 'STUDENT' })
      // @ts-ignore
      prismaMock.course.findUnique.mockResolvedValue({ id: 'course-1', instructorId: 'inst-1' })
      // @ts-ignore
      prismaMock.purchase.findUnique.mockResolvedValue({ id: 'purchase-1' })

      const result = await UserService.hasAccess('student-1', 'course-1')

      expect(result).toBe(true)
    })

    it('should return false if no access', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({ id: 'student-1', role: 'STUDENT' })
      // @ts-ignore
      prismaMock.course.findUnique.mockResolvedValue({ id: 'course-1', instructorId: 'inst-1' })
      // @ts-ignore
      prismaMock.purchase.findUnique.mockResolvedValue(null)

      const result = await UserService.hasAccess('student-1', 'course-1')

      expect(result).toBe(false)
    })
  })

  describe('getEnrolledCourses', () => {
    it('should return enrolled courses with progress', async () => {
      const mockPurchases = [
        {
          courseId: 'course-1',
          course: { id: 'course-1', title: 'Course 1' }
        }
      ]

      // @ts-ignore
      prismaMock.purchase.findMany.mockResolvedValue(mockPurchases)
      // @ts-ignore
      vi.mocked(ProgressService.getCourseProgress).mockResolvedValue(75)

      const result = await UserService.getEnrolledCourses('user-1')

      expect(result).toHaveLength(1)
      expect(result[0].progress).toBe(75)
      expect(ProgressService.getCourseProgress).toHaveBeenCalledWith('user-1', 'course-1')
    })
  })
})
