'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { OAuthButtons } from '@/components/ui/oauth-buttons'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, startOAuth } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في Fyleo',
      })
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message || 'تأكد من البريد الإلكتروني وكلمة المرور',
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
        title: `خطأ في تسجيل الدخول بـ ${provider}`,
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
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              إنشاء حساب جديد
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
                تذكرني
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
