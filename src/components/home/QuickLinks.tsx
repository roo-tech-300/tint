import { Link } from 'react-router-dom'

const quickLinks = [
  { title: 'Communities', href: '/communities' },
  { title: 'Events', href: '/events' },
  { title: 'Courses', href: '/courses' },
]

const QuickLinks = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
      {quickLinks.map((link) => (
        <Link
          key={link.title}
          to={link.href}
          className="bg-purple-700 hover:bg-purple-800 text-white rounded-2xl p-4 shadow-md text-center transition"
        >
          <span className="font-semibold">{link.title}</span>
        </Link>
      ))}
    </div>
  )
}

export default QuickLinks
