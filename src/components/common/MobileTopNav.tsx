import { Link } from 'react-router-dom'
import { useUser } from '../../hooks/useAuth'
import Logo from '../../../images/logo 1.png'
import { useEffect, useState } from 'react'
import { getUserById } from '../../lib/api'

const MobileTopNav = () => {
  const { data: user } = useUser()

  const [dbUser, setDbUser] = useState<any>(null)

    useEffect(() => {
      const fetchUserFromDB = async () => {
        if (user?.$id) {
          try {
            const res = await getUserById(user.$id)
            setDbUser(res)
            console.log('Fetched DB user:', res)
            console.log('User ID:', res.avatar)
          } catch (error) {
            console.error('Error fetching DB user:', error)
          }
        }
      }
  
      fetchUserFromDB()
    }, [user])

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      {/* Notifications on the left */}
      <Link to="/notifications" className="relative">
        <img src="../../../images/icons/BellIcon.svg" alt="Notifications" className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-[10px] rounded-full flex items-center justify-center">
          2
        </span>
      </Link>

      {/* Center Logo */}
      <img
        src={Logo}
        alt="Tint Logo"
        className="h-6"
      />

      {/* Dynamic Profile Icon */}
      <Link to="/profile">
            {dbUser?.avatar  ? (
                  <img
                    src={dbUser.avatar || '../../../images/icons/UserIcon.svg'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )
              }
      </Link>
    </nav>
  )
}

export default MobileTopNav
