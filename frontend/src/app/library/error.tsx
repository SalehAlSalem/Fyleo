'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LibraryError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Library error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              خطأ في المكتبة
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            عذراً، لم نتمكن من تحميل المواد. يرجى المحاولة مرة أخرى.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() => reset()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              حاول مرة أخرى
            </Button>
            <Link href="/">
              <Button variant="outline">
                الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
