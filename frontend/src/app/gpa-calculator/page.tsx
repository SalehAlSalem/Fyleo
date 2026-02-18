'use client'

import { useState } from 'react'
import { Plus, Trash2, Calculator } from 'lucide-react'

interface Course {
  id: string
  name: string
  grade: number
  creditHours: number
}

export default function GPACalculatorPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', grade: 4.0, creditHours: 3 },
  ])
  const [gpaScale, setGpaScale] = useState<4.0 | 5.0>(4.0)

  const gradePoints = {
    4.0: {
      'A+': 4.0,
      A: 4.0,
      'A-': 3.7,
      'B+': 3.3,
      B: 3.0,
      'B-': 2.7,
      'C+': 2.3,
      C: 2.0,
      'C-': 1.7,
      'D+': 1.3,
      D: 1.0,
      'D-': 0.7,
      F: 0.0,
    },
    5.0: {
      'A+': 5.0,
      A: 5.0,
      'A-': 4.5,
      'B+': 4.0,
      B: 3.5,
      'B-': 3.0,
      'C+': 2.5,
      C: 2.0,
      'C-': 1.5,
      'D+': 1.0,
      D: 0.5,
      'D-': 0.25,
      F: 0.0,
    },
  }

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now().toString(), name: '', grade: 4.0, creditHours: 3 },
    ])
  }

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id))
    }
  }

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  const calculateGPA = () => {
    let totalPoints = 0
    let totalCredits = 0

    courses.forEach((course) => {
      const scale = gpaScale === 4.0 ? gradePoints[4.0] : gradePoints[5.0]
      const points = scale[course.grade as unknown as keyof typeof scale] || 0
      totalPoints += points * course.creditHours
      totalCredits += course.creditHours
    })

    return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2)
  }

  const currentGPA = calculateGPA()
  const gradeLetters = Object.keys(
    gpaScale === 4.0 ? gradePoints[4.0] : gradePoints[5.0]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">حاسبة المعدل</h1>
          </div>
          <p className="text-slate-400 text-lg">
            احسب معدلك الجامعي بسهولة وسرعة
          </p>
        </div>

        {/* GPA Scale Selection */}
        <div className="mb-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <label className="block text-white font-semibold mb-4">
            نظام المعدل
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setGpaScale(4.0)}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                gpaScale === 4.0
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              نظام 4.0
            </button>
            <button
              onClick={() => setGpaScale(5.0)}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                gpaScale === 5.0
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              نظام 5.0
            </button>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden mb-8">
          <div className="bg-slate-700/50 p-6 border-b border-slate-700">
            <h2 className="text-white font-semibold text-lg">المقررات الدراسية</h2>
          </div>

          <div className="p-6 space-y-4">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="flex flex-col sm:flex-row gap-4 items-end p-4 bg-slate-700/50 rounded-lg border border-slate-600"
              >
                {/* Course Name */}
                <div className="flex-1 min-w-0">
                  <label className="block text-sm text-slate-400 mb-2">
                    اسم المقرر
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: الرياضيات"
                    value={course.name}
                    onChange={(e) =>
                      updateCourse(course.id, 'name', e.target.value)
                    }
                    className="w-full px-4 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    التقدير
                  </label>
                  <select
                    value={course.grade}
                    onChange={(e) =>
                      updateCourse(course.id, 'grade', e.target.value)
                    }
                    className="px-4 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
                  >
                    {gradeLetters.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Credit Hours */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    الساعات المعتمدة
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={course.creditHours}
                    onChange={(e) =>
                      updateCourse(
                        course.id,
                        'creditHours',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-20 px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-center"
                  />
                </div>

                {/* Delete Button */}
                {courses.length > 1 && (
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            {/* Add Course Button */}
            <button
              onClick={addCourse}
              className="w-full mt-4 py-3 px-4 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg border border-slate-600 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة مقرر
            </button>
          </div>
        </div>

        {/* GPA Result */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 text-center shadow-lg border border-blue-500/50">
          <p className="text-blue-200 text-lg mb-2">معدلك الحالي</p>
          <div className="text-6xl font-bold text-white mb-4">{currentGPA}</div>
          <div className="flex justify-center gap-4 text-blue-100">
            <div>
              <div className="text-sm opacity-75">عدد المقررات</div>
              <div className="text-2xl font-semibold">{courses.length}</div>
            </div>
            <div className="text-blue-400">•</div>
            <div>
              <div className="text-sm opacity-75">إجمالي الساعات</div>
              <div className="text-2xl font-semibold">
                {courses.reduce((sum, c) => sum + c.creditHours, 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Grade Scale Reference */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">جدول التقديرات</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {gradeLetters.map((grade) => (
              <div key={grade} className="text-center">
                <div className="font-semibold text-white text-lg">{grade}</div>
                <div className="text-slate-400 text-sm">
                  {
                    (gpaScale === 4.0
                      ? gradePoints[4.0]
                      : gradePoints[5.0]
                    )[grade as keyof typeof gradePoints[4.0]]
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
