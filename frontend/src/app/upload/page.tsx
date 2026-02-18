'use client'

import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Upload, AlertCircle } from 'lucide-react'

interface Subject {
  id: string
  nameAr: string
  nameEn: string
}

interface FileType {
  id: string
  nameAr: string
  nameEn: string
  extension: string
}

export default function UploadPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [fileTypes, setFileTypes] = useState<FileType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Load subjects & file types
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const loadData = async () => {
      try {
        const [subjectsRes, fileTypesRes] = await Promise.all([
          pb.collection('subjects').getList(1, 50, { filter: 'isActive = true' }),
          pb.collection('fileTypes').getList(1, 50),
        ])
        setSubjects(subjectsRes.items as unknown as Subject[])
        setFileTypes(fileTypesRes.items as unknown as FileType[])
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('خطأ في تحميل البيانات')
      }
    }
    loadData()
  }, [user, router])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError('يجب تسجيل الدخول أولاً')
      return
    }

    if (!title.trim()) {
      setError('أدخل عنوان المادة')
      return
    }

    if (!selectedSubject) {
      setError('اختر موضوع المادة')
      return
    }

    if (!file) {
      setError('اختر ملفاً للرفع')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('uploader', user.id)
      formData.append('subject', selectedSubject)
      formData.append('fileType', fileTypes[0]?.id || '')
      formData.append('file', file)

      await pb.collection('materials').create(formData)

      // Reset form
      setTitle('')
      setDescription('')
      setSelectedSubject('')
      setFile(null)

      // Redirect
      router.push('/library?success=تم رفع المادة بنجاح')
    } catch (err: any) {
      console.error('Upload failed:', err)
      setError(err.message || 'خطأ في رفع الملف')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">يجب تسجيل الدخول أولاً</p>
          <Button onClick={() => router.push('/login')}>تسجيل الدخول</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">شارك مادتك الدراسية</h1>
          <p className="text-gray-600">
            ساعد الطلاب الآخرين بمشاركة ملاحظاتك وملخصاتك
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">العنوان *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ملخص الفصل 5 - الكيمياء"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              الوصف (اختياري)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="صف محتوى المادة..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              الموضوع/المادة *
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- اختر موضوع --</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">الملف *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-700">
                    {file ? file.name : 'انقر لاختيار ملف'}
                  </p>
                  <p className="text-sm text-gray-500">
                    أو اسحب الملف هنا
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {loading ? 'جاري الرفع...' : 'رفع المادة'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">معلومات الرفع</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ تأكد من أن المادة أصلية وملكك</li>
            <li>✓ تجنب المحتوى غير المناسب</li>
            <li>✓ الملفات المدعومة: PDF, Word, صور</li>
            <li>✓ بعد الرفع ستكون المادة متاحة للجميع</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
