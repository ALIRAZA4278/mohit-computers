'use client'

import { useState } from 'react'
import { Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import ImageUploader from './ImageUploader'

export default function MarkdownImageInserter({ onImageInsert }) {
  const [showUploader, setShowUploader] = useState(false)

  const handleImageUpload = (imageData) => {
    // Insert markdown image syntax
    const markdownImage = `![Image](${imageData.url})`
    if (onImageInsert) {
      onImageInsert(markdownImage)
    }
    setShowUploader(false)
  }

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
        >
          <ImageIcon className="w-4 h-4" />
          Insert Image
        </button>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <LinkIcon className="w-3 h-3" />
          Images will be uploaded to Supabase
        </div>
      </div>

      {showUploader && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <ImageUploader
            onImageUploaded={handleImageUpload}
            bucket="blogs"
            multiple={false}
          />
        </div>
      )}
    </div>
  )
}