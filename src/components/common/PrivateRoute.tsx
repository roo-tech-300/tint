import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useAuth'
import { getUserById } from '../../lib/api'
import Loader from '../common/Loader'

const PrivateRoute = () => {
  const { data: user, isLoading, isError } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [onboarding, setOnboarding] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      if (user?.$id) {
        try {
          const dbUser = await getUserById(user.$id)
          setOnboarding(!!dbUser?.onBoarding)
        } catch (err) {
          console.error('Error checking onboarding:', err)
          return <Navigate to="/auth/login" replace />

        }
      }
    }

    fetchOnboardingStatus()
  }, [user])

  useEffect(() => {
  if (isError) {
    console.log("Returning to login", isError)
    navigate('/auth/login', { replace: true })
  }
}, [isError])

  if (isLoading || onboarding === null) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
        <Loader />
      </div>
    )
  }


  if (!user) {

    return <Navigate to="/auth/login" replace />
  }

  const isOnboardingPage = location.pathname === '/onboarding'

  if (!onboarding && !isOnboardingPage) {
    return <Navigate to="/onboarding" replace />
  }

  if (onboarding && isOnboardingPage) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PrivateRoute
