import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLogin } from '../../hooks/useAuth'
import AuthFooter from '../../components/common/AuthFooter'
import  Loader from '../../components/common/Loader'
import { logoutUser } from '../../lib/api'


const LoginPage = () => {
  const navigate = useNavigate()
  const { mutateAsync:loginMutation, isPending: isLoggingIn, isError: loginError, error} = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const isFormValid = email.trim() !== '' && password.trim() !== ''

      useEffect(() => {
      const destroySession = async () => {
        try {
          await logoutUser();
        } catch (err) {
          console.warn('No session to delete or already deleted.')
        }
      }

      destroySession()
    }, [])

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    await loginMutation({ email, password })
    console.log('Login successful')
    navigate('/') // Only navigate if login succeeds
  } catch (error) {
    console.error('Login failed:', error)
    // Optional: display error to user
  }
}


 const getFriendlyError = (error: unknown) => {
  const rawMessage =
    (error as any)?.message ||
    (error as any)?.response?.message ||
    (error as Error)?.toString() ||
    ''

  if (rawMessage.toLowerCase().includes('invalid credentials')) {
    return 'Invalid email or password.'
  }

  if (rawMessage.toLowerCase().includes('user not found')) {
    return 'No account found with this email.'
  }

  return 'Oops! Something went wrong. Please try again.'
}


  return (
    <div className='bg-[#0e0b10]'>
    <div className="min-h-screen bg-[#0e0b10] flex items-center justify-center px-4 text-base">
      <div className="relative z-10 bg-[#161116]/80 backdrop-blur-md border border-[#a874f8]/10 p-10 rounded-3xl shadow-[0_0_20px_#a874f820] w-full max-w-md">
        
        <div className="flex justify-center mb-4">
          <img
            src="../../../images/logo 2.png"
            alt="tint logo"
            className="h-10 md:h-12 object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-1">
          Welcome to <span className="text-[#a874f8]">tint</span>
        </h2>
        <p className="text-sm text-center text-[#a874f8]/80 mb-6">
          Log in to explore your campus communities.
        </p>

        <img src="../../images/icons/Edit Post Icon.svg" alt="Omo men" className='h-20'/>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <input
              type="email"
              placeholder="you@mail.com"
              className="w-full p-2.5 rounded-xl bg-[#0e0b10] border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#a874f8]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full p-2.5 pr-20 rounded-xl bg-[#0e0b10] border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#a874f8]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white hover:text-[#a874f8] font-medium"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {loginError && (
            <p className="text-red-500 text-sm text-center">
              {getFriendlyError(error)}
            </p>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid || isLoggingIn}
              className={`px-8 py-2 rounded-xl bg-[#a874f8] text-white font-semibold transition 
                ${!isFormValid || isLoggingIn
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-[0_0_10px_#a874f8]'}`}
            >
              {isLoggingIn ? <Loader /> : 'Log In'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Don’t have an account?{' '}
          <Link to="/auth/signup" className="text-[#a874f8] hover:underline">Create one</Link>
        </p>
      </div>
      
    </div>
    <AuthFooter />
    </div>
  )
}

export default LoginPage
