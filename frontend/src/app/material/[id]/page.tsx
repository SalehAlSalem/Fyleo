'use client'

import { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import {
  Star,
  Download,
  Share2,
  Flag,
  Eye,
  User,
  Calendar,
  FileText,
} from 'lucide-react'
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 animate-pulse rounded" />,
})

interface Material {
  id: string
  title: string
  description?: string
  file: string
  uploader: string
  subject: string
  fileType: string
  averageRating?: number
  totalRatings?: number
  downloads?: number
  views?: number
  created: string
  expand?: {
    uploader?: any
    subject?: any
    fileType?: any
  }
}

interface Rating {
  id: string
  rating: number
  comment: string
  user: string
  created: string
}

export default function MaterialPage() {
  const params = useParams()
  const router = useRouter()
  const materialId = params.id as string
  const { user } = useAuthStore()

  const [material, setMaterial] = useState<Material | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [userRating, setUserRating] = useState<number>(0)
  const [userComment, setUserComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')

  // Load material & ratings
  useEffect(() => {
    const loadMaterial = async () => {
      try {
        setLoading(true)
        const record = await pb.collection('materials').getOne(materialId, {
          expand: 'uploader,subject,fileType',
        })
        setMaterial(record as unknown as Material)

        // Load ratings
        try {
          const ratingsRecords = await pb
            .collection('material_ratings')
            .getList(1, 50, {
              filter: `material = "${materialId}"`,
              sort: '-created',
              expand: 'user',
            })
          setRatings(ratingsRecords.items as unknown as Rating[])
        } catch (ratingsErr) {
          // If we can't read ratings, that's okay
          console.debug('Could not load ratings (permission denied):', ratingsErr)
          setRatings([])
        }

        // Check user's rating
        if (user) {
          try {
            const userRatingRecord = await pb
              .collection('material_ratings')
              .getFirstListItem(
                `material = "${materialId}" && user = "${user.id}"`,
                { fields: 'rating,comment' }
              )
              .catch(() => null)

            if (userRatingRecord) {
              setUserRating(userRatingRecord.rating)
              setUserComment(userRatingRecord.comment || '')
            }
          } catch (ratingsErr) {
            // If we don't have permission to read ratings, that's okay
            console.debug('Could not load user rating (permission denied):', ratingsErr)
          }
        }
      } catch (err) {
        console.error('Failed to load material:', err)
        setError('خطأ في تحميل المادة')
      } finally {
        setLoading(false)
      }
    }
    loadMaterial()
  }, [materialId, user])

  // Submit rating
  const handleSubmitRating = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (userRating === 0) {
      alert('اختر تقييماً من 1 إلى 5')
      return
    }

    try {
      if (userComment || userRating) {
        // Try update
        try {
          const existingRating = ratings.find((r) => r.user === user.id)
          if (existingRating) {
            await pb
              .collection('material_ratings')
              .update(existingRating.id, {
                rating: userRating,
                comment: userComment,
              })
          } else {
            throw new Error('No existing rating')
          }
        } catch {
          // If update fails or no existing rating, create new
          await pb.collection('material_ratings').create({
            material: materialId,
            user: user.id,
            rating: userRating,
            comment: userComment,
          })
        }

        alert('تم حفظ التقييم بنجاح')
        // Reload ratings
        window.location.reload()
      }
    } catch (err: any) {
      console.error('Failed to submit rating:', err)
      if (err.status === 403) {
        alert('لا يمكنك تقييم هذه المادة في الوقت الحالي')
      } else {
        alert('خطأ في حفظ التقييم')
      }
    }
  }

  // Submit report
  const handleSubmitReport = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!reportReason) {
      alert('اختر سبب البلاغ')
      return
    }

    try {
      await pb.collection('material_reports').create({
        material: materialId,
        user: user.id,
        reason: reportReason,
        details: reportDetails,
        status: 'open',
      })
      alert('تم إرسال البلاغ بنجاح. شكراً لمساعدتك في تحسين المنصة')
      setShowReportForm(false)
      setReportReason('')
      setReportDetails('')
    } catch (err) {
      console.error('Failed to submit report:', err)
      alert('خطأ في إرسال البلاغ')
    }
  }

  const handleDownload = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      // Increment download counter
      await pb.collection('materials').update(materialId, {
        downloads: (material?.downloads || 0) + 1,
      })

      // Trigger download
      const fileUrl = pb.files.getUrl(material!, material!.file)
      window.open(fileUrl, '_blank')
    } catch (err) {
      console.error('Failed to download:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !material) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <p className="text-red-800">{error || 'المادة غير موجودة'}</p>
            <Button onClick={() => router.push('/library')} className="mt-4">
              العودة للمكتبة
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{material.title}</h1>
          <p className="text-gray-600 mb-4">{material.description}</p>

          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y">
            {/* Rating */}
            <div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {(material.averageRating || 0).toFixed(1)}
                </span>
                <span className="text-sm text-gray-600">
                  ({material.totalRatings || 0})
                </span>
              </div>
            </div>

            {/* Views */}
            <div className="flex items-center gap-2 text-gray-600">
              <Eye className="w-5 h-5" />
              <span>{material.views || 0}</span>
            </div>

            {/* Downloads */}
            <div className="flex items-center gap-2 text-gray-600">
              <Download className="w-5 h-5" />
              <span>{material.downloads || 0}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{new Date(material.created).toLocaleDateString('ar')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تحميل
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              مشاركة
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-red-600"
              onClick={() => setShowReportForm(!showReportForm)}
            >
              <Flag className="w-4 h-4" />
              بلاغ
            </Button>
          </div>
        </div>

        {/* File Preview */}
        {material.file && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">📄 معاينة الملف</h2>
              <a
                href={pb.files.getUrl(material, material.file)}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                تحميل مباشر
              </a>
            </div>
            {material.file.endsWith('.pdf') ? (
              <PDFViewer fileUrl={pb.files.getUrl(material, material.file)} />
            ) : (
              <div className="text-center py-8 border border-gray-300 rounded-lg">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">لا يمكن معاينة هذا النوع من الملفات</p>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 ml-2" />
                  تحميل الملف
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Subject and Uploader Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">معلومات المادة</h2>
          <div className="space-y-4">
            {/* Subject */}
            {material.expand?.subject && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">المادة الدراسية</p>
                  <p className="font-semibold">{material.expand.subject.nameAr}</p>
                  {material.expand.subject.nameEn && (
                    <p className="text-sm text-gray-500">{material.expand.subject.nameEn}</p>
                  )}
                  {material.expand.subject.level && (
                    <p className="text-xs text-gray-500 mt-1">
                      المستوى {material.expand.subject.level} • {material.expand.subject.creditHours} ساعة
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* File Type */}
            {material.expand?.fileType && (
              <div className="flex items-start gap-3">
                <div className="text-2xl">{material.expand.fileType.icon || '📄'}</div>
                <div>
                  <p className="text-sm text-gray-600">نوع الملف</p>
                  <p className="font-semibold">{material.expand.fileType.nameAr}</p>
                </div>
              </div>
            )}

            {/* Uploader */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {material.expand?.uploader?.name?.charAt(0) || 'م'}
              </div>
              <div>
                <p className="text-sm text-gray-600">رفع بواسطة</p>
                <p className="font-semibold text-lg">
                  {material.expand?.uploader?.name || material.expand?.uploader?.username || 'مستخدم غير معروف'}
                </p>
                {material.expand?.uploader?.email && (
                  <p className="text-sm text-gray-500">{material.expand.uploader.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Report Form */}
        {showReportForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">تقارير المخالفات</h2>
            <div className="space-y-4">
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- اختر سبب البلاغ --</option>
                <option value="inappropriate">محتوى غير مناسب</option>
                <option value="spam">رسائل غير مرغوبة</option>
                <option value="copyright">انتهاك حقوق الطبع</option>
                <option value="malware">برامج ضارة</option>
                <option value="other">أخرى</option>
              </select>

              <textarea
                placeholder="تفاصيل البلاغ (اختياري)"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />

              <div className="flex gap-2">
                <Button onClick={handleSubmitReport} className="flex-1">
                  إرسال البلاغ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReportForm(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Rating Form */}
        {user && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">أضف تقييمك</h2>
            <div className="space-y-4">
              {/* Rating Stars */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 cursor-pointer transition-all ${
                        star <= userRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Comment */}
              <textarea
                placeholder="أضف تعليقك (اختياري)"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />

              <Button onClick={handleSubmitRating} className="w-full">
                حفظ التقييم
              </Button>
            </div>
          </div>
        )}

        {/* Ratings List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            التقييمات ({ratings.length})
          </h2>
          <div className="space-y-4">
            {ratings.length === 0 ? (
              <p className="text-gray-600">لا توجد تقييمات بعد</p>
            ) : (
              ratings.map((rating) => (
                <div key={rating.id} className="border-b pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      {rating.comment && (
                        <p className="text-gray-700">{rating.comment}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(rating.created).toLocaleDateString('ar')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
