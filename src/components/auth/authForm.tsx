"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Mail, User, Loader2 } from 'lucide-react'
import axios from 'axios'

interface AuthFormProps {
  isLogin?: boolean
}

export function AuthForm({ isLogin = true }: AuthFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [formData, setFormData] = React.useState({
    identifier: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Clear error when switching between login/signup
  React.useEffect(() => {
    setError('')
    setFormData({
      identifier: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
  }, [isLogin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const response = await axios.post('/api/auth/login', {
          identifier: formData.identifier,
          password: formData.password,
        })

        if (response.data) {
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }

        const response = await axios.post('/api/auth/register', {
          username: formData.username || formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })

        if (response.data) {
          router.push('/dashboard')
          router.refresh()
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? 'Welcome back' : 'Create account'}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin 
            ? 'Enter your credentials to access your account' 
            : 'Enter your information to create an account'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 w-full"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={isLogin ? "identifier" : "email"} className="text-sm font-medium">
              {isLogin ? "Username or Email" : "Email"}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id={isLogin ? "identifier" : "email"}
                type={isLogin ? "text" : "email"}
                placeholder={isLogin ? "Enter username or email" : "Enter your email"}
                value={isLogin ? formData.identifier : formData.email}
                onChange={handleChange}
                className="pl-10 pr-4 py-2 w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10 py-2 w-full"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10 py-2 w-full"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <Label htmlFor="remember" className="text-sm font-medium">
                  Remember me
                </Label>
              </div>
              <Button variant="link" type="button" className="p-0 h-auto text-green-600 hover:text-green-700">
                Forgot password?
              </Button>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? 'Sign in' : 'Create account'
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Button variant="link" type="button" className="p-0 h-auto ml-1 text-green-600 hover:text-green-700">
            {isLogin ? 'Sign up' : 'Sign in'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}