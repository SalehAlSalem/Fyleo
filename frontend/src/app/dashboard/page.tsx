'use client'

import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  FileText,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'

interface UserStats {
  uploadedCount: number
  ratingsCount: number
  reportsCount: number
  totalDownloads: number
}

interface PlatformStats {
  totalUsers: number
  totalMaterials: number
  totalRatings: number
  totalDownloads: number
}

interface UserMaterial {
  id: string
  title: string
  averageRating?: number
  downloads?: number
  created: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [stats, setStats] = useState<UserStats>({
    uploadedCount: 0,
    ratingsCount: 0,
    reportsCount: 0,
    totalDownloads: 0,
  })
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalMaterials: 0,
    totalRatings: 0,
    totalDownloads: 0,
  })
  const [materials, setMaterials] = useState<UserMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'uploads' | 'ratings' | 'reports'>('overview')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)

        // Load user's materials
        const userMaterials = await pb.collection('materials').getList(1, 50, {
          filter: `uploader = "${user.id}"`,
          sort: '-created',
        })

        setMaterials(userMaterials.items as unknown as UserMaterial[])

        // Calculate stats
        const uploadedCount = userMaterials.totalItems
        let totalDownloads = 0

        for (const material of userMaterials.items) {
          totalDownloads += material.downloads
        }

        // Get user's ratings
        const userRatings = await pb.collection('material_ratings').getList(1, 1, {
          filter: `user = "${user.id}"`,
        })

        // Get user's reports
        const userReports = await pb.collection('material_reports').getList(1, 1, {
          filter: `user = "${user.id}"`,
        })

        // Get platform stats
        const platformUsers = await pb.collection('users').getList(1, 1)
        const platformMaterials = await pb.collection('materials').getList(1, 1)
        const platformRatings = await pb.collection('material_ratings').getList(1, 1)

        // Calculate total downloads on platform
        let platformTotalDownloads = 0
        const allMaterials = await pb.collection('materials').getList(1, 500)
        for (const mat of allMaterials.items) {
          platformTotalDownloads += mat.downloads || 0
        }

        setPlatformStats({
          totalUsers: platformUsers.totalItems,
          totalMaterials: platformMaterials.totalItems,
          totalRatings: platformRatings.totalItems,
          totalDownloads: platformTotalDownloads,
        })

        setStats({
          uploadedCount,
          ratingsCount: userRatings.totalItems,
          reportsCount: userReports.totalItems,
          totalDownloads,
        })
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} email={user.email} size="lg" />
              <div>
                <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
                <p className="text-gray-600">مرحباً {user.name || user.username}! 👋</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                logout()
                router.push('/')
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Platform Stats Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📊 إحصائيات المنصة</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">المستخدمين</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">
                    {platformStats.totalUsers}
                  </p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">المواد الكلية</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">
                    {platformStats.totalMaterials}
                  </p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">التقييمات</p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">
                    {platformStats.totalRatings}
                  </p>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">التحميلات الكلية</p>
                  <p className="text-3xl font-bold text-orange-700 mt-2">
                    {platformStats.totalDownloads}
                  </p>
                </div>
                <div className="text-4xl">⬇️</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Stats Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📈 إحصائيات حسابك</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">المواد المرفوعة</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.uploadedCount}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">التقييمات</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.ratingsCount}
                </p>
              </div>
              <Heart className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">التحميلات الكلية</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalDownloads}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">البلاغات المرسلة</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.reportsCount}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('uploads')}
              className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'uploads'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              المواد المرفوعة
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">الإحصائيات الخاصة بك</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">معدل التقييم</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ⭐ متوسط
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">أفضل مادة</p>
                      <p className="text-2xl font-bold text-green-600">
                        {materials[0]?.title.substring(0, 15)}...
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">الأكثر تحميلاً</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {materials.reduce(
                          (max, m) => Math.max(max, m.downloads || 0),
                          0
                        )}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600">النشاط</p>
                      <p className="text-2xl font-bold text-orange-600">نشط ✓</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">الإجراءات السريعة</h2>
                  <div className="flex gap-4 flex-wrap">
                    <Link href="/upload">
                      <Button>رفع مادة جديدة</Button>
                    </Link>
                    <Link href="/library">
                      <Button variant="outline">تصفح المواد</Button>
                    </Link>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      الإعدادات
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'uploads' && (
              <div>
                <h2 className="text-xl font-bold mb-4">المواد المرفوعة</h2>
                {materials.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    لم تقم برفع أي مواد بعد
                  </p>
                ) : (
                  <div className="space-y-4">
                    {materials.map((material) => (
                      <Link
                        key={material.id}
                        href={`/material/${material.id}`}
                      >
                        <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow transition-all cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{material.title}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(material.created).toLocaleDateString(
                                  'ar'
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">
                                ⭐ {(material.averageRating || 0).toFixed(1)}
                              </p>
                              <p className="text-sm text-gray-600">
                                📥 {material.downloads || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
