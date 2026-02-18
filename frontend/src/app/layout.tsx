import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' })

export const metadata: Metadata = {
  title: 'Fyleo - منصة التعليم الإلكتروني',
  description: 'منصة تعليمية متكاملة للطلاب والمعلمين',
  keywords: ['تعليم', 'كورسات', 'جامعة', 'مواد دراسية'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} font-sans`}>
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
