'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { BookOpen, LogOut, User, Upload, Menu, X, Trophy, Calculator } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="hidden sm:inline">Fyleo</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/library" className="hover:text-blue-600 transition">
              المكتبة
            </Link>
            <Link href="/leaderboard" className="hover:text-blue-600 transition flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              الأفضل
            </Link>
            <Link href="/gpa-calculator" className="hover:text-blue-600 transition flex items-center gap-1">
              <Calculator className="w-4 h-4" />
              المعدل
            </Link>

            {user ? (
              <>
                <Link href="/upload" className="hover:text-blue-600 transition flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  رفع
                </Link>
                <Link href="/dashboard" className="hover:text-blue-600 transition">
                  لوحتي
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <User className="w-4 h-4" />
                  {user.username}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    دخول
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">تسجيل</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/library" className="block hover:text-blue-600">
              المكتبة
            </Link>
            <Link href="/leaderboard" className="block hover:text-blue-600">
              قائمة الأفضل
            </Link>
            <Link href="/gpa-calculator" className="block hover:text-blue-600">
              حاسبة المعدل
            </Link>

            {user ? (
              <>
                <Link href="/upload" className="block hover:text-blue-600">
                  رفع مادة
                </Link>
                <Link href="/dashboard" className="block hover:text-blue-600">
                  لوحتي
                </Link>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {user.username}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleLogout}
                    className="flex-1"
                  >
                    خروج
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    دخول
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button size="sm" className="w-full">
                    تسجيل
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
