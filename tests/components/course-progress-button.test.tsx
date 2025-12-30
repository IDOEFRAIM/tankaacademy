import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CourseProgressButton } from '@/components/course-progress-button'
import * as progressActions from '@/actions/progress'

// Mocks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
  }),
}))

vi.mock('@/hooks/use-confetti', () => ({
  useConfetti: () => ({
    onOpen: vi.fn(),
  }),
}))

vi.mock('@/hooks/use-lesson-complete-modal', () => ({
  useLessonCompleteModal: () => ({
    onOpen: vi.fn(),
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock server action
vi.mock('@/actions/progress', () => ({
  updateProgress: vi.fn(),
}))

describe('CourseProgressButton', () => {
  const defaultProps = {
    lessonId: 'lesson-1',
    courseId: 'course-1',
    nextLessonId: 'lesson-2',
    isCompleted: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly as not completed', () => {
    render(<CourseProgressButton {...defaultProps} />)
    
    expect(screen.getByText('Marquer comme terminé')).toBeInTheDocument()
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('renders correctly as completed', () => {
    render(<CourseProgressButton {...defaultProps} isCompleted={true} />)
    
    expect(screen.getByText('Non terminé')).toBeInTheDocument()
  })

  it('calls updateProgress when clicked', async () => {
    // Arrange
    const updateProgressMock = vi.spyOn(progressActions, 'updateProgress').mockResolvedValue({} as any)
    
    render(<CourseProgressButton {...defaultProps} />)
    
    // Act
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Assert
    expect(button).toBeDisabled() // Should be disabled while loading
    
    await waitFor(() => {
      expect(updateProgressMock).toHaveBeenCalledWith('lesson-1', true)
    })
    
    expect(button).not.toBeDisabled()
  })
})
