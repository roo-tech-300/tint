import { useMutation, useQuery } from '@tanstack/react-query'
import { createUserAccount, getCurrentUser, logoutUser } from '../lib/api'
import { loginUser } from '../lib/api'
import { useNavigate } from 'react-router-dom'

interface SignUpInput {
  email: string
  password: string
  name: string
}

interface LoginInput {
  email: string
  password: string
}

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: SignUpInput) => {
      return await createUserAccount(data)
    },

    onSuccess: (user) => {
      console.log('Account created successfully:', user)
    },

    onError: (error: any) => {
      console.error('Sign-up error:', error.message || error)
    },
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      return await loginUser(data.email, data.password)
    },

    onSuccess: (session) => {
      console.log('Login successful:', session)
      localStorage.setItem('user', 'true') // Optional, if you’re tracking sessions this way
    },

    onError: (error: any) => {
      console.error('Login failed:', error.message || error)
    },
  })
}

export const useUser = () => {
  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
  console.log("Query:", query)
  return query
}

export const useLogout = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem('user') // optional cleanup
      navigate('/auth/login', { replace: true })
    },
    onError: (error: any) => {
      console.error('Logout failed:', error.message || error)
    }
  })
}