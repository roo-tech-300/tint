import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import { useCreateCommunity } from '../hooks/useCommunities'
import { avatarUploadStorage } from '../lib/api'
import AvatarUpload from '../components/common/AvatarUpload'
import Loader from '../components/common/Loader'

const CreateCommunity = () => {
  const { data: user } = useUser()
  const navigate = useNavigate()
  const { mutateAsync: createCommunity, isPending } = useCreateCommunity()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('')

  const handleImageChange = (file: File | null) => {
    if (!file) return
    setCoverImageFile(file)
    setCoverPreviewUrl(URL.createObjectURL(file))
    console.log('Selected cover image:', file.name)
    console.log('Preview URL:', URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isPending || !user || !name.trim()) return

    try {
      let coverImageId = ''

      if (coverImageFile) {
        coverImageId = await avatarUploadStorage(coverImageFile)
        console.log('Cover image uploaded:', coverImageId)
      }

       createCommunity({
        name: name.trim(),
        description: description.trim(),
        coverImage: coverImageId,
        adminId: user.$id,
      })

      console.log('Community created successfully')
      // Redirect to communities page after successful creation
      navigate('/communities')
    } catch (err) {
      console.error('Failed to create community:', err)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#0F0B10] border border-white/10 p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-bold text-center mb-1">Create a Community</h2>
        <p className="text-sm text-center text-gray-400 mb-6">
          Let's get your community started!
        </p>

        <div className="mb-6 text-center">
          <AvatarUpload
            onChange={handleImageChange}
            userName={name}
            previewUrl={coverPreviewUrl}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Community Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter community name"
            className="w-full p-2 bg-black border border-white/20 rounded-lg text-white"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Tell us about your community"
            className="w-full p-2 bg-black border border-white/20 rounded-lg text-white resize-none"
          />
          <div className="text-xs text-right text-gray-500 mt-1">
            {500 - description.length} characters remaining
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className= {`w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition 
            ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
          {isPending ? <Loader/> : 'Create Community'}
        </button>
      </form>
    </div>
  )
}

export default CreateCommunity
