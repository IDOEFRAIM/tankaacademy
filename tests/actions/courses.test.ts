import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCourse, updateCourse } from '@/actions/courses'
import { AuthService, CoursesService } from '@/services'

// Mock dependencies
vi.mock('@/services', () => ({
  AuthService: {
    requireInstructor: vi.fn(),
  },
  CoursesService: {
    createCourse: vi.fn(),
    updateCourse: vi.fn(),
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Courses Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createCourse', () => {
    it('should create course if user is instructor and data is valid', async () => {
      // Arrange
      const mockUser = { id: 'inst-1' }
      const mockCourse = { id: 'course-1', title: 'New Course' }
      
      // @ts-ignore
      vi.mocked(AuthService.requireInstructor).mockResolvedValue(mockUser)
      // @ts-ignore
      vi.mocked(CoursesService.createCourse).mockResolvedValue(mockCourse)

      // Act
      const result = await createCourse({ title: 'New Course' })

      // Assert
      expect(result).toEqual({ success: "Cours créé avec succès", course: mockCourse })
      expect(AuthService.requireInstructor).toHaveBeenCalled()
      expect(CoursesService.createCourse).toHaveBeenCalledWith('inst-1', 'New Course')
    })

    it('should return error if validation fails', async () => {
      // Arrange
      // @ts-ignore
      vi.mocked(AuthService.requireInstructor).mockResolvedValue({ id: 'inst-1' })

      // Act
      // @ts-ignore - Testing invalid input
      const result = await createCourse({ title: '' })

      // Assert
      expect(result).toEqual({ error: "Champs invalides" })
      expect(CoursesService.createCourse).not.toHaveBeenCalled()
    })

    it('should return error if user is not instructor', async () => {
      // Arrange
      vi.mocked(AuthService.requireInstructor).mockRejectedValue(new Error("Accès refusé : Vous n'êtes pas instructeur"))

      // Act
      const result = await createCourse({ title: 'New Course' })

      // Assert
      expect(result).toEqual({ error: "Non autorisé" })
    })
  })

  describe('updateCourse', () => {
    it('should update course if authorized', async () => {
      // Arrange
      const mockUser = { id: 'inst-1' }
      const mockCourse = { id: 'course-1', title: 'Updated' }
      
      // @ts-ignore
      vi.mocked(AuthService.requireInstructor).mockResolvedValue(mockUser)
      // @ts-ignore
      vi.mocked(CoursesService.updateCourse).mockResolvedValue(mockCourse)

      // Act
      const result = await updateCourse('course-1', { title: 'Updated' })

      // Assert
      expect(result).toEqual({ success: "Cours mis à jour", course: mockCourse })
      expect(CoursesService.updateCourse).toHaveBeenCalledWith('course-1', 'inst-1', { title: 'Updated' })
    })
  })
})
