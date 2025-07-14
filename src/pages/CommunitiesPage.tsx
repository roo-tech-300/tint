import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import { useCommunities, useFollowCommunity, useUnfollowCommunity } from '../hooks/useCommunities'
import MobileTopNav from '../components/common/MobileTopNav'
import Sidebar from '../components/common/SideBar'
import BottomNav from '../components/common/BottomNavbar'
import Loader from '../components/common/Loader'
import type { Models } from 'appwrite'

// type Community = Models.Document & {
//   name: string
//   description?: string
//   coverImage?: string
//   admins?: string[]
//   communityMembers?: { userId: string }[]
// }

const CommunitiesPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'suggested'>('all')
  const { data: user } = useUser()
  const { data: communities = [], isLoading, isError } = useCommunities()
  const navigate = useNavigate()

  const { mutateAsync: followCommunity, isPending: isJoining } = useFollowCommunity()
  const { mutateAsync: unfollowCommunity, isPending: isLeaving } = useUnfollowCommunity()

  const [loadingCommunityId, setLoadingCommunityId] = useState<string | null>(null)

  const filteredCommunities = communities.filter((community) => {
    const isFollowing = community.communityMembers?.some((m : {userId: string}) => m.userId === user?.$id)
    if (activeTab === 'all') return true
    if (activeTab === 'following') return isFollowing
    if (activeTab === 'suggested') return !isFollowing
    return true
  })

  if (isLoading) return <Loader />
  if (isError) return <div className="text-white p-4">Failed to load communities.</div>

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-56 pb-20 md:pb-0">
        <div className="md:hidden">
          <MobileTopNav />
        </div>

        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Communities</h1>
            <Link
              to="/communities/create"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm md:text-base rounded-lg transition"
            >
              Create Community
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            {['all', 'following', 'suggested'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'all' | 'following' | 'suggested')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>  

          {/* Community Cards */}
          {filteredCommunities.length === 0 ? (
            <p className="text-gray-400">No communities found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCommunities.map((community: Models.Document) => {
                const isFollowing = community.communityMembers?.some(
                  (member) => member.userId === user?.$id
                )

                return (
                  <div
                    key={community.$id}
                    className="bg-white/5 p-5 rounded-lg border border-white/10 flex flex-col gap-3"
                  >
                    <div
                      onClick={() => navigate(`/communities/${community.$id}`)}
                      className="cursor-pointer hover:bg-white/5 p-3 rounded-lg transition"
                    >
                      <div className="flex items-center gap-3">
                        {community.coverImage ? (
                          <img
                            src={community.coverImage}
                            alt={community.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                            {community.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                        )}

                        <div>
                          <h2 className="text-lg font-semibold">{community.name}</h2>
                          <p className="text-xs text-gray-400">
                            {community.communityMembers?.length || 0} members
                          </p>
                        </div>

                        {community.admins?.includes(user?.$id || "") && (
                          <span className="ml-auto text-xs px-2 py-1 rounded bg-purple-600">
                            Admin
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-300 mt-2">
                        {community.description || 'No description yet'}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        disabled={isJoining || isLeaving || loadingCommunityId === community.$id}
                        onClick={async () => {
                          if (!user?.$id) return
                          setLoadingCommunityId(community.$id)
                          try {
                            if (isFollowing) {
                              await unfollowCommunity({
                                communityId: community.$id,
                                userId: user.$id,
                              })
                            } else {
                              await followCommunity({
                                communityId: community.$id,
                                userId: user.$id,
                              })
                            }
                          } catch (error) {
                            console.error('Failed to toggle join/leave:', error)
                          } finally {
                            setLoadingCommunityId(null)
                          }
                        }}
                        className={`px-4 py-1 text-sm rounded-md font-medium transition ${
                          isFollowing
                            ? 'bg-white/10 text-purple-400 hover:bg-white/20'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {loadingCommunityId === community.$id ? (
                          <Loader />
                        ) : isFollowing ? (
                          'Leave'
                        ) : (
                          'Join'
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="md:hidden fixed bottom-0 w-full z-50">
          <BottomNav />
        </div>
      </main>
    </div>
  )
}

export default CommunitiesPage
