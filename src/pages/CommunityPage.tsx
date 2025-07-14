import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Models } from 'appwrite'

import { useUser } from '../hooks/useAuth'
import { getCommunityById } from '../lib/api'
import {
  useFollowCommunity,
  useUnfollowCommunity,
} from '../hooks/useCommunities'
import Loader from '../components/common/Loader'

const CommunityPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: user } = useUser()
  const [community, setCommunity] = useState<Models.Document | null>(null)
  const [loading, setLoading] = useState(true)

  const { mutateAsync: followCommunity, isPending: isJoining } =
    useFollowCommunity()
  const { mutateAsync: unfollowCommunity, isPending: isLeaving } =
    useUnfollowCommunity()

  const loadCommunity = async () => {
    if (!id) return
    try {
      const data = await getCommunityById(id)
      setCommunity(data)
    } catch (err) {
      console.error('Failed to load community:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommunity()
  }, [id])

  const isAdmin = community?.admins?.some(
    (admin: any) => admin?.$id === user?.$id
  )

  const isFollowing = community?.communityMembers?.some(
    (member: any) => member?.userId === user?.$id
  )

  const handleToggleFollow = async () => {
    if (!user || !community) return

    try {
      if (isFollowing) {
        await unfollowCommunity({
          userId: user.$id,
          communityId: community.$id,
          existingCommunityMembers: community.communityMembers.map(
            (m: any) => m.$id
          ),
        })
      } else {
        await followCommunity({
          userId: user.$id,
          communityId: community.$id,
          existingCommunityMembers: community.communityMembers.map(
            (m: any) => m.$id
          ),
        })
      }

      // Refetch updated data
      loadCommunity()
    } catch (err) {
      console.error('Follow/unfollow failed:', err)
    }
  }

  if (loading) {
    {/* Fixed Back Button */}
       <button
        onClick={() => navigate('/communities')}
        className="fixed top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-purple-500 z-50 opacity-80"
        >
        ← 
        </button>

    return <p className="text-white text-center mt-10"><Loader/></p>
  }

  if (!community) {
    return (
      <p className="text-red-500 text-center mt-10">Community not found.</p>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
        {/* Fixed Back Button */}
        <button
        onClick={() => navigate('/communities')}
        className="fixed top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-purple-500 z-50 opacity-80"
        >
        ← 
        </button>

      {/* Cover Image */}
      <div className="w-full h-52 sm:h-64 md:h-72 bg-gray-800 rounded-lg overflow-hidden mb-6">
        <img
          src={community.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Community Info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{community.name}</h1>
        <p className="text-gray-400 mt-1">{community.description}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        {isAdmin ? (
          <button
            onClick={() => navigate(`/communities/${id}/create-post`)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md font-semibold"
          >
            Create Post
          </button>
        ) : (
          <button
            onClick={handleToggleFollow}
            disabled={isJoining || isLeaving}
            className={`px-4 py-2 rounded-md font-semibold ${
              isFollowing
                ? 'bg-purple-400 transition'
                : 'bg-purple-600 '
            } ${isJoining || isLeaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isFollowing
              ? isLeaving
                ? (<Loader/>)
                : 'Leave Community'
              : isJoining
              ?  (<Loader/>)
              : 'Join Community'}
          </button>
        )}
      </div>

      {/* Posts Feed */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Posts</h2>
        <div className="space-y-4">
          {/* TODO: Map actual community posts here */}
          <div className="bg-[#1a1a1a] p-4 rounded-md">
            <p className="text-sm text-gray-300">
              This is a sample post in the community.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage
