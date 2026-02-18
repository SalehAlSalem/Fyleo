'use client'

import { useEffect, useState } from 'react'
import { Trophy, TrendingUp } from 'lucide-react'
import { pb } from '@/lib/pocketbase'

interface UserStats {
  id: string
  username: string
  avatar?: string
  totalUploadedMaterials: number
  averageRating: number
  totalCoursesTaken: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<UserStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'materials' | 'rating'>('materials')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        console.log('📊 Fetching leaderboard data...')

        // Get all users
        const users = await pb.collection('users').getFullList({
          pageSize: 500,
        })

        // Calculate stats for each user
        const userStats: UserStats[] = await Promise.all(
          users.map(async (user) => {
            try {
              // Get materials uploaded by this user
              const materials = await pb
                .collection('materials')
                .getList(1, 1, {
                  filter: `uploader = "${user.id}"`,
                })
                .catch(() => ({ items: [], totalItems: 0 }))

              // Get average rating for this user's materials
              let averageRating = 0
              if (materials.totalItems > 0) {
                try {
                  const ratings = await pb
                    .collection('material_ratings')
                    .getFullList({
                      filter: `user = "${user.id}"`,
                    })
                    .catch(() => [])

                  if (ratings.length > 0) {
                    averageRating =
                      ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
                      ratings.length
                  }
                } catch (err) {
                  // Graceful fallback
                  console.debug('Could not fetch ratings:', err)
                }
              }

              // Get total courses taken from enrollments
              const enrollments = await pb
                .collection('enrollments')
                .getList(1, 1, {
                  filter: `user = "${user.id}"`,
                })
                .catch(() => ({ items: [], totalItems: 0 }))

              return {
                id: user.id,
                username: user.username || user.email || 'غير معروف',
                avatar: user.avatar || undefined,
                totalUploadedMaterials: materials.totalItems,
                averageRating: Math.round(averageRating * 10) / 10,
                totalCoursesTaken: enrollments.totalItems,
              }
            } catch (err) {
              console.error(`Error fetching stats for user ${user.id}:`, err)
              return {
                id: user.id,
                username: user.username || user.email || 'غير معروف',
                totalUploadedMaterials: 0,
                averageRating: 0,
                totalCoursesTaken: 0,
              }
            }
          })
        )

        // Filter users with activity
        const activeUsers = userStats.filter(
          (u) => u.totalUploadedMaterials > 0 || u.totalCoursesTaken > 0
        )

        // Sort by selected metric
        const sorted = [...activeUsers].sort((a, b) => {
          if (sortBy === 'materials') {
            return b.totalUploadedMaterials - a.totalUploadedMaterials
          } else {
            return b.averageRating - a.averageRating
          }
        })

        setLeaderboard(sorted)
        console.log(`✅ Loaded ${sorted.length} users`)
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
        setError('خطأ في تحميل قائمة الأفضل')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">قائمة الأفضل</h1>
          </div>
          <p className="text-slate-400 text-lg">
            أفضل الطلاب والمعلمين في منصة Fyleo
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setSortBy('materials')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              sortBy === 'materials'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            أكثر المواد تحميلاً
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              sortBy === 'rating'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            أعلى التقييمات
          </button>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">جاري التحميل...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-slate-400">لا توجد بيانات متاحة حالياً</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div
                key={user.id}
                className={`rounded-lg p-6 transition hover:shadow-lg ${
                  index < 3
                    ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30'
                    : 'bg-slate-800 hover:bg-slate-750 border border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="font-bold text-white text-lg">
                      {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg truncate">
                      {user.username}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                      <span>📚 {user.totalUploadedMaterials} مادة</span>
                      <span className="text-slate-600">•</span>
                      <span>📖 {user.totalCoursesTaken} دورة</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 text-right">
                    {sortBy === 'materials' ? (
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-400">
                            {user.totalUploadedMaterials}
                          </div>
                          <div className="text-xs text-slate-500">مادة</div>
                        </div>
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-400">
                            {user.averageRating}
                          </div>
                          <div className="text-xs text-slate-500">⭐ متوسط</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
