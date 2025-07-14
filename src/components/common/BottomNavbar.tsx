import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', icon: '../../../images/icons/Home Icon.svg', label: 'Home' },
  { path: '/courses', icon: '../../../images/icons/courses icon.svg', label: 'Courses' },
  { path: '/communities', icon: '../../../images/icons/Community Icon.svg', label: 'Communities' },
  { path: '/explore', icon: '../../../images/icons/Explore Icon.svg', label: 'Explore' },
  { path: '/create-post', icon: '../../../images/icons/Post Icon.svg', label: 'Post' },
]

const BottomNavbar = () => {
  const location = useLocation()

  return (
    <nav className="bg-black border-t border-white/10 flex justify-around items-center py-2 px-4">
      {navItems.map(({ path, icon, label }) => {
        const isActive = location.pathname === path

        return (
          <Link
            key={path}
            to={path}
            className="flex flex-col items-center justify-center gap-0.5 relative text-xs"
          >
            <img
              src={icon}
              alt={label}
              className={`w-5 h-5 ${isActive ? 'text-purple-500' : 'text-white/70'}`}
            />
            <span className={`text-[10px] ${isActive ? 'text-purple-500' : 'text-white/60'}`}>
              {label}
            </span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-purple-500" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomNavbar
