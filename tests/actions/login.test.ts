import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from '@/actions/login'

// Mock next-auth signIn
vi.mock('@/auth', () => ({
  signIn: vi.fn(),
}))

// Mock next-auth AuthError
vi.mock('next-auth', () => {
  return {
    AuthError: class AuthError extends Error {
      type: string
      constructor(type: string) {
        super(type)
        this.type = type
      }
    }
  }
})

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

describe('Login Action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call signIn with correct credentials', async () => {
    const credentials = { email: 'test@test.com', password: 'password123' }
    
    // @ts-ignore
    await login(credentials)

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'test@test.com',
      password: 'password123',
      redirectTo: '/'
    })
  })

  it('should return error on invalid fields', async () => {
    const invalidCredentials = { email: 'invalid', password: '' }
    
    const result = await login(invalidCredentials)

    expect(result).toEqual({ success: false, error: "Champs invalides" })
    expect(signIn).not.toHaveBeenCalled()
  })

  it('should handle CredentialsSignin error', async () => {
    const credentials = { email: 'test@test.com', password: 'wrong' }
    
    // Mock signIn throwing AuthError
    // @ts-ignore
    vi.mocked(signIn).mockRejectedValue(new AuthError('CredentialsSignin'))

    const result = await login(credentials)

    expect(result).toEqual({ success: false, error: "Identifiants invalides !" })
  })

  it('should handle generic errors', async () => {
    const credentials = { email: 'test@test.com', password: 'password123' }
    // @ts-ignore
    vi.mocked(signIn).mockRejectedValue(new Error('Random error'))

    // The action re-throws generic errors that are not AuthError? 
    // Looking at the code: catch (error) { if (error instanceof AuthError) ... throw error }
    // So generic errors should be thrown.
    
    await expect(login(credentials)).rejects.toThrow('Random error')
  })
})
