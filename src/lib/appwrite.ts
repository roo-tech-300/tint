import { Client, Account, Databases, Storage, Avatars, ID } from 'appwrite';

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_ENDPOINT as string,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID as string,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID as string,

  // Collections
  usersCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID as string,
  postsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_POSTS_ID as string,
  commentsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_COMMENTS_ID as string,
  followersCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_FOLLOWERS_ID as string,
  communitiesCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_COMMUNITIES_ID as string,
  communityMembersCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_COMMUNITIY_MEMBERS as string,
  eventsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_EVENTS_ID as string,
  departmentsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_DEPARTMENTS_ID as string,
  coursesCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_COURSES_ID as string,
  pinnedCoursesCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_PINNED_COURSES_ID as string,
  notificationsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_NOTIFICATION_ID as string,

  // Buckets
  bucketMediaId: import.meta.env.VITE_APPWRITE_BUCKET_MEDIA_ID as string,
  bucketProfilePicturesId: import.meta.env.VITE_APPWRITE_BUCKET_PROFILE_PICTURES_ID as string,
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export { ID } 

