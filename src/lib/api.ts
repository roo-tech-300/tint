import { Query } from 'appwrite'
import { account, databases, appwriteConfig, storage, ID } from './appwrite'


export const createUserAccount = async ({
    email,
    password,
    name,
    }: {
    email: string
    password: string
    name: string
    }) => {
        try {
            // Create the user in Appwrite Auth
            const user = await account.create(ID.unique(), email, password, name)
            console.log('User created:', user)

            // Save additional user data to the database
            await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            user.$id, 
            {
                name,
                email,      
            }
            )

            return user
        } catch (error: any) {
            console.error('Error creating user account:', error)
            throw new Error(
            error?.message || 'Failed to create user account. Please try again.'
            )
        }
}

export const loginUser = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    console.log('Session created:', session)
    return session
  } catch (error: any) {
    console.error('Login error:', error)
    throw new Error(error?.message || 'Failed to login. Please try again.')
  }
}

export const getCurrentUser = async () => {
  try {
    return await account.get()
  } catch (error) {
    console.error('Failed to fetch current user:', error)
    throw new Error('Unauthenticated') // Force React Query to exit loading state
  }
}

export const logoutUser = async () => {
  try {
    await account.deleteSession('current')
    console.log('User successfully logged out.')
  } catch (error) {
    console.error('Error logging out:', error)
    throw new Error('Failed to log out. Please try again.')
  }
} 


export const completeOnboarding = async ({
  userId,
  avatarUrl,
  department,
  bio,
}: {
  userId?: string
  avatarUrl?: string
  department: string
  bio: string
}) => {
  if (!userId) throw new Error('User ID is missing.')
  if (!department) throw new Error('Department ID is missing.')

  console.log('[Onboarding] Submitting for user:', userId)
  console.log('[Onboarding] Payload:', { avatarUrl, department, bio })

  try {
    console.log('[Onboarding] Starting...')
    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId,
      { 
        avatar: avatarUrl || '',
        department, // Must be document ID string
        bio,
        onBoarding: true,
      }
    )

    console.log('[Onboarding] Success:', updated)
    return updated
  } catch (error: any) {
    console.error('[Onboarding] Failed:', error)
    throw new Error(
      error?.message || 'Unexpected error during onboarding.'
    )
  }
}


export const avatarUploadStorage = async(avaterFile: File ) => {
  try{
    const uploaded = await storage.createFile(appwriteConfig.bucketMediaId, ID.unique(), avaterFile)
    const viewUrl = storage.getFileView(appwriteConfig.bucketMediaId, uploaded.$id)
    return viewUrl;
  }catch (error) {  
    console.error('Error uploading avatar:', error)
    throw new Error  
  }
}

export const fetchDepartment = async()=>{
  try {
        const res = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.departmentsCollectionId
        )
        const sorted = res.documents.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        )
        return sorted;
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        return[];
      }
}


export const getUserById = async (userId: string) => {
  const res = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    userId
  )
  return res
}

export const getUserAvatar = async (userId: string): Promise<string> => {
  const user = await getUserById(userId)
  return user?.avatar
    ? storage.getFileView(appwriteConfig.bucketMediaId, user.avatar)
    : ''
}


export const createCommunity = async ({ 
  name,
  description,
  coverImage,
  adminId,
}: {
  name: string
  description?: string
  coverImage?: string
  adminId: string
}) => {
  // Store coverImage URL string
  const community = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.communitiesCollectionId,
    ID.unique(),
    {
      name,
      description: description || '',
      coverImage: coverImage || '',
      admins: [adminId],
    }
  )
  // auto-join as member
  await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.communityMembersCollectionId,
    ID.unique(),
    {
      userId: adminId,
      communitiesId: community.$id,
      user: adminId,
      community: community.$id,
    }
  )
  return community
}


export const fetchCommunities = async () => {
  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.communitiesCollectionId
  )
  return res.documents
}


export const followCommunity = async ({ userId, communityId }: { userId: string; communityId: string }) => {
  const existing = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.communityMembersCollectionId,
    [
      Query.equal('user', [userId]),
      Query.equal('community', [communityId]),
    ]
  )
  if (existing.documents.length > 0) return existing.documents[0]

  return await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.communityMembersCollectionId,
    ID.unique(),
    {
      user: userId,
      community: communityId,
      userId: userId,
      communitiesId: communityId
    }
  )
}


export const unfollowCommunity = async ({ userId, communityId }: { userId: string; communityId: string }) => {
  const existing = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.communityMembersCollectionId,
    [
      Query.equal('user', [userId]),
      Query.equal('community', [communityId]),
    ]
  )
  if (existing.documents.length === 0) return

  const memberId = existing.documents[0].$id
  return await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.communityMembersCollectionId,
    memberId
  )
}


export const getCommunityById = async (communityId: string) => {
  return await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.communitiesCollectionId,
    communityId
  )
}


export const fetchCommunityMemberIds = async (communityId: string): Promise<string[]> => {
  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.communityMembersCollectionId,
    [Query.equal('community', [communityId])]
  )
  return res.documents.map((m) => m.user as string)
}

export const makeUserAdmin = async (userId: string, communityId: string) => {
  try {

    const community = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.communitiesCollectionId,
      communityId
    )

    const currentAdmins: string[] = community.admins || []

    const updatedAdmins = currentAdmins.includes(userId)
    ? currentAdmins
    : [...currentAdmins, userId]

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.communitiesCollectionId,
      communityId,
      {
        admins: updatedAdmins, 
      }
    )
  } catch (error) {
    console.error('Failed to make user admin:', error)
    throw error
  }
}












