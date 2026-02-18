'use client'

import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronRight, BookOpen, FileText } from 'lucide-react'

interface Category {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr?: string
  icon?: string
  color?: string
  slug: string
}

interface Subject {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr?: string
  level?: number
  creditHours?: number
  isActive: boolean
}

interface Material {
  id: string
  title: string
  description?: string
  subject: string
  downloads?: number
  views?: number
  averageRating?: number
  totalRatings?: number
  expand?: any
}

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load category
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const records = await pb.collection('categories').getList(1, 1, {
          filter: `slug = "${categorySlug}" && isActive = true`,
        })
        
        if (records.items.length === 0) {
          setError('التخصص غير موجود')
          return
        }

        setCategory(records.items[0] as unknown as Category)
        setLoading(false)
      } catch (err) {
        console.error('Failed to load category:', err)
        setError('فشل تحميل التخصص')
        setLoading(false)
      }
    }
    loadCategory()
  }, [categorySlug])

  // Load subjects when category loads
  useEffect(() => {
    if (!category) return

    const loadSubjects = async () => {
      try {
        // Load all subjects for now (in future, filter by category)
        const records = await pb.collection('subjects').getList(1, 100, {
          filter: 'isActive = true',
          sort: 'nameAr',
        })
        
        console.log('📖 Subjects loaded:', records.items.length)
        setSubjects(records.items as unknown as Subject[])
      } catch (err) {
        console.error('Failed to load subjects:', err)
        setSubjects([])
      }
    }
    loadSubjects()
  }, [category])

  // Load materials when subject is selected
  useEffect(() => {
    if (!selectedSubject) {
      setMaterials([])
      return
    }

    const loadMaterials = async () => {
      try {
        const records = await pb.collection('materials').getList(1, 20, {
          filter: `subject = "${selectedSubject}"`,
          sort: '-created',
          expand: 'subject,fileType,uploader',
        })
        
        console.log('📄 Materials loaded:', records.items.length)
        setMaterials(records.items as unknown as Material[])
      } catch (err) {
        console.error('Failed to load materials:', err)
        setMaterials([])
      }
    }
    loadMaterials()
  }, [selectedSubject])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error || 'التخصص غير موجود'}</p>
            <Link href="/library" className="text-blue-600 hover:text-blue-700 underline mt-2 inline-block">
              العودة للمكتبة
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12"
        style={category.color ? { background: `linear-gradient(to right, ${category.color}, ${category.color}dd)` } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
            <Link href="/" className="hover:underline">الرئيسية</Link>
            <ChevronRight size={16} />
            <Link href="/library" className="hover:underline">المكتبة</Link>
            <ChevronRight size={16} />
            <span>{category.nameAr}</span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-4">
            <div className="text-5xl">{category.icon || '🎓'}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{category.nameAr}</h1>
              <p className="text-xl opacity-90">{category.nameEn}</p>
              {category.descriptionAr && (
                <p className="mt-3 text-lg opacity-80">{category.descriptionAr}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6">
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
              <p className="text-sm opacity-90">المواد الدراسية</p>
              <p className="text-2xl font-bold">{subjects.length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
              <p className="text-sm opacity-90">الملفات المتاحة</p>
              <p className="text-2xl font-bold">{materials.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Subjects Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">
            📚 المواد الدراسية في {category.nameAr}
          </h2>
          
          {subjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">لا توجد مواد في هذا التخصص حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`p-5 rounded-lg border-2 transition-all text-right hover:shadow-md ${
                    selectedSubject === subject.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900 flex-1">
                      {subject.nameAr}
                    </h3>
                    <BookOpen 
                      className={`w-5 h-5 ${selectedSubject === subject.id ? 'text-blue-600' : 'text-gray-400'}`} 
                    />
                  </div>
                  
                  {subject.nameEn && (
                    <p className="text-sm text-gray-600 mb-2">{subject.nameEn}</p>
                  )}
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {subject.level && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        المستوى {subject.level}
                      </span>
                    )}
                    {subject.creditHours && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {subject.creditHours} ساعة
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Materials List */}
        {selectedSubject && materials.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">
              📄 الملفات المتاحة ({materials.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((material) => (
                <Link key={material.id} href={`/material/${material.id}`}>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                        {material.title}
                      </h3>
                      <FileText className="w-5 h-5 text-gray-400 ml-2" />
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {material.description || 'بدون وصف'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span>⬇️ {material.downloads || 0}</span>
                        <span>👁️ {material.views || 0}</span>
                      </div>
                      {material.totalRatings && material.totalRatings > 0 && (
                        <span className="flex items-center gap-1">
                          ⭐ {material.averageRating?.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                      👤 {material.expand?.uploader?.name || material.expand?.uploader?.username || 'مستخدم غير معروف'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No materials message */}
        {selectedSubject && materials.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">لا توجد ملفات في هذه المادة حالياً</p>
            <p className="text-sm text-gray-500 mt-2">كن أول من يرفع محتوى!</p>
          </div>
        )}
      </div>
    </div>
  )
}
