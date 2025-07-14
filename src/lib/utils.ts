import { account } from '../lib/appwrite'

export const keepSessionAlive = () => {
  const interval = setInterval(async () => {
    try {
      await account.get()
      console.log('✅ Session is still active')
    } catch (err) {
      console.warn('⚠️ Session expired or invalid. Logging out...')
      try {
        await account.deleteSession('current')
        window.location.href = '/auth/login'
      } catch (logoutErr) {
        console.error('Failed to clear session', logoutErr)
      } finally {
        clearInterval(interval)
      }
    }
  }, 15 * 60 * 1000) // ⏱ check every 15 minutes (adjust as needed)
}
