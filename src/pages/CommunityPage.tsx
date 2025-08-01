import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Models } from 'appwrite'

import { useUser } from '../hooks/useAuth'
import { getCommunityById, makeUserAdmin, removeUserAdmin } from '../lib/api'
import {
  useCommunityEvents,
  useFollowCommunity,
  useUnfollowCommunity,
} from '../hooks/useCommunities'
import Loader from '../components/common/Loader'
import CommunityMembersModal from '../components/common/CommunityMembersModal'
import EventModal from '../components/common/eventModal'
import CreateEventModal from '../components/common/CreateEventModal'


const CommunityPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: user } = useUser()
  const { data: eventsData, isLoading: isEventsLoading, refetch: refetchEvents } = useCommunityEvents(id!);
  const [community, setCommunity] = useState<Models.Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMembers, setShowMembers] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState<boolean>(false)

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

  useEffect(() => {
    if (isCreateEventModalOpen) {
      setIsEventModalOpen(false)
    }
  }, [isCreateEventModalOpen])



  const isFollowing = community?.communityMembers?.some(
    (member: any) => member?.userId === user?.$id
  )

const handleToggleFollow = async () => {
  if (!user || !community) return;

  try {
    const isAdmin = community.admins?.some(
      (admin: { $id: string }) => admin.$id === user.$id
    );
    const adminCount = community.admins?.length || 0;

    if (isFollowing) {
      if (isAdmin && adminCount === 1) {
        alert("You are the last admin of this community. Assign another admin before leaving.");
        return;
      }

      if (isAdmin) {
        await removeUserAdmin(user.$id, community.$id);
      }

      await unfollowCommunity({
        userId: user.$id,
        communityId: community.$id,
      });

    } else {
      await followCommunity({
        userId: user.$id,
        communityId: community.$id,
      });
    }

    await loadCommunity(); // Refresh community data

  } catch (err) {
    console.error('Follow/unfollow failed:', err);
  }
};



  const handleMakeAdmin = async (userId: string) => {
  try {
    await makeUserAdmin(userId, community?.$id!)
    loadCommunity()
  } catch (error) {
    console.error('Failed to make user admin:', error)
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

  const isAdmin = !!community?.admins?.some(
  (admin: any) => admin?.$id === user?.$id
)

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
        {/* Fixed Back Button */}
        <button
        onClick={() => navigate('/communities')}
        className="fixed top-7 left-4 bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-purple-500 z-50 opacity-80"
        >
        ← 
        </button>
        <button
        className="fixed top-7 right-4 bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow hover:bg-purple-500 z-50 opacity-80"
        onClick={() => setShowMembers((prev) => !prev)}
        >
          {showMembers ? 'Hide Members' : 'Show Members'}
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
      <div className="flex gap-3 items-center mb-6">
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


        <button
          onClick={() => setIsEventModalOpen(true)}
          className="px-4 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700"
        >
          {eventsData && eventsData.length > 0
            ? `${eventsData.length} Events`
            : 'Event'}
        </button>
      </div>  

      

      

      {/* Posts Feed */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Posts</h2>
        <div className="space-y-4">
          {/* TODO: Map actual community posts here */}
          <div className="bg-[#1a1a1a] p-4 rounded-md">
            <p className="text-sm text-gray-300">
              No posts yet
            </p>
          </div>
        </div>
      </div>
      {showMembers && community && user?.$id && (
        <CommunityMembersModal
          isOpen={showMembers}
          onClose={() => setShowMembers(false)}
          members={
            (community.communityMembers || []).map((member: any) => ({
              user: member.user,
              isAdmin: community.admins?.some((admin: any) => admin.$id === member.user?.$id)
            }))
          }
          admins={community.admins?.map((admin: any) => admin.$id) || []}
          currentUserId={user?.$id}
          isCurrentUserAdmin={isAdmin}
          handleMakeAdmin={handleMakeAdmin}
        />  
        )}
       {isEventModalOpen && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          events={eventsData || []}
          isAdmin={isAdmin}
          onCreateEvent={() => {
            setIsCreateEventModalOpen(true)
          }}
          isEventsLoading={isEventsLoading}
        />
      )}
      {isCreateEventModalOpen && (
        
        <CreateEventModal
          isOpen={isCreateEventModalOpen}
          onClose={() => {
            setIsCreateEventModalOpen(false);
            setIsEventModalOpen(true); // reopen event modal
          }}
          communityId={community?.$id}
          onCreateEvent={() => {
            setIsCreateEventModalOpen(false);
          }}
          onEventCreated={async () => {
            await refetchEvents();
            setIsCreateEventModalOpen(false);
          }}
        />
        
      )}

    </div>
  )
}

export default CommunityPage
