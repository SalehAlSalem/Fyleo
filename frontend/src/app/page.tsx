'use client'

import { useEffect, useState } from 'react'
import { pb } from '@/lib/pocketbase'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Users, FileText, TrendingUp, ArrowRight, Search } from 'lucide-react'

interface Stats {
  userCount: number
  materialCount: number
  subjectCount: number
  ratingCount: number
}

interface Category {
  id: string
  nameAr: string
  nameEn: string
  slug: string
  icon: string
  color: string
  order: number
}

export default function HomePage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats>({
    userCount: 0,
    materialCount: 0,
    subjectCount: 0,
    ratingCount: 0,
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [trendingMaterials, setTrendingMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, materials, subjects, ratings] = await Promise.allSettled([
          pb.collection('users').getList(1, 1),
          pb.collection('materials').getList(1, 1),
          pb.collection('subjects').getList(1, 1),
          pb.collection('material_ratings').getList(1, 1).catch(() => ({ totalItems: 0 })),
        ])

        setStats({
          userCount:
            (users.status === 'fulfilled' ? users.value.totalItems : 0) || 0,
          materialCount:
            (materials.status === 'fulfilled'
              ? materials.value.totalItems
              : 0) || 0,
          subjectCount:
            (subjects.status === 'fulfilled' ? subjects.value.totalItems : 0) ||
            0,
          ratingCount:
            (ratings.status === 'fulfilled' ? ratings.value.totalItems : 0) ||
            0,
        })

        // Load categories
        try {
          const categoriesData = await pb.collection('categories').getList(1, 50, {
            sort: 'order',
          })
          console.log('✅ Categories loaded:', categoriesData.items.length, categoriesData.items)
          setCategories(categoriesData.items as unknown as Category[])
        } catch (catErr) {
          console.error('❌ Failed to load categories:', catErr)
        }

        // Load trending materials
        const trendings = await pb.collection('materials').getList(1, 6, {
          sort: '-downloads,-averageRating',
          expand: 'subject',
        })
        setTrendingMaterials(trendings.items)
      } catch (err) {
        console.error('Failed to load stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                ✨ منصة تعليمية شاملة
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                تعلم وشارك بحرية
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                اكتشف آلاف المواد الدراسية من المجتمع، قيّمها، وشارك معرفتك مع
                طلاب آخرين
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/library">
                  <Button size="lg" className="w-full sm:w-auto flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    استكشف المواد
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                {!user && (
                  <Link href="/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      إنشاء حساب مجاني
                    </Button>
                  </Link>
                )}

                {user && (
                  <Link href="/upload">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto flex items-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      رفع مادة
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Illustration Area */}
            <div className="hidden md:block relative h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="text-white text-center">
                <BookOpen className="w-24 h-24 mx-auto mb-4 opacity-80" />
                <p className="text-lg font-semibold">مكتبة ضخمة من المواد الدراسية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">
                {stats.userCount.toLocaleString('ar-SA')}
              </div>
              <p className="text-gray-600 text-sm">مستخدم نشط</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 hover:border-green-500 transition-colors text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">
                {stats.materialCount.toLocaleString('ar-SA')}
              </div>
              <p className="text-gray-600 text-sm">مادة دراسية</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 hover:border-purple-500 transition-colors text-center">
              <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">
                {stats.subjectCount.toLocaleString('ar-SA')}
              </div>
              <p className="text-gray-600 text-sm">موضوع/مادة</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 hover:border-orange-500 transition-colors text-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">
                {stats.ratingCount.toLocaleString('ar-SA')}
              </div>
              <p className="text-gray-600 text-sm">تقييم وملاحظة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">لماذا Fyleo؟</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            منصة حديثة تجمع أفضل ميزات المنصات التعليمية العالمية
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">مواد دراسية شاملة</h3>
              <p className="text-gray-600">
                ملاحظات وملخصات وحلول شاملة من أفضل الطلاب
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">نظام تقييمات ذكي</h3>
              <p className="text-gray-600">
                قيّم المواد وساعد الآخرين في اختيار الأفضل
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">عرض مدمج للملفات</h3>
              <p className="text-gray-600">
                شاهد PDFs والصور مباشرة في المتصفح بدون تحميل
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">تصفح حسب التخصص الجامعي</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              اختر تخصصك واستكشف آلاف المواد الدراسية المشاركة من الطلاب
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <div className="group relative p-6 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden cursor-pointer h-full">
                  {/* Gradient background on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    {/* Icon - Use emoji from database */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${category.color}15`,
                      }}
                    >
                      <span className="text-3xl">{category.icon}</span>
                    </div>

                    {/* Name */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-900">
                        {category.nameAr}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {category.nameEn}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight
                        className="w-5 h-5"
                        style={{ color: category.color }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View all button */}
          {categories.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/library">
                <Button size="lg" variant="outline" className="flex items-center gap-2 mx-auto">
                  عرض جميع المواد
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trending Materials Section */}
      {trendingMaterials.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12">المواد الشهيرة</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingMaterials.map((material) => (
                <Link key={material.id} href={`/material/${material.id}`}>
                  <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer h-full">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg line-clamp-2 flex-1">
                        {material.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {material.description || 'لا يوجد وصف'}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>⭐ {(material.averageRating || 0).toFixed(1)}</span>
                      <span>📥 {material.downloads || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/library">
                <Button size="lg" variant="outline" className="flex items-center gap-2 mx-auto">
                  عرض المزيد من المواد
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل لديك مواد تريد مشاركتها؟
          </h2>
          <p className="text-lg opacity-90 mb-8">
            ساعد آلاف الطلاب بمشاركة ملاحظاتك وملخصاتك وحصل على تقييمات إيجابية
          </p>
          <Link href={user ? '/upload' : '/register'}>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-2 mx-auto"
            >
              ابدأ الآن مجاناً
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Fyleo
              </h3>
              <p className="text-gray-400 text-sm">
                منصة تعليمية متكاملة للجميع
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">الروابط</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/library" className="hover:text-white">
                    المكتبة
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="hover:text-white">
                    رفع مادة
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    الأسئلة الشائعة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    التواصل
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">عن الموقع</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    سياسة الخصوصية
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    شروط الاستخدام
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Fyleo. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
