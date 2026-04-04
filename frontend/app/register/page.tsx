"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import API from "@/lib/api"
import { useState } from "react"
import Link from "next/link"
import { GraduationCap, Eye, EyeOff } from "lucide-react"

function StudyIllustration() {
  return (
    <svg
      className="h-full w-full max-w-xl"
      viewBox="0 0 500 500"
      fill="none"
    >
      {/* Large desk/table */}
      <rect x="80" y="320" width="340" height="20" rx="4" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="2"/>
      <rect x="100" y="340" width="20" height="80" rx="3" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.5"/>
      <rect x="380" y="340" width="20" height="80" rx="3" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.5"/>
      
      {/* Stack of books - Purple */}
      <rect x="320" y="270" width="70" height="50" rx="3" fill="#8B5CF6" fillOpacity="0.3" stroke="#8B5CF6" strokeWidth="2"/>
      <rect x="325" y="258" width="65" height="48" rx="3" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="1.5"/>
      <rect x="330" y="246" width="55" height="46" rx="3" fill="#8B5CF6" fillOpacity="0.15" stroke="#8B5CF6" strokeWidth="1.5"/>
      <line x1="340" y1="262" x2="375" y2="262" stroke="#8B5CF6" strokeWidth="1.5"/>
      <line x1="340" y1="275" x2="365" y2="275" stroke="#8B5CF6" strokeWidth="1.5"/>
      
      {/* Open notebook - Cyan */}
      <rect x="140" y="280" width="80" height="50" rx="3" fill="#06B6D4" fillOpacity="0.2" stroke="#06B6D4" strokeWidth="2"/>
      <line x1="180" y1="280" x2="180" y2="330" stroke="#06B6D4" strokeWidth="2"/>
      <line x1="150" y1="295" x2="172" y2="295" stroke="#06B6D4" strokeWidth="1.5"/>
      <line x1="150" y1="307" x2="170" y2="307" stroke="#06B6D4" strokeWidth="1.5"/>
      <line x1="188" y1="295" x2="210" y2="295" stroke="#06B6D4" strokeWidth="1.5"/>
      <line x1="188" y1="307" x2="208" y2="307" stroke="#06B6D4" strokeWidth="1.5"/>
      
      {/* Pen - Orange */}
      <rect x="230" y="285" width="8" height="45" rx="2" fill="#F97316" fillOpacity="0.35" stroke="#F97316" strokeWidth="1.5" transform="rotate(-30 234 307)"/>
      <path d="M225 325L234 338L243 325" fill="#F97316" fillOpacity="0.45" stroke="#F97316" strokeWidth="1.5" transform="rotate(-30 234 330)"/>
      
      {/* Two students studying together */}
      {/* Student 1 - Left (Cyan accent) */}
      <circle cx="180" cy="170" r="40" fill="#06B6D4" fillOpacity="0.15" stroke="#06B6D4" strokeWidth="2"/>
      <circle cx="180" cy="158" r="20" fill="#06B6D4" fillOpacity="0.25"/>
      <path d="M158 205C158 182 166 172 180 172C194 172 202 182 202 205" stroke="#06B6D4" strokeWidth="2.5"/>
      <rect x="150" y="200" width="60" height="100" rx="12" fill="#06B6D4" fillOpacity="0.12" stroke="#06B6D4" strokeWidth="2"/>
      {/* Face */}
      <path d="M168 148C172 143 188 143 192 148" stroke="#06B6D4" strokeWidth="2"/>
      <circle cx="172" cy="155" r="3.5" fill="#06B6D4"/>
      <circle cx="188" cy="155" r="3.5" fill="#06B6D4"/>
      <path d="M174 168C174 168 180 173 186 168" stroke="#06B6D4" strokeWidth="2"/>
      
      {/* Student 2 - Right (Pink accent) */}
      <circle cx="320" cy="170" r="40" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="2"/>
      <circle cx="320" cy="158" r="20" fill="#EC4899" fillOpacity="0.25"/>
      <path d="M298 205C298 182 306 172 320 172C334 172 342 182 342 205" stroke="#EC4899" strokeWidth="2.5"/>
      <rect x="290" y="200" width="60" height="100" rx="12" fill="#EC4899" fillOpacity="0.12" stroke="#EC4899" strokeWidth="2"/>
      {/* Face */}
      <path d="M308 148C312 143 328 143 332 148" stroke="#EC4899" strokeWidth="2"/>
      <circle cx="312" cy="155" r="3.5" fill="#EC4899"/>
      <circle cx="328" cy="155" r="3.5" fill="#EC4899"/>
      <path d="M314 168C314 168 320 173 326 168" stroke="#EC4899" strokeWidth="2"/>
      {/* Hair */}
      <path d="M298 145C298 130 306 115 320 115C334 115 342 130 342 145" stroke="#EC4899" strokeWidth="2.5"/>
      <path d="M305 140C305 132 310 122 320 122" stroke="#EC4899" strokeWidth="2"/>
      
      {/* Floating books - Orange */}
      <g className="animate-float">
        <rect x="50" y="80" width="55" height="70" rx="3" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="2"/>
        <line x1="77" y1="80" x2="77" y2="150" stroke="#F97316" strokeWidth="1.5"/>
        <line x1="60" y1="98" x2="72" y2="98" stroke="#F97316" strokeWidth="1.5"/>
        <line x1="60" y1="110" x2="70" y2="110" stroke="#F97316" strokeWidth="1.5"/>
        <line x1="60" y1="122" x2="72" y2="122" stroke="#F97316" strokeWidth="1.5"/>
      </g>
      
      {/* Floating lightbulb - Pink */}
      <g className="animate-float-delayed">
        <path d="M430 70C418 70 408 80 408 94C408 104 414 112 422 118V130H438V118C446 112 452 104 452 94C452 80 442 70 430 70Z" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2"/>
        <path d="M422 130H438V140H422V130Z" fill="#EC4899" fillOpacity="0.3"/>
        <path d="M418 145H442" stroke="#EC4899" strokeWidth="2"/>
        <path d="M430 52V62M448 65L442 72M412 65L418 72" stroke="#EC4899" strokeWidth="2"/>
      </g>
      
      {/* Floating pencil - Cyan */}
      <g className="animate-float-slow">
        <rect x="440" y="240" width="14" height="90" rx="2" fill="#06B6D4" fillOpacity="0.25" stroke="#06B6D4" strokeWidth="1.5" transform="rotate(-15 447 285)"/>
        <path d="M436 325L447 345L458 325" fill="#06B6D4" fillOpacity="0.35" stroke="#06B6D4" strokeWidth="1.5" transform="rotate(-15 447 335)"/>
        <rect x="440" y="240" width="14" height="18" rx="1" fill="#06B6D4" fillOpacity="0.4" transform="rotate(-15 447 249)"/>
      </g>
      
      {/* Floating graduation cap - Green */}
      <g className="animate-float">
        <path d="M60 280L95 262L130 280L95 298L60 280Z" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="2"/>
        <rect x="90" y="280" width="10" height="28" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.5"/>
        <path d="M130 280V298L118 304L112 286" stroke="#10B981" strokeWidth="1.5"/>
        <circle cx="118" cy="306" r="4" fill="#10B981" fillOpacity="0.4"/>
      </g>
      
      {/* Floating notebook - Purple */}
      <g className="animate-float-delayed">
        <rect x="380" y="390" width="60" height="75" rx="3" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2"/>
        <line x1="392" y1="408" x2="430" y2="408" stroke="#8B5CF6" strokeWidth="1.5"/>
        <line x1="392" y1="422" x2="425" y2="422" stroke="#8B5CF6" strokeWidth="1.5"/>
        <line x1="392" y1="436" x2="428" y2="436" stroke="#8B5CF6" strokeWidth="1.5"/>
        <line x1="392" y1="450" x2="420" y2="450" stroke="#8B5CF6" strokeWidth="1.5"/>
        <circle cx="387" cy="408" r="2.5" fill="#8B5CF6"/>
        <circle cx="387" cy="422" r="2.5" fill="#8B5CF6"/>
        <circle cx="387" cy="436" r="2.5" fill="#8B5CF6"/>
        <circle cx="387" cy="450" r="2.5" fill="#8B5CF6"/>
      </g>
      
      {/* Small floating stars */}
      <path d="M250 50L254 60H264L256 66L259 76L250 70L241 76L244 66L236 60H246L250 50Z" fill="#10B981" fillOpacity="0.4" stroke="#10B981" strokeWidth="1" className="animate-float"/>
      <path d="M140 380L143 388H151L145 393L147 401L140 396L133 401L135 393L129 388H137L140 380Z" fill="#F97316" fillOpacity="0.4" stroke="#F97316" strokeWidth="1" className="animate-float-delayed"/>
      <path d="M470 350L472 356H478L473 360L475 366L470 362L465 366L467 360L462 356H468L470 350Z" fill="#06B6D4" fillOpacity="0.4" stroke="#06B6D4" strokeWidth="1" className="animate-float-slow"/>
      <circle cx="480" cy="150" r="7" fill="#EC4899" fillOpacity="0.3" stroke="#EC4899" strokeWidth="1.5" className="animate-float"/>
      <circle cx="50" cy="380" r="5" fill="#8B5CF6" fillOpacity="0.3" stroke="#8B5CF6" strokeWidth="1.5" className="animate-float-delayed"/>
      
      {/* Heart between students */}
      <path d="M250 130C250 120 258 115 265 115C275 115 280 125 280 130C280 145 250 165 250 165C250 165 220 145 220 130C220 125 225 115 235 115C242 115 250 120 250 130Z" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="1.5" className="animate-float-slow"/>
    </svg>
  )
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
const router = useRouter()
const { login } = useAuth()
const [error, setError] = useState("")
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  try {
    await API.post('/auth/register', {
      name: formData.firstName,
      surname: formData.lastName,
      email: formData.email,
      password: formData.password
    })
    const res = await API.post('/auth/login', {
      email: formData.email,
      password: formData.password
    })
    login(res.data.token, res.data.user)
    router.push('/')
  } catch (err) {
    setError("Registration failed. Email may already exist.")
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7ED] via-[#FDF4FF] to-[#FFF7ED]">
      <div className="flex min-h-screen">
        {/* Left Side - Illustration (60%) */}
        <div className="hidden w-[60%] items-center justify-center p-8 lg:flex">
          <div className="relative h-full w-full max-w-2xl">
            <StudyIllustration />
          </div>
        </div>

        {/* Right Side - Form (40%) */}
        <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[40%] lg:px-12">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-2 self-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
              StudyHub
            </span>
          </Link>

          {/* Form Card */}
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-emerald-100/50">
            <h1 className="mb-2 text-2xl font-bold text-slate-800">
              Join your faculty community! 🎓
            </h1>
            <p className="mb-8 text-slate-600">
              Create your account and start collaborating
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition-all duration-200 placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition-all duration-200 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  placeholder="you@university.edu"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-800 transition-all duration-200 placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Must be at least 8 characters
                </p>
              </div>
              {error && (
  <p className="text-sm text-red-500 text-center">{error}</p>
)}
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-pink-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-300/50 hover:brightness-105"
              >
                Create Account
              </button>

              {/* Terms */}
              <p className="text-center text-xs text-slate-500">
                By signing up, you agree to our{" "}
                <Link href="#" className="text-purple-600 hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="text-purple-600 hover:underline">Privacy Policy</Link>
              </p>
            </form>

            {/* Login Link */}
            <p className="mt-8 text-center text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-cyan-600 hover:text-cyan-700">
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <Link 
            href="/" 
            className="mt-6 self-start text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
