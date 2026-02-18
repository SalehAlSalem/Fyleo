'use client'

import { useState, useEffect, useCallback } from 'react'
import { pb } from '@/lib/pocketbase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Search, Download, Star } from 'lucide-react'

interface Material {
  id: string
  title: string
  description?: string
  subject: string
  fileType: string
  uploader: string
  file: string
  averageRating?: number
  totalRatings?: number
  downloads?: number
  views?: number
  created: string
  expand?: any
}

interface Subject {
  id: string
  nameAr: string
  nameEn: string
  level?: number
  creditHours?: number
}

interface Category {
  id: string
  nameAr: string
  nameEn: string
  slug: string
  icon?: string
  color?: string
}

export default function LibraryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'downloads' | 'rating'>('newest')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Load categories (التخصصات)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const records = await pb.collection('categories').getList(1, 100, {
          filter: 'isActive = true',
          sort: 'order',
        })
        console.log('📂 Categories loaded:', records.items.length)
        setCategories(records.items as unknown as Category[])
        setLoading(false)
      } catch (err) {
        console.error('❌ Failed to load categories:', err)
        setError('فشل تحميل التخصصات')
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  // Load subjects when category changes (المواد الدراسية)
  useEffect(() => {
    if (!selectedCategory) {
      setSubjects([])
      return
    }

    const loadSubjects = async () => {
      try {
        console.log('📖 Loading subjects for category:', selectedCategory)
        const records = await pb.collection('subjects').getList(1, 100, {
          filter: 'isActive = true',
          sort: 'nameAr',
        })
        console.log('📖 Subjects loaded:', records.items.length)
        setSubjects(records.items as unknown as Subject[])
      } catch (err) {
        console.error('❌ Failed to load subjects:', err)
        setSubjects([])
      }
    }
    loadSubjects()
  }, [selectedCategory])

  // Load materials (الملفات)
  const loadMaterials = useCallback(
    async (resetPage: boolean = false) => {
      try {
        setLoading(true)
        const currentPage = resetPage ? 1 : page
        
        let filter = ''
        
        if (selectedSubject) {
          filter = `subject = "${selectedSubject}"`
        }
        
        if (searchQuery.trim()) {
          const searchFilter = `(title ~ "${searchQuery}" || description ~ "${searchQuery}")`
          filter = filter ? `${filter} && ${searchFilter}` : searchFilter
        }

        let sortField = '-created'
        if (sortBy === 'downloads') sortField = '-downloads'
        if (sortBy === 'rating') sortField = '-averageRating'

        console.log('📄 Loading materials with filter:', filter || '(all)', 'Sort:', sortField)

        const records = await pb.collection('materials').getList(currentPage, 20, {
          filter: filter || undefined,
          sort: sortField,
          expand: 'subject,uploader,fileType',
        })

        console.log('✅ Materials loaded:', records.items.length)

        if (resetPage) {
          setMaterials(records.items as unknown as Material[])
          setPage(1)
        } else {
          setMaterials((prev) => [...prev, ...(records.items as unknown as Material[])])
          setPage(currentPage + 1)
        }

        setHasMore(records.items.length === 20)
        setError(null)
      } catch (err: any) {
        console.error('❌ Failed to load materials:', err)
        setError('فشل تحميل الملفات')
      } finally {
        setLoading(false)
      }
    },
    [page, selectedSubject, searchQuery, sortBy]
  )

  // Load materials when subject or search changes
  useEffect(() => {
    if (!selectedSubject && !searchQuery) return
    setPage(1)
    setMaterials([])
    loadMaterials(true)
  }, [selectedSubject, searchQuery, sortBy])

  // Render category card
  const CategoryCard = ({ category }: { category: Category }) => (
    <button
      onClick={() => {
        setSelectedCategory(category.id)
        setSelectedSubject('')
        setMaterials([])
      }}
      className={`p-4 rounded-lg border-2 transition-all text-right ${
        selectedCategory === category.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="text-2xl mb-2">{category.icon || '📁'}</div>
      <h3 className="font-semibold text-sm text-gray-900">{category.nameAr}</h3>
      <p className="text-xs text-gray-500 mt-1">{category.nameEn}</p>
    </button>
  )

  // Render material card
  const MaterialCard = ({ material }: { material: Material }) => {
    const uploaderName = (material.expand?.uploader)?.name || 'مجهول'
    const fileTypeName = (material.expand?.fileType)?.nameAr || 'ملف'
    
    return (
      <Link href={`/material/${material.id}`}>
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-2">{material.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{fileTypeName}</p>
            </div>
            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
              {material.expand?.fileType?.icon || '📄'}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {material.description || 'بدون وصف'}
          </p>

          <div className="space-y-2 text-xs text-gray-500">
            <div>👤 {uploaderName}</div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                ⬇️ {material.downloads || 0}
              </span>
              <span className="flex items-center gap-1">
                👁️ {material.views || 0}
              </span>
            </div>
            {material.totalRatings && material.totalRatings > 0 && (
              <div className="flex items-center gap-1">
                ⭐ {material.averageRating?.toFixed(1) || '0'} ({material.totalRatings})
              </div>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-right mb-4">📚 المكتبة</h1>
          
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ابحث عن ملف..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">الأحدث</option>
              <option value="downloads">الأكثر تحميلاً</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">التخصصات</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Subjects Section */}
        {selectedCategory && subjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">المواد الدراسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setSelectedSubject('')
                  setMaterials([])
                }}
                className={`p-3 rounded-lg border-2 transition-all text-right ${
                  selectedSubject === ''
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">جميع المواد</h3>
              </button>
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject.id)
                    setPage(1)
                    setMaterials([])
                    loadMaterials(true)
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-right ${
                    selectedSubject === subject.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="font-semibold text-sm text-gray-900">{subject.nameAr}</h3>
                  {subject.creditHours && (
                    <p className="text-xs text-gray-500 mt-1">
                      {subject.creditHours} ساعات - Level {subject.level}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Materials Section */}
        {materials.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">
              الملفات ({materials.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => loadMaterials()}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                >
                  {loading ? 'جاري التحميل...' : 'تحميل المزيد'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No materials message */}
        {!loading && materials.length === 0 && selectedSubject && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد ملفات في هذه المادة</p>
          </div>
        )}

        {/* Loading state */}
        {loading && materials.length === 0 && selectedSubject && (
          <div className="text-center py-12">
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-right">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
