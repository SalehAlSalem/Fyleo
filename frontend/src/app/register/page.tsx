'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { OAuthButtons } from '@/components/ui/oauth-buttons'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { register, startOAuth } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمات المرور غير متطابقة',
        variant: 'destructive',
      })
      return
    }

    if (formData.password.length < 8) {
      toast({
        title: 'خطأ',
        description: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      await register(formData.email, formData.password, formData.name)
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'مرحباً بك في Fyleo',
      })
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'خطأ في إنشاء الحساب',
        description: error.message || 'حدث خطأ، حاول مرة أخرى',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    try {
      await startOAuth(provider)
    } catch (error: any) {
      toast({
        title: `خطأ في التسجيل بـ ${provider}`,
        description: error.message || 'حاول مرة أخرى',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              تسجيل الدخول لحساب موجود
            </Link>
          </p>
        </div>

        <OAuthButtons
          onGoogleLogin={() => handleOAuthLogin('google')}
          onGithubLogin={() => handleOAuthLogin('github')}
          isLoading={isLoading}
        />
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الكامل
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="أحمد محمد"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                تأكيد كلمة المرور
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </Button>
          </div>

          <div className="text-xs text-center text-gray-500">
            بإنشاء حساب، أنت توافق على{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              شروط الخدمة
            </Link>
            {' و '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              سياسة الخصوصية
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
