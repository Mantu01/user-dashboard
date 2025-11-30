"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Mail, Phone, User, Lock, Edit3, Save, Shield, Loader2, LogOut, Image as ImageIcon } from 'lucide-react'
import axios from 'axios'
import { useToast, ToastContainer } from '@/components/ui/toast'

export default function Dashboard() {
  const router = useRouter()
  const { toasts, showToast, removeToast } = useToast()
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [passwordLoading, setPasswordLoading] = React.useState(false)
  const [avatarLoading, setAvatarLoading] = React.useState(false)
  const [bannerLoading, setBannerLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [avatar, setAvatar] = React.useState('')
  const [banner, setBanner] = React.useState('')
  const [userData, setUserData] = React.useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    position: "",
    department: ""
  })
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const avatarInputRef = React.useRef<HTMLInputElement>(null)
  const bannerInputRef = React.useRef<HTMLInputElement>(null)

  // Fetch user profile on mount
  React.useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/user/profile')
      if (response.data.user) {
        setUserData({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
          bio: response.data.user.bio || "",
          position: response.data.user.position || "",
          department: response.data.user.department || ""
        })
        setAvatar(response.data.user.avatar || '')
        setBanner(response.data.user.banner || '')
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/')
      } else {
        setError(err.response?.data?.error || 'Failed to load profile')
        showToast(err.response?.data?.error || 'Failed to load profile', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      const response = await axios.put('/api/user/profile', userData)
      if (response.data) {
        setSuccess('Profile updated successfully!')
        showToast('Profile updated successfully!', 'success')
        setIsEditing(false)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update profile'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    try {
      setPasswordLoading(true)
      setError('')
      setSuccess('')
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        const errorMsg = 'New passwords do not match'
        setError(errorMsg)
        showToast(errorMsg, 'error')
        setPasswordLoading(false)
        return
      }

      const response = await axios.put('/api/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      })
      
      if (response.data) {
        setSuccess('Password updated successfully!')
        showToast('Password updated successfully!', 'success')
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update password'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error')
      return
    }

    try {
      setAvatarLoading(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await axios.put('/api/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.avatar) {
        setAvatar(response.data.avatar)
        showToast('Avatar updated successfully!', 'success')
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update avatar'
      showToast(errorMsg, 'error')
    } finally {
      setAvatarLoading(false)
      if (avatarInputRef.current) {
        avatarInputRef.current.value = ''
      }
    }
  }

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size must be less than 10MB', 'error')
      return
    }

    try {
      setBannerLoading(true)
      const formData = new FormData()
      formData.append('banner', file)

      const response = await axios.put('/api/user/banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.banner) {
        setBanner(response.data.banner)
        showToast('Banner updated successfully!', 'success')
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update banner'
      showToast(errorMsg, 'error')
    } finally {
      setBannerLoading(false)
      if (bannerInputRef.current) {
        bannerInputRef.current.value = ''
      }
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      console.error('Logout error:', err)
      // Still redirect even if logout fails
      router.push('/')
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-green-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-green-900">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Banner */}
      <div 
        className="h-48 bg-linear-to-r from-green-600 to-green-800 relative bg-cover bg-center"
        style={banner ? { backgroundImage: `url(${banner})` } : {}}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            variant="outline"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        <div className="absolute top-4 left-4 z-10">
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="hidden"
            id="banner-upload"
          />
          <Button
            onClick={() => bannerInputRef.current?.click()}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            variant="outline"
            disabled={bannerLoading}
          >
            {bannerLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4 mr-2" />
                {banner ? 'Change Banner' : 'Upload Banner'}
              </>
            )}
          </Button>
        </div>
        <div className="absolute -bottom-16 left-8 z-10">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={avatar || "/api/placeholder/128/128"} alt="Profile" />
              <AvatarFallback className="bg-green-600 text-white text-2xl font-bold">
                {userData.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
            />
            <Button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-green-600 hover:bg-green-700 p-0 disabled:opacity-50"
              disabled={avatarLoading}
            >
              {avatarLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Camera className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 pt-20 pb-8 max-w-7xl mx-auto">
        {(error || success) && (
          <div className={`mb-6 p-4 rounded-md ${
            error ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-green-50 border border-green-200 text-green-600'
          }`}>
            {error || success}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-white font-bold">
                    {userData.name || 'User'}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {userData.position && userData.department 
                      ? `${userData.position} • ${userData.department}`
                      : userData.position || userData.department || 'No position set'
                    }
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile()
                    } else {
                      setIsEditing(true)
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium text-gray-300">
                      Position
                    </Label>
                    <Input
                      id="position"
                      value={userData.position}
                      onChange={(e) => setUserData({...userData, position: e.target.value})}
                      disabled={!isEditing}
                      className="bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={userData.bio}
                    onChange={(e) => setUserData({...userData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={4}
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-50 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm font-medium text-gray-300">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-medium text-gray-300">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleUpdatePassword}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}