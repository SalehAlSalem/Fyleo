'use client'

import { create } from 'zustand'
import { pb, type User } from '@/lib/pocketbase'

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  startOAuth: (provider: 'google' | 'github') => Promise<void>
  finishOAuth: (code: string, state?: string | null) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  checkAuth: () => {
    try {
      const token = pb.authStore.token
      const user = pb.authStore.model as User | null
      
      set({ 
        user, 
        token,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Check auth error:', error)
      set({ 
        user: null, 
        token: null,
        isLoading: false,
        error: 'فشل التحقق من الجلسة'
      })
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      console.log('🔐 Attempting login to:', pb.baseUrl)
      console.log('📧 Email:', email)
      
      const authData = await pb.collection('users').authWithPassword(email, password)
      
      console.log('✅ Login successful')
      console.log('Token received:', authData.token.substring(0, 20) + '...')
      console.log('User data:', authData.record)
      
      set({ 
        user: authData.record as User,
        token: authData.token,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      console.error('❌ Login error occurred')
      console.error('Error type:', error?.constructor?.name)
      console.error('Error message:', error?.message)
      console.error('Error status:', error?.status)
      console.error('Error data:', error?.data)
      console.error('Error response:', error?.response)
      console.error('Full error object:', JSON.stringify(error, null, 2))
      
      // Provide helpful error messages based on error type
      let errorMessage = 'فشل تسجيل الدخول'
      
      if (error?.status === 401) {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      } else if (error?.status === 400) {
        errorMessage = 'البيانات المدخلة غير صحيحة: ' + (error?.data?.message || 'خطأ في الطلب')
      } else if (error?.message?.includes('collection')) {
        errorMessage = 'خطأ في إعدادات قاعدة البيانات (مجموعة users غير موجودة)'
      } else if (error?.message?.includes('auth')) {
        errorMessage = 'لم يتم تفعيل خاصية المصادقة على المجموعة'
      } else {
        errorMessage = error?.message || error?.data?.message || 'فشل تسجيل الدخول'
      }
      
      set({ 
        user: null,
        token: null,
        isLoading: false,
        error: errorMessage
      })
      throw new Error(errorMessage)
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null })
    try {
      console.log('📝 Attempting registration to:', pb.baseUrl)
      console.log('📧 Email:', email)
      console.log('👤 Name:', name)
      
      const data = {
        email,
        password,
        passwordConfirm: password,
        name,
        username: email.split('@')[0],
        emailVisibility: true,
      }

      console.log('📤 Sending registration data:', JSON.stringify(data, null, 2))
      
      const createResponse = await pb.collection('users').create(data)
      console.log('✅ Account created successfully')
      console.log('Created user:', createResponse)
      
      // Auto login after registration
      console.log('🔐 Auto-logging in...')
      const authData = await pb.collection('users').authWithPassword(email, password)
      
      console.log('✅ Registration and auto-login successful')
      
      set({ 
        user: authData.record as User,
        token: authData.token,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      console.error('❌ Registration error occurred')
      console.error('Error type:', error?.constructor?.name)
      console.error('Error message:', error?.message)
      console.error('Error status:', error?.status)
      console.error('Error data:', error?.data)
      console.error('Error response:', error?.response)
      console.error('Full error object:', JSON.stringify(error, null, 2))
      
      // Provide helpful error messages based on error type
      let errorMessage = 'فشل إنشاء الحساب'
      
      if (error?.status === 400) {
        errorMessage = 'البيانات المدخلة غير صحيحة: ' + (error?.data?.message || 'خطأ في الطلب')
      } else if (error?.status === 409) {
        errorMessage = 'هذا البريد الإلكتروني مستخدم بالفعل'
      } else if (error?.message?.includes('collection')) {
        errorMessage = 'خطأ في إعدادات قاعدة البيانات (مجموعة users غير موجودة)'
      } else if (error?.message?.includes('auth')) {
        errorMessage = 'لم يتم تفعيل خاصية المصادقة على المجموعة'
      } else if (error?.message?.includes('password')) {
        errorMessage = 'خطأ في كلمة المرور - تأكد من أنها 8 أحرف على الأقل'
      } else {
        errorMessage = error?.message || error?.data?.message || 'فشل إنشاء الحساب'
      }
      
      set({ 
        user: null,
        token: null,
        isLoading: false,
        error: errorMessage
      })
      throw new Error(errorMessage)
    }
  },

  startOAuth: async (provider: 'google' | 'github') => {
    set({ isLoading: true, error: null })
    try {
      console.log(`🔐 Starting ${provider} OAuth...`)
      
      const methods = await pb.collection('users').listAuthMethods()
      console.log('📋 Available auth methods:', methods)
      
      const authProvider = methods.authProviders.find((p) => p.name === provider)
      
      if (!authProvider) {
        const available = methods.authProviders.map(p => p.name).join(', ')
        throw new Error(`مزود OAuth ${provider} غير متاح. المتاحة: ${available || 'لا توجد'}`)
      }

      console.log(`✅ Found ${provider} provider:`, authProvider)

      // Build redirect URL - must match what's registered in OAuth provider
      const redirectUrl = `${window.location.origin}/auth/callback`
      const state = crypto.randomUUID?.() || Math.random().toString(36).slice(2)

      sessionStorage.setItem('pb_oauth_provider', provider)
      sessionStorage.setItem('pb_oauth_state', state)

      // Use PocketBase's authUrl with proper parameters
      // PocketBase already includes client_id, but we must ensure redirect_uri is added
      const authUrl = new URL(authProvider.authUrl)
      
      // Force add redirect_uri if not present
      if (!authUrl.searchParams.has('redirect_uri')) {
        authUrl.searchParams.set('redirect_uri', redirectUrl)
      }
      
      // Add state parameter
      authUrl.searchParams.set('state', state)

      const finalUrl = authUrl.toString()
      console.log('🌐 Redirecting to:', finalUrl)
      console.log('📍 Redirect URI:', redirectUrl)
      
      window.location.href = finalUrl
    } catch (error: any) {
      console.error(`❌ ${provider} OAuth start error:`, error)
      const errorMessage = error?.message || error?.data?.message || `فشل تسجيل الدخول بـ ${provider}`
      set({ 
        user: null,
        token: null,
        isLoading: false,
        error: errorMessage
      })
      throw new Error(errorMessage)
    }
  },

  finishOAuth: async (code: string, state?: string | null) => {
    set({ isLoading: true, error: null })
    try {
      const provider = sessionStorage.getItem('pb_oauth_provider') as 'google' | 'github' | null
      const expectedState = sessionStorage.getItem('pb_oauth_state')

      console.log('🔄 Finishing OAuth...')
      console.log('Provider:', provider)
      console.log('State valid:', expectedState === state)

      if (!provider) {
        throw new Error('بيانات OAuth ناقصة: لم يتم العثور على المزود')
      }

      if (expectedState && state && expectedState !== state) {
        throw new Error('فشل التحقق من OAuth: حالة غير متطابقة')
      }

      const redirectUrl = `${window.location.origin}/auth/callback`

      console.log(`🔐 Authenticating with ${provider}...`)
      
      const authData = await pb
        .collection('users')
        .authWithOAuth2Code(provider, code, '', redirectUrl)

      console.log('✅ OAuth successful!')

      sessionStorage.removeItem('pb_oauth_provider')
      sessionStorage.removeItem('pb_oauth_state')

      set({
        user: authData.record as User,
        token: authData.token,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      console.error('❌ OAuth finish error:', error)
      const errorMessage = error?.message || error?.data?.message || 'فشل تسجيل الدخول عبر OAuth'
      set({
        user: null,
        token: null,
        isLoading: false,
        error: errorMessage
      })
      throw new Error(errorMessage)
    }
  },

  logout: () => {
    pb.authStore.clear()
    set({ 
      user: null, 
      token: null,
      error: null
    })
  },
}))
