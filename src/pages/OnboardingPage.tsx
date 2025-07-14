import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Models } from 'appwrite'

import { useUser } from '../hooks/useAuth'
import AvatarUpload from '../components/common/AvatarUpload'
import Logo from '../../images/logo 2.png'
import {
  completeOnboarding,
  avatarUploadStorage,
  fetchDepartment,
  getUserAvatar,
  getUserById
} from '../lib/api'
import Loader from '../components/common/Loader'

const OnboardingPage = () => {
  const { data: authUser } = useUser()
  const navigate = useNavigate()

  const [departments, setDepartments] = useState<Models.Document[]>([])
  const [departmentId, setDepartmentId] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string>('') // storage preview URL
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const sorted = await fetchDepartment()
        setDepartments(sorted)
      } catch (err) {
        console.error('Failed to load departments:', err)
      }
    }
    loadDepartments()
  }, [])



  useEffect(() => {
    const loadAvatar = async () => {
      if(!authUser?.$id) return
      const dbUser = await getUserById(authUser?.$id)
    console.log('🧾 Stored avatar file ID:', dbUser.avatar)

      if (!authUser) return
      try {
        const url = await getUserAvatar(authUser.$id)
        setAvatarUrl(url)
      } catch (err) {
        console.error('Failed to get avatar:', err)
      }
    }
    loadAvatar()
  }, [authUser])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authUser) return

    setLoading(true)
    try {
      let finalAvatarUrl = avatarUrl
      if (avatarFile) {
        finalAvatarUrl = await avatarUploadStorage(avatarFile)
      }

      await completeOnboarding({
        userId: authUser.$id,
        avatarUrl: finalAvatarUrl,
        department: departmentId,
        bio,
      })

      console.log("Finished onboarding for user:", authUser.$id)

      // Optionally wait a moment to ensure DB write propagates
      await new Promise((res) => setTimeout(res, 300))

      // Force a page reload (hard reset PrivateRoute logic)
      navigate('/', { replace: true })
      window.location.reload()
      
    } catch (err) {
      console.error('Onboarding failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#0F0B10] border border-white/10 p-8 rounded-xl shadow-lg"
      >
        <div className="flex justify-center mb-4">
          <img src={Logo} alt="Tint Logo" className="h-10" />
        </div>

        <h2 className="text-xl font-bold text-center mb-1">Complete Your Profile</h2>
        <p className="text-sm text-center text-gray-400 mb-6">
          Let’s get you set up on Tint campus
        </p>

        <div className="mb-6 text-center">
          <AvatarUpload
            onChange={setAvatarFile}
            userName={authUser?.name}
            previewUrl={avatarUrl}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Department</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
            className="w-full p-2 bg-black border border-white/20 rounded-lg text-white"
          >
            <option value="">Select your department</option>
            {departments.map((dept) => (
              <option key={dept.$id} value={dept.$id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={150}
            placeholder="Tell us a bit about yourself"
            className="w-full p-2 bg-black border border-white/20 rounded-lg text-white resize-none"
          />
          <div className="text-xs text-right text-gray-500 mt-1">
            {150 - bio.length} remaining
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
        >
          {loading ? <Loader /> : 'Finish Setup'}
        </button>
      </form>
    </div>
  )
}

export default OnboardingPage
