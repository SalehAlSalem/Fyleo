import PocketBase from 'pocketbase'

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'

console.log('🔗 PocketBase URL:', pbUrl)

const pb = new PocketBase(pbUrl)

// تمكين auto cancellation للطلبات المتكررة
pb.autoCancellation(false)

// Log للتأكد من الاتصال
pb.health.check().then(() => {
  console.log('✅ PocketBase متصل بنجاح')
}).catch((error) => {
  console.error('❌ خطأ في الاتصال بـ PocketBase:', error)
})

export { pb }

// ==========================================
// Types للبيانات الموجودة في PocketBase
// ==========================================

export interface User {
  id: string
  email: string
  username: string
  name: string
  avatar?: string
  created: string
  updated: string
  collectionId: string
  collectionName: string
}

export interface Category {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr?: string
  descriptionEn?: string
  icon?: string
  color?: string
  order: number
  isActive: boolean
  slug: string
  created: string
  updated: string
}

export interface Subject {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr?: string
  descriptionEn?: string
  creditHours?: number
  level?: string
  isActive: boolean
  tag?: string
  created: string
  updated: string
}

export interface Material {
  id: string
  title: string
  description?: string
  file: string
  uploader: string
  subject: string
  fileType: string
  tags?: string
  created: string
  updated: string
}

export interface FileType {
  id: string
  nameAr: string
  nameEn: string
  icon?: string
  color?: string
  allowedFormats?: string
  created: string
  updated: string
}

export interface Post {
  id: string
  subject: string
  uploader: string
  contentText?: string
  linkURL?: string
  created: string
  updated: string
}

// ==========================================
// Types للميزات الجديدة (للمستقبل)
// ==========================================

export interface User {
  id: string
  email: string
  username: string
  name: string
  role?: 'student' | 'teacher' | 'admin' | 'moderator'
  bio?: string
  avatar?: string
  university?: string
  major?: string
  year?: number
  created: string
  updated: string
}

// ==========================================
// Helper Types
// ==========================================

export interface PaginatedResponse<T> {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: T[]
}

export interface MaterialWithRelations extends Material {
  expand?: {
    uploader?: User
    subject?: Subject
    fileType?: FileType
  }
}

export interface PostWithRelations extends Post {
  expand?: {
    uploader?: User
    subject?: Subject
  }
}
