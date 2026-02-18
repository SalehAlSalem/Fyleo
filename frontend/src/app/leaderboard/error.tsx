'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Leaderboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-red-500/50 rounded-lg p-8 max-w-md text-center">
        <h2 className="text-red-400 text-xl font-semibold mb-4">
          خطأ في تحميل قائمة الأفضل
        </h2>
        <p className="text-slate-400 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          حاول مجدداً
        </button>
      </div>
    </div>
  )
}
