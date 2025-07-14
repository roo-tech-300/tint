// src/components/departments/DepartmentList.tsx
import { useEffect, useState } from 'react'
import { databases } from '../../lib/appwrite'

const DepartmentList = () => {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await databases.listDocuments('tint', 'departments')
        setDepartments(res.documents)
      } catch (err) {
        console.error('Failed to fetch departments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  if (loading) {
    return <div className="text-white">Loading departments...</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-white mb-4">Departments</h2>
      <ul className="space-y-2">
        {departments.map((dept) => (
          <li key={dept.$id} className="bg-white/5 text-white px-4 py-2 rounded-md shadow-sm border border-white/10">
            {dept.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DepartmentList
