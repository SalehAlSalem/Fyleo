'use client'

import { Download } from 'lucide-react'

interface PDFViewerProps {
  fileUrl: string
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const isPdfUrl = fileUrl?.includes('.pdf')
  
  const handleDownload = () => {
    window.open(fileUrl, '_blank')
  }

  if (!isPdfUrl) {
    return (
      <div className="w-full bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">لا يمكن عرض هذا الملف</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-full bg-white rounded border p-6 max-h-96 overflow-hidden">
          <iframe
            src={`${fileUrl}#toolbar=0`}
            className="w-full h-[600px] border-0 rounded"
            title="PDF Viewer"
          />
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Download size={18} />
          تحميل الملف
        </button>
      </div>
    </div>
  )
}
