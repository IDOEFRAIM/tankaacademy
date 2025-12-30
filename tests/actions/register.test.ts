import { describe, it, expect, vi, beforeEach } from 'vitest'
import { register } from '@/actions/register'
import { UserService } from '@/services/user'

vi.mock('@/services/user', () => ({
  UserService: {
    getUserByEmail: vi.fn(),
    createUser: vi.fn(),
  },
}))

describe('Register Action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register user successfully', async () => {
    // Arrange
    const validData = {
      name: 'New User',
      email: 'new@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'STUDENT'
    }

    // @ts-ignore
    vi.mocked(UserService.getUserByEmail).mockResolvedValue(null)
    // @ts-ignore
    vi.mocked(UserService.createUser).mockResolvedValue({ id: 'user-1', ...validData })

    // Act
    // @ts-ignore
    const result = await register(validData)

    // Assert
    expect(result).toEqual({ success: true, message: "Inscription réussie !" })
    expect(UserService.createUser).toHaveBeenCalledWith({
      name: 'New User',
      email: 'new@test.com',
      password: 'password123',
      role: 'STUDENT'
    })
  })

  it('should return error if email already exists', async () => {
    // Arrange
    const validData = {
      name: 'Existing User',
      email: 'existing@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'STUDENT'
    }

    // @ts-ignore
    vi.mocked(UserService.getUserByEmail).mockResolvedValue({ id: 'user-1' })

    // Act
    // @ts-ignore
    const result = await register(validData)

    // Assert
    expect(result).toEqual({ success: false, error: "Cet email est déjà utilisé." })
    expect(UserService.createUser).not.toHaveBeenCalled()
  })

  it('should return error if validation fails', async () => {
    // Arrange
    const invalidData = {
      name: '', // Invalid
      email: 'invalid-email', // Invalid
      password: '123', // Too short
      role: 'STUDENT'
    }

    // Act
    // @ts-ignore
    const result = await register(invalidData)

    // Assert
    expect(result).toEqual({ success: false, error: "Champs invalides !" })
    expect(UserService.getUserByEmail).not.toHaveBeenCalled()
  })
})
