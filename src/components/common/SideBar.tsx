import { Link, useLocation } from 'react-router-dom'
import { useUser, useLogout } from '../../hooks/useAuth'
import { getUserById } from '../../lib/api'
import { useEffect, useState } from 'react'

const Sidebar = () => {
  const location = useLocation()
  const { data: user } = useUser()
  const { mutateAsync: logout } = useLogout()
  const [dbUser, setDbUser] = useState<any>(null)


  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

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


    console.log('User fetched successfully:', user)
  const navItems = [
    {
      path: '/profile',
      icon: '../../../images/icons/UserIcon.svg',
      label: user?.name || 'Profile',
      subtitle: user?.prefs?.department || 'Scholar',
      isProfile: true,
    },
    { path: '/', icon: '../../../images/icons/Home Icon.svg', label: 'Home' },
    { path: '/courses', icon: '../../../images/icons/courses icon.svg', label: 'Courses' },
    { path: '/communities', icon: '../../../images/icons/Community Icon.svg', label: 'Communities' },
    { path: '/explore', icon: '../../../images/icons/Explore Icon.svg', label: 'Explore' },
    { path: '/create-post', icon: '../../../images/icons/Post Icon.svg', label: 'Create Post' },
  ]

  console.log("Avatar URL:", dbUser?.avatar)
  return (
    <aside className="hidden md:flex flex-col justify-between w-56 h-screen bg-black border-white/10 fixed left-0 top-0 py-8 px-6 z-40">
      {/* Top Section */}
      <div className="flex flex-col gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-2">
          <img
            src="../../../images/logo 1.png"
            alt="Tint Logo"
            className="h-10"
          />
          <span className="text-2xl font-bold text-white">Tint</span>
        </Link>

        {/* Nav Items */}
        <nav className="flex flex-col gap-4 mt-1 ">
          {navItems.map(({ path, icon, label, subtitle, isProfile }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition ${
                location.pathname === path ? 'bg-white/10' : ''
              }`}
            >
              {isProfile ? (
                dbUser?.avatar  ? (
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
              ) : (
                <img src={icon} alt={label} className="w-6 h-6" />
              )}
              <div className="flex flex-col">
                <span className="text-base font-medium">{label}</span>
                {subtitle && (
                  <span className="text-xs text-gray-400 leading-tight">{subtitle}</span>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 mt-20 px-3 py-2 text-white rounded-xl transition"
      >
        <img src="../../../images/icons/Icons for tint.svg" alt="Logout" className="w-5 h-5" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </aside>
  )

}
export default Sidebar