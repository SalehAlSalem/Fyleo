'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          حدث خطأ ما
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
          عذراً، حدثت مشكلة غير متوقعة. يرجى المحاولة مرة أخرى.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 p-3 bg-gray-100 rounded text-sm text-gray-700 max-h-48 overflow-auto">
            <summary className="cursor-pointer font-semibold mb-2">
              تفاصيل الخطأ (Development only)
            </summary>
            <pre className="whitespace-pre-wrap break-words text-xs">
              {error.message}
            </pre>
          </details>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            حاول مرة أخرى
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            الرئيسية
          </Button>
        </div>
      </div>
    </div>
  )
}
