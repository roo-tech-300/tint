import { useUser } from '../hooks/useAuth'
import MobileTopNav from '../components/common/MobileTopNav'
import Sidebar from '../components/common/SideBar'
import BottomNavbar from '../components/common/BottomNavbar'

const HomePage = () => {
  const { data: user, isLoading } = useUser()
  console.log("The user is", user)

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar for large screens */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen border-r border-white/10 p-4">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 pb-16"> {/* pb-16 ensures space for bottom nav on mobile */}
        {/* Top Navbar for mobile only */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
          <MobileTopNav />
        </div>

        {/* Page content */}
        <div className="pt-16 px-4 md:pt-6">
          <section className="mb-8">
            <h1 className="text-2xl font-bold text-purple-600 tracking-wide">
              {isLoading
                ? 'Loading...'
                : `Welcome, ${user?.name || 'Scholar'}!`}
            </h1>
            <p className="text-gray-300 mt-1">
              Explore your campus communities, events, and courses.
            </p>
          </section>

          {/* Add more homepage content below */}
        </div>

        {/* Bottom Navbar for mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <BottomNavbar />
        </div>
      </div>
    </div>
  )
}

export default HomePage
