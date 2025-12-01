import { generateToken, verifyToken, getTokenFromRequest, getUserIdFromRequest } from '@/lib/auth'
import { NextRequest } from 'next/server'
import { IUser } from '@/models/User'

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((payload, secret, options) => 'mock-token'),
  verify: jest.fn((token, secret) => {
    if (token === 'valid-token') {
      return { userId: 'user123', email: 'test@example.com' }
    }
    throw new Error('Invalid token')
  }),
}))

describe('Auth Utilities', () => {
  const mockUser = {
    _id: { toString: () => 'user123' },
    email: 'test@example.com',
  } as unknown as IUser

  describe('generateToken', () => {
    it('should generate a token for a user', () => {
      const token = generateToken(mockUser)
      expect(token).toBe('mock-token')
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = verifyToken('valid-token')
      expect(payload).toEqual({ userId: 'user123', email: 'test@example.com' })
    })

    it('should return null for invalid token', () => {
      const payload = verifyToken('invalid-token')
      expect(payload).toBeNull()
    })
  })

  describe('getTokenFromRequest', () => {
    it('should extract token from Authorization header', () => {
      const headers = new Headers()
      headers.set('authorization', 'Bearer test-token')
      const request = new NextRequest('http://localhost:3000', { headers })

      const token = getTokenFromRequest(request)
      expect(token).toBe('test-token')
    })

    it('should extract token from cookies', () => {
      const request = new NextRequest('http://localhost:3000')
      request.cookies.set('token', 'cookie-token')

      const token = getTokenFromRequest(request)
      expect(token).toBe('cookie-token')
    })

    it('should return null if no token found', () => {
      const request = new NextRequest('http://localhost:3000')
      const token = getTokenFromRequest(request)
      expect(token).toBeNull()
    })
  })

  describe('getUserIdFromRequest', () => {
    it('should extract user ID from valid token', () => {
      const request = new NextRequest('http://localhost:3000')
      request.cookies.set('token', 'valid-token')

      const userId = getUserIdFromRequest(request)
      expect(userId).toBe('user123')
    })

    it('should return null for invalid token', () => {
      const request = new NextRequest('http://localhost:3000')
      request.cookies.set('token', 'invalid-token')

      const userId = getUserIdFromRequest(request)
      expect(userId).toBeNull()
    })

    it('should return null if no token', () => {
      const request = new NextRequest('http://localhost:3000')
      const userId = getUserIdFromRequest(request)
      expect(userId).toBeNull()
    })
  })
})

