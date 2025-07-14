import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLogin, useSignUp } from '../../hooks/useAuth'
import AuthFooter from '../../components/common/AuthFooter'
import Loader from '../../components/common/Loader'
import { logoutUser } from '../../lib/api'

const SignUpPage = () => {
  const navigate = useNavigate()
  const { mutateAsync: signUpMutation, isPending: isSigningUp, isError: signUpError } = useSignUp();
  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useLogin();


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

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  const isFormValid =
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password.trim().length >= 8 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

   try {
  await signUpMutation(form); // wait for account to be created
  console.log('User signed up successfully', form);

  await loginMutation(form, {
    onSuccess: () => {
      console.log('User signed up and logged in successfully', form);
      navigate('/onboarding');
    }
  });
} catch (err) {
  console.error('Signup or login failed:', err);
}
  }

  const getFriendlyError = (error: unknown) => {
    const msg = (error as Error)?.message || ''
    if (msg.includes('already exists')) return 'An account with this email already exists.'
    if (msg.includes('invalid')) return 'Please use a valid email address.'
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
          Create your <span className="text-[#a874f8]">tint</span> account
        </h2>
        <p className="text-sm text-center text-[#a874f8]/80 mb-6">
          Join your campus communities today.
        </p>

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-white mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="w-full p-2.5 rounded-xl bg-[#0e0b10] border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#a874f8]"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@mail.com"
              className="w-full p-2.5 rounded-xl bg-[#0e0b10] border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#a874f8]"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password"
                className="w-full p-2.5 pr-20 rounded-xl bg-[#0e0b10] border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#a874f8]"
                value={form.password}
                onChange={handleChange}
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

          {/* Department Dropdown
          <div>
            <label htmlFor="department" className="block text-sm text-white mb-1">
              Department
            </label>
            <select
              name="department"
              id="department"
              value={form.department}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl bg-[#0e0b10] border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#a874f8] appearance-none"
              required
            >
              <option value="" disabled>Select Department</option>

              <optgroup label="School of Agric and Agricultural Technology">
                <option value="AET">Agricultural Economics and Farm Management</option>
                <option value="AEX">Agricultural Extension and Rural Development</option>
                <option value="APT">Animal Production</option>
                <option value="CRP">Crop Production</option>
                <option value="FST">Food Science and Technology</option>
                <option value="EEE1">Horticulture</option>
                <option value="SLM">Soil Science and Land Management</option>
                <option value="WAF">Water Resources, Aquaculture and Fisheries Technology</option>
              </optgroup>

              <optgroup label="School of Electrical and Engineering Technology">
                <option value="CPE">Computer Engineering</option>
                <option value="EEE2">Electrical Engineering</option>
                <option value="MCE">Mechatronics Engineering</option>
                <option value="TME">Telecommunication Engineering</option>
              </optgroup>

              <optgroup label="School of Entrepreneurship and Management Technology">
                <option value="EBS">Entrepreneurship and Business Studies</option>
                <option value="PMT1">Project Management</option>
                <option value="PMT2">Transport Management</option>
              </optgroup>

              <optgroup label="School of Environmental Technology">
                <option value="ARC">Architecture</option>
                <option value="BLD">Building</option>
                <option value="ETM">Estate Management and Valuation</option>
                <option value="QTS">Quantity Survey</option>
                <option value="SVG">Surveying and Geoinformatics</option>
                <option value="URP">Urban and Regional Planning</option>
              </optgroup>

              <optgroup label="School of Information Communication Technology">
                <option value="CPT">Computer Science</option>
                <option value="IFT">Information Technology</option>
                <option value="CSS">Cyber Security Science</option>
                <option value="ISMS">Information Science and Media Studies</option>
              </optgroup>

              <optgroup label="School of Infrastructure Process Engineering and Technology">
                <option value="ABE">Agricultural and Bioresource Engineering</option>
                <option value="CEE">Chemical Engineering</option>
                <option value="CIE">Civil Engineering</option>
                <option value="MEE">Mechanical Engineering</option>
                <option value="MME">Material and Metallurgical Engineering</option>
              </optgroup>

              <optgroup label="School of Life Sciences">
                <option value="ANB">Animal Biology</option>
                <option value="BCH">Biochemistry</option>
                <option value="MCB">Microbiology</option>
                <option value="PLB">Plant Biology</option>
              </optgroup>

              <optgroup label="School of Physical Sciences">
                <option value="CHM">Chemistry</option>
                <option value="GRY">Geography</option>
                <option value="GEL">Geology</option>
                <option value="PHY">Physics</option>
                <option value="STA">Statistics</option>
              </optgroup>

              <optgroup label="School of Science and Technology Education">
                <option value="EDT">Educational Technology</option>
                <option value="GST">General Studies</option>
                <option value="ITE">Industrial and Technology Education</option>
                <option value="EDU">Science Education</option>
              </optgroup>
            </select>
          </div> */}

          {/* Error */}
          {signUpError && (
            <p className="text-red-500 text-sm text-center">
              {getFriendlyError(signUpError)}
            </p>
          )}

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid || isSigningUp}
              className={`px-8 py-2 rounded-xl bg-[#a874f8] text-white font-semibold transition 
                ${!isFormValid || isSigningUp
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-[0_0_10px_#a874f8]'}`}
            >
              {isSigningUp || isLoggingIn ? <Loader /> : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-[#a874f8] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
    <AuthFooter />
    </div>

  )
}

export default SignUpPage
