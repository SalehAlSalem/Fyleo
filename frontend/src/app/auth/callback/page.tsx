'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { useToast } from '@/hooks/use-toast'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { finishOAuth } = useAuthStore()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (error) {
      toast({
        title: 'فشل تسجيل الدخول',
        description: errorDescription || error,
        variant: 'destructive',
      })
      router.replace('/login')
      return
    }

    if (!code) {
      toast({
        title: 'فشل تسجيل الدخول',
        description: 'لم يتم استلام رمز المصادقة',
        variant: 'destructive',
      })
      router.replace('/login')
      return
    }

    finishOAuth(code, state)
      .then(() => {
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في Fyleo',
        })
        router.replace('/dashboard')
      })
      .catch((err: any) => {
        toast({
          title: 'فشل تسجيل الدخول',
          description: err?.message || 'حاول مرة أخرى',
          variant: 'destructive',
        })
        router.replace('/login')
      })
  }, [finishOAuth, router, searchParams, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <h1 className="text-xl font-semibold text-gray-900">جاري إكمال تسجيل الدخول...</h1>
        <p className="text-sm text-gray-600 mt-2">يرجى الانتظار ثواني قليلة</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h1 className="text-xl font-semibold text-gray-900">جاري التحميل...</h1>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
