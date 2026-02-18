'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Trophy, Share2, Sparkles } from 'lucide-react'
import { pb } from '@/lib/pocketbase'

interface Contributor {
  id: string
  name: string
  uploads: number
}

export default function HomePage() {
  const [topContributors, setTopContributors] = useState<Contributor[]>([])
  const [contributorsLoaded, setContributorsLoaded] = useState(false)
  const [stats, setStats] = useState({
    users: 0,
    materials: 0,
    subjects: 0
  })

  useEffect(() => {
    loadStats()
    loadTopContributors()
  }, [])

  const loadStats = async () => {
    try {
      const results = await Promise.allSettled([
        pb.collection('users').getList(1, 1),
        pb.collection('materials').getList(1, 1),
        pb.collection('subjects').getList(1, 1),
      ])

      const usersResult = results[0].status === 'fulfilled' ? results[0].value : null
      const materialsResult = results[1].status === 'fulfilled' ? results[1].value : null
      const coursesResult = results[2].status === 'fulfilled' ? results[2].value : null

      setStats({
        users: usersResult?.totalItems ?? 0,
        materials: materialsResult?.totalItems ?? 0,
        subjects: coursesResult?.totalItems ?? 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadTopContributors = async () => {
    try {
      const materials = await pb.collection('materials').getFullList({
        fields: 'uploader'
      })
      
      const uploadsCount: { [key: string]: number } = {}
      materials.forEach((material: any) => {
        const userId = material.uploader
        if (userId) {
          uploadsCount[userId] = (uploadsCount[userId] || 0) + 1
        }
      })
      
      const sortedUsers = Object.entries(uploadsCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
      
      const contributors = sortedUsers.map(([userId, count]) => ({
        id: userId,
        name: `مستخدم ${userId.substring(0, 8)}`,
        uploads: count
      }))
      
      setTopContributors(contributors)
    } catch (error) {
      console.error('Error loading contributors:', error)
    } finally {
      setContributorsLoaded(true)
    }
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent('اكتشفت Fyleo - منصة تعليمية رهيبة! 📚✨')}&url=https://linktr.ee/fyleo_official&hashtags=Fyleo`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent('سلام! 👋\n\nلقيت منصة Fyleo - منصة تعليمية رهيبة! 📚✨\n\nشوفها من هون: https://linktr.ee/fyleo_official')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=https://linktr.ee/fyleo_official&quote=${encodeURIComponent('اكتشفت Fyleo! 📚✨')}`
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Fyleo</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">تسجيل الدخول</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">ابدأ مجاناً</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">منصة تعليمية متكاملة</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              كل ما تحتاجه<br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                لنجاحك الدراسي
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              انضم لآلاف الطلاب، شارك المواد، واستفد من مكتبة ضخمة من الملفات الدراسية
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-6">
                  ابدأ الآن →
                </Button>
              </Link>
              <Link href="/materials">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  تصفح المواد
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-20">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-blue-600 mb-1">{stats.materials}+</div>
              <div className="text-sm text-gray-600">مادة دراسية</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-purple-600 mb-1">{stats.users}+</div>
              <div className="text-sm text-gray-600">طالب نشط</div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-pink-600 mb-1">{stats.subjects}+</div>
              <div className="text-sm text-gray-600">تخصص</div>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h2 className="text-4xl font-black">المتصدرون</h2>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>

            {topContributors.length > 0 && topContributors.slice(0, 3).length === 3 ? (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end justify-center gap-4">
                  {/* الثاني */}
                  <div className="flex-1 max-w-xs">
                    <div className="bg-gray-100 rounded-t-3xl p-6 text-center border-4 border-gray-300">
                      <div className="text-5xl mb-3">🥈</div>
                      <div className="font-bold text-lg mb-2 text-gray-800 truncate">{topContributors[1].name}</div>
                      <div className="text-3xl font-black text-gray-600">{topContributors[1].uploads}</div>
                      <div className="text-sm text-gray-500">مساهمة</div>
                    </div>
                    <div className="bg-gray-300 h-20 rounded-b-xl"></div>
                  </div>

                  {/* الأول */}
                  <div className="flex-1 max-w-xs -mb-8">
                    <div className="relative">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl">👑</div>
                      <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-t-3xl p-6 text-center border-4 border-yellow-600 shadow-2xl">
                        <div className="text-6xl mb-3">🥇</div>
                        <div className="font-black text-xl mb-2 text-yellow-900 truncate">{topContributors[0].name}</div>
                        <div className="text-4xl font-black text-yellow-900">{topContributors[0].uploads}</div>
                        <div className="text-sm font-bold text-yellow-800">مساهمة</div>
                      </div>
                      <div className="bg-gradient-to-b from-yellow-500 to-yellow-600 h-32 rounded-b-xl shadow-xl"></div>
                    </div>
                  </div>

                  {/* الثالث */}
                  <div className="flex-1 max-w-xs">
                    <div className="bg-orange-100 rounded-t-3xl p-6 text-center border-4 border-orange-300">
                      <div className="text-5xl mb-3">🥉</div>
                      <div className="font-bold text-lg mb-2 text-orange-800 truncate">{topContributors[2].name}</div>
                      <div className="text-3xl font-black text-orange-600">{topContributors[2].uploads}</div>
                      <div className="text-sm text-orange-500">مساهمة</div>
                    </div>
                    <div className="bg-orange-300 h-16 rounded-b-xl"></div>
                  </div>
                </div>

                {/* الباقي */}
                {topContributors.slice(3).length > 0 && (
                  <div className="mt-12 space-y-3 max-w-2xl mx-auto">
                    {topContributors.slice(3).map((contributor, index) => (
                      <div key={contributor.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {index + 4}
                          </div>
                          <span className="font-semibold text-gray-900">{contributor.name}</span>
                        </div>
                        <div className="text-2xl font-black text-blue-600">{contributor.uploads}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : contributorsLoaded ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500">لا توجد مساهمات بعد</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-gray-500">جاري التحميل...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <Share2 className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-4xl font-black mb-4">شارك Fyleo مع أصدقائك</h2>
          <p className="text-xl mb-10 opacity-90">ساعدنا نوصل لأكبر عدد من الطلاب</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" 
               className="bg-black hover:bg-gray-900 rounded-xl p-6 flex flex-col items-center gap-3 transition-all hover:scale-105">
              <div className="text-3xl font-bold">𝕏</div>
              <span className="font-semibold">شارك على X</span>
            </a>
            
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer"
               className="bg-green-500 hover:bg-green-600 rounded-xl p-6 flex flex-col items-center gap-3 transition-all hover:scale-105">
              <div className="text-4xl">💬</div>
              <span className="font-semibold">واتساب</span>
            </a>
            
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
               className="bg-blue-700 hover:bg-blue-800 rounded-xl p-6 flex flex-col items-center gap-3 transition-all hover:scale-105">
              <div className="text-4xl">👍</div>
              <span className="font-semibold">فيسبوك</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2026 Fyleo. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
