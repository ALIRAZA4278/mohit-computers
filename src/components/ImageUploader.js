import { useState } from 'react'
import Image from 'next/image'
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react'

export default function ImageUploader({ 
  onImageUploaded, 
  bucket = 'images',
  className = '',
  multiple = false,
  maxFiles = 5
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const filesToProcess = multiple ? fileArray.slice(0, maxFiles) : [fileArray[0]]

    setUploading(true)

    try {
      const uploadPromises = filesToProcess.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', bucket)

        const response = await fetch('/api/supabase/upload', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()
        return result
      })

      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter(result => result.success)
      const failedUploads = results.filter(result => !result.success)

      if (successfulUploads.length > 0) {
        const newImages = successfulUploads.map(result => ({
          url: result.url,
          fileName: result.fileName
        }))

        setUploadedImages(prev => [...prev, ...newImages])
        
        // Call callback with uploaded images
        if (onImageUploaded) {
          onImageUploaded(multiple ? newImages : newImages[0])
        }
      }

      if (failedUploads.length > 0) {
        console.error('Some uploads failed:', failedUploads)
        alert(`${failedUploads.length} images failed to upload`)
      }

    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading images')
    } finally {
      setUploading(false)
    }
  }

  const handleFileInput = (e) => {
    handleFiles(e.target.files)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newImages)
    if (onImageUploaded) {
      onImageUploaded(multiple ? newImages : null)
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                Drag and drop images here or click to select
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB {multiple && `(max ${maxFiles} files)`}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Uploaded Images:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image.url}
                    alt={`Uploaded ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Success indicator */}
                <div className="absolute top-2 left-2 bg-green-500 rounded-full p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-white" />
                </button>

                {/* Image URL (for copying) */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(image.url)
                      alert('URL copied to clipboard!')
                    }}
                    className="w-full text-left truncate hover:text-blue-300"
                  >
                    Click to copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}