import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 7) return formatDate(date)
  if (days > 0) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`
  if (hours > 0) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
  if (minutes > 0) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
  return 'الآن'
}

export function getFileUrl(collectionId: string, recordId: string, filename: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
  return `${baseUrl}/api/files/${collectionId}/${recordId}/${filename}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
