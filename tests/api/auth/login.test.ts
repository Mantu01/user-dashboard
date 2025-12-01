import { POST } from '@/app/api/auth/login/route'
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { generateToken } from '@/lib/auth'

// Mock dependencies
jest.mock('@/lib/mongodb')
jest.mock('@/models/User')
jest.mock('@/lib/auth')

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>
const mockUser = User as jest.Mocked<typeof User>
const mockGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConnectDB.mockResolvedValue()
  })

  it('should return 400 if identifier or password is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'test' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Username/email and password are required')
  })

  it('should return 401 if user not found', async () => {
    mockUser.findOne = jest.fn().mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: 'nonexistent',
        password: 'password123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid credentials')
  })

  it('should return 401 if password is incorrect', async () => {
    const mockUserInstance = {
      _id: 'user123',
      email: 'test@example.com',
      username: 'testuser',
      comparePassword: jest.fn().mockResolvedValue(false),
    }

    mockUser.findOne = jest.fn().mockResolvedValue(mockUserInstance)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: 'testuser',
        password: 'wrongpassword',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid credentials')
    expect(mockUserInstance.comparePassword).toHaveBeenCalledWith('wrongpassword')
  })

  it('should return 200 and set cookie on successful login', async () => {
    const mockUserInstance = {
      _id: { toString: () => 'user123' },
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      phone: '',
      bio: '',
      position: '',
      department: '',
      avatar: '',
      comparePassword: jest.fn().mockResolvedValue(true),
    }

    mockUser.findOne = jest.fn().mockResolvedValue(mockUserInstance)
    mockGenerateToken.mockReturnValue('mock-jwt-token')

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: 'testuser',
        password: 'password123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Login successful')
    expect(data.user).toBeDefined()
    expect(mockGenerateToken).toHaveBeenCalledWith(mockUserInstance)
    
    // Check cookie is set
    const cookieHeader = response.headers.get('set-cookie')
    expect(cookieHeader).toContain('token=mock-jwt-token')
  })

  it('should handle database errors', async () => {
    mockUser.findOne = jest.fn().mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: 'testuser',
        password: 'password123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBeDefined()
  })
})

