"use client"

import { AuthForm } from '@/components/auth/authForm'
import React from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = React.useState(true)
  const [checkingAuth, setCheckingAuth] = React.useState(true)

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/me')
        if (response.data.authenticated) {
          router.push('/dashboard')
        }
      } catch (error) {
      } finally {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-green-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-green-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-white">
              Welcome to{' '}
              <span className="text-green-400">Premium</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
              Experience the future of authentication with our secure, professional platform built for excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">256-bit</div>
                <div className="text-gray-400">Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <div className="flex w-full mb-8 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                    isLogin
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                    !isLogin
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
              <AuthForm isLogin={isLogin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}