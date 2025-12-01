import { GET, PUT } from '@/app/api/user/profile/route'
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { getUserIdFromRequest } from '@/lib/auth'

// Mock dependencies
jest.mock('@/lib/mongodb')
jest.mock('@/models/User')
jest.mock('@/lib/auth')

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>
const mockUser = User as jest.Mocked<typeof User>
const mockGetUserIdFromRequest = getUserIdFromRequest as jest.MockedFunction<typeof getUserIdFromRequest>

describe('GET /api/user/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConnectDB.mockResolvedValue(undefined)
  })

  it('should return 401 if user is not authenticated', async () => {
    mockGetUserIdFromRequest.mockReturnValue(null)

    const request = new NextRequest('http://localhost:3000/api/user/profile')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 404 if user not found', async () => {
    mockGetUserIdFromRequest.mockReturnValue('user123')
    mockUser.findById = jest.fn().mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/user/profile')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('User not found')
  })

  it('should return user profile on success', async () => {
    const mockUserInstance = {
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      phone: '+1234567890',
      bio: 'Test bio',
      position: 'Developer',
      department: 'Engineering',
      avatar: 'https://example.com/avatar.jpg',
      banner: 'https://example.com/banner.jpg',
    }

    mockGetUserIdFromRequest.mockReturnValue('user123')
    mockUser.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUserInstance),
    })

    const request = new NextRequest('http://localhost:3000/api/user/profile')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.user).toEqual({
      id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      phone: '+1234567890',
      bio: 'Test bio',
      position: 'Developer',
      department: 'Engineering',
      avatar: 'https://example.com/avatar.jpg',
      banner: 'https://example.com/banner.jpg',
    })
  })
})

describe('PUT /api/user/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConnectDB.mockResolvedValue(undefined)
  })

  it('should return 401 if user is not authenticated', async () => {
    mockGetUserIdFromRequest.mockReturnValue(null)

    const request = new NextRequest('http://localhost:3000/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name: 'New Name' }),
    })

    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should update user profile successfully', async () => {
    const mockUserInstance = {
      _id: 'user123',
      email: 'test@example.com',
      name: 'Old Name',
      phone: '',
      bio: '',
      position: '',
      department: '',
      save: jest.fn().mockResolvedValue(undefined),
    }

    mockGetUserIdFromRequest.mockReturnValue('user123')
    mockUser.findById = jest.fn().mockResolvedValue(mockUserInstance)
    mockUser.findOne = jest.fn().mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify({
        name: 'New Name',
        phone: '+1234567890',
        bio: 'New bio',
        position: 'Senior Developer',
        department: 'Engineering',
      }),
    })

    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Profile updated successfully')
    expect(mockUserInstance.name).toBe('New Name')
    expect(mockUserInstance.save).toHaveBeenCalled()
  })

  it('should return 400 if email is already in use', async () => {
    const mockUserInstance = {
      _id: 'user123',
      email: 'old@example.com',
      save: jest.fn(),
    }

    const existingUser = {
      _id: 'otheruser',
      email: 'new@example.com',
    }

    mockGetUserIdFromRequest.mockReturnValue('user123')
    mockUser.findById = jest.fn().mockResolvedValue(mockUserInstance)
    mockUser.findOne = jest.fn().mockResolvedValue(existingUser)

    const request = new NextRequest('http://localhost:3000/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify({
        email: 'new@example.com',
      }),
    })

    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email already in use')
  })
})

