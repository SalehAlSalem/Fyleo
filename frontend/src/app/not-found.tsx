'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-yellow-50 rounded-full mb-6">
          <AlertCircle className="w-12 h-12 text-yellow-600" />
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-2">الصفحة غير موجودة</p>
        <p className="text-gray-500 mb-8 max-w-md">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو قد تكون تم حذفها.
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/library">
            <Button className="bg-blue-600 hover:bg-blue-700">
              تصفح المواد
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
