import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthForm } from '@/components/auth/authForm'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock next/navigation
const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

describe('AuthForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Login Form', () => {
    it('renders login form by default', () => {
      render(<AuthForm isLogin={true} />)
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    })

    it('shows password toggle button', async () => {
      const user = userEvent.setup()
      render(<AuthForm isLogin={true} />)
      
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement
      const toggleButton = screen.getByRole('button', { name: '' })
      
      expect(passwordInput.type).toBe('password')
      await user.click(toggleButton)
      expect(passwordInput.type).toBe('text')
    })

    it('submits login form with valid credentials', async () => {
      const user = userEvent.setup()
      mockedAxios.post.mockResolvedValueOnce({
        data: { message: 'Login successful', user: {} },
      })

      render(<AuthForm isLogin={true} />)
      
      await user.type(screen.getByLabelText(/username or email/i), 'testuser')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', {
          identifier: 'testuser',
          password: 'password123',
        })
      })
    })

    it('displays error message on login failure', async () => {
      const user = userEvent.setup()
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { error: 'Invalid credentials' } },
      })

      render(<AuthForm isLogin={true} />)
      
      await user.type(screen.getByLabelText(/username or email/i), 'testuser')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })
  })

  describe('Register Form', () => {
    it('renders register form', () => {
      render(<AuthForm isLogin={false} />)
      expect(screen.getByText(/create account/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    })

    it('validates password match', async () => {
      const user = userEvent.setup()
      render(<AuthForm isLogin={false} />)
      
      await user.type(screen.getByLabelText(/username/i), 'newuser')
      await user.type(screen.getByLabelText(/email/i), 'newuser@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'differentpassword')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })
    })

    it('submits registration form with valid data', async () => {
      const user = userEvent.setup()
      mockedAxios.post.mockResolvedValueOnce({
        data: { message: 'User registered successfully', user: {} },
      })

      render(<AuthForm isLogin={false} />)
      
      await user.type(screen.getByLabelText(/username/i), 'newuser')
      await user.type(screen.getByLabelText(/email/i), 'newuser@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/register', {
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
      })
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    mockedAxios.post.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<AuthForm isLogin={true} />)
    
    await user.type(screen.getByLabelText(/username or email/i), 'testuser')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    })
  })
})

