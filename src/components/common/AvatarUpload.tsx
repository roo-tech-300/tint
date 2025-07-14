import { useEffect, useState } from 'react'

type Props = {
  onChange: (file: File | null) => void
  userName?: string
  previewUrl?: string | null
}

const AvatarUpload = ({ onChange, userName = 'U', previewUrl }: Props) => {
  const [localPreview, setLocalPreview] = useState<string | null>(previewUrl || null)
  const [initial, setInitial] = useState<string>('U')

  // Update preview if the external previewUrl prop changes
  useEffect(() => {
    setLocalPreview(previewUrl || null)
  }, [previewUrl])

useEffect(() => {
  console.log('📸 Avatar preview URL:', previewUrl)
  setLocalPreview(previewUrl || null)
}, [previewUrl])

  useEffect(() => {
    setInitial(userName?.charAt(0).toUpperCase() || 'U')
  }, [userName])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLocalPreview(url)
      onChange(file)
    } else {
      setLocalPreview(null)
      onChange(null)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold text-white overflow-hidden relative">
        {localPreview ? (
          <img
            src={localPreview}
            alt="Profile Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      <label className="text-white bg-purple-500 p-2 text-sm rounded-md hover:scale-105 hover:bg-purple-400 hover:text-white hover:no-underline transition-all duration-200 cursor-pointer">
        Upload Photo
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  )
}

export default AvatarUpload
