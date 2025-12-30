import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockDeep } from 'vitest-mock-extended'

// 1. Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: mockDeep(),
}))

// 2. Mock ProgressService
vi.mock('@/services/progress', () => ({
  ProgressService: {
    getCourseProgress: vi.fn(),
  },
}))

import { CoursesService, getCourses } from '@/services/courses'
import { prisma } from '@/lib/prisma'
import { ProgressService } from '@/services/progress'

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep>

describe('CoursesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPublishedCourses', () => {
    it('should return published courses', async () => {
      // Arrange
      const mockCourses = [
        {
          id: 'course-1',
          title: 'Course 1',
          status: 'PUBLISHED',
          category: { id: 'cat-1', name: 'Tech' },
          chapters: [{ id: 'ch-1' }],
          purchases: []
        }
      ]

      // @ts-ignore
      prismaMock.course.findMany.mockResolvedValue(mockCourses)

      // Act
      const result = await CoursesService.getPublishedCourses({})

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Course 1')
      expect(prismaMock.course.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          status: 'PUBLISHED'
        })
      }))
    })

    it('should filter by title', async () => {
      // Arrange
      // @ts-ignore
      prismaMock.course.findMany.mockResolvedValue([])

      // Act
      await CoursesService.getPublishedCourses({ title: 'React' })

      // Assert
      expect(prismaMock.course.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          title: {
            contains: 'React',
            mode: 'insensitive'
          }
        })
      }))
    })
  })
})

describe('getCourses (with progress)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return courses with progress for logged in user', async () => {
    // Arrange
    const mockCourses = [
      {
        id: 'course-1',
        title: 'Course 1',
        purchases: [{ id: 'purchase-1' }], // User has purchased
        chapters: [],
        category: null
      }
    ]

    // @ts-ignore
    prismaMock.course.findMany.mockResolvedValue(mockCourses)
    // @ts-ignore
    vi.mocked(ProgressService.getCourseProgress).mockResolvedValue(50)

    // Act
    const result = await getCourses({ userId: 'user-1' })

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].progress).toBe(50)
    expect(ProgressService.getCourseProgress).toHaveBeenCalledWith('user-1', 'course-1')
  })

  it('should return null progress if not purchased', async () => {
    // Arrange
    const mockCourses = [
      {
        id: 'course-2',
        title: 'Course 2',
        purchases: [], // Not purchased
        chapters: [],
        category: null
      }
    ]

    // @ts-ignore
    prismaMock.course.findMany.mockResolvedValue(mockCourses)

    // Act
    const result = await getCourses({ userId: 'user-1' })

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].progress).toBeNull()
    expect(ProgressService.getCourseProgress).not.toHaveBeenCalled()
  })
})

describe('CoursesService CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCourseById', () => {
    it('should return course with details', async () => {
      const mockCourse = { id: 'course-1', title: 'Course 1' }
      // @ts-ignore
      prismaMock.course.findUnique.mockResolvedValue(mockCourse)

      const result = await CoursesService.getCourseById('course-1', 'user-1')

      expect(result).toEqual(mockCourse)
      expect(prismaMock.course.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'course-1' },
        include: expect.anything()
      }))
    })
  })

  describe('createCourse', () => {
    it('should create a course with slug', async () => {
      const mockCourse = { id: 'course-1', title: 'New Course', slug: 'new-course-123' }
      // @ts-ignore
      prismaMock.course.create.mockResolvedValue(mockCourse)

      const result = await CoursesService.createCourse('inst-1', 'New Course')

      expect(result).toEqual(mockCourse)
      expect(prismaMock.course.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          instructorId: 'inst-1',
          title: 'New Course',
          slug: expect.stringMatching(/^new-course-\d+$/)
        })
      })
    })
  })

  describe('updateCourse', () => {
    it('should update course fields', async () => {
      const mockCourse = { id: 'course-1', title: 'Updated Title' }
      // @ts-ignore
      prismaMock.course.update.mockResolvedValue(mockCourse)

      const result = await CoursesService.updateCourse('course-1', 'inst-1', { title: 'Updated Title' })

      expect(result).toEqual(mockCourse)
      expect(prismaMock.course.update).toHaveBeenCalledWith({
        where: { id: 'course-1', instructorId: 'inst-1' },
        data: { title: 'Updated Title' }
      })
    })
  })

  describe('deleteCourse', () => {
    it('should delete course', async () => {
      const mockCourse = { id: 'course-1' }
      // @ts-ignore
      prismaMock.course.delete.mockResolvedValue(mockCourse)

      const result = await CoursesService.deleteCourse('course-1', 'inst-1')

      expect(result).toEqual(mockCourse)
      expect(prismaMock.course.delete).toHaveBeenCalledWith({
        where: { id: 'course-1', instructorId: 'inst-1' }
      })
    })
  })
})
