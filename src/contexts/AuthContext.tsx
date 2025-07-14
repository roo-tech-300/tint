import { createContext, useContext, useEffect, useState } from 'react'
import { account } from '../lib/appwrite'
import { getCurrentUser } from '../lib/api'

type AuthContextType = {
  isAuthenticated: boolean
  loading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await getCurrentUser()
        setIsAuthenticated(!!user)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = () => setIsAuthenticated(true)

  const logout = async () => {
    try {
      await account.deleteSession('current')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
