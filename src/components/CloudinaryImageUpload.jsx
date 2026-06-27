import { useState, useRef } from 'react'
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload'

/**
 * Image Upload Component for Cloudinary
 * Usage: <CloudinaryImageUpload onUpload={handleImageUpload} />
 */
export function CloudinaryImageUpload({ onUpload, onError, maxFiles = 10, currentCount = 0 }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const { upload, uploading, error, progress } = useCloudinaryUpload()

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result)
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    const result = await upload(file)
    if (result) {
      onUpload(result)
      setPreview(null)
      event.target.value = '' // Reset input
    } else if (onError) {
      onError(error)
    }
  }

  const isDisabled = uploading || currentCount >= maxFiles

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isDisabled}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isDisabled}
        className={`w-full rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
          isDisabled
            ? 'border-iqBorder/30 bg-iqCard/30 cursor-not-allowed'
            : 'border-iqBorder hover:border-iqText bg-iqCard/50 hover:bg-iqCard cursor-pointer'
        }`}
      >
        {uploading ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-iqText">Uploading... {progress}%</p>
            <div className="w-full bg-iqBorder h-1 rounded-full overflow-hidden">
              <div
                className="bg-iqAccent h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-3">
            <div className="mx-auto w-20 h-20 rounded-lg overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-iqText/70">Processing image...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-2xl">📸</p>
            <p className="text-sm font-semibold text-iqText">Click to upload image</p>
            <p className="text-xs text-iqText/70">Max {maxFiles} images • JPG, PNG, WebP</p>
            {currentCount > 0 && (
              <p className="text-xs text-iqAccent font-medium">{currentCount}/{maxFiles} uploaded</p>
            )}
          </div>
        )}
      </button>

      {error && !uploading && (
        <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}
