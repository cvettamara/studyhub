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
      <rect x="80" y="320" width="340" height="20" rx="4" fill="#F97316" fillOpacity="0.3" stroke="#F97316" strokeWidth="2"/>
      <rect x="100" y="340" width="20" height="80" rx="3" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="1.5"/>
      <rect x="380" y="340" width="20" height="80" rx="3" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="1.5"/>
      
      {/* Stack of books - Cyan */}
      <rect x="120" y="280" width="70" height="40" rx="3" fill="#06B6D4" fillOpacity="0.3" stroke="#06B6D4" strokeWidth="2"/>
      <rect x="125" y="270" width="65" height="40" rx="3" fill="#06B6D4" fillOpacity="0.2" stroke="#06B6D4" strokeWidth="1.5"/>
      <rect x="130" y="260" width="55" height="40" rx="3" fill="#06B6D4" fillOpacity="0.15" stroke="#06B6D4" strokeWidth="1.5"/>
      <line x1="135" y1="275" x2="175" y2="275" stroke="#06B6D4" strokeWidth="1.5"/>
      <line x1="135" y1="285" x2="165" y2="285" stroke="#06B6D4" strokeWidth="1.5"/>
      
      {/* Laptop - Purple */}
      <rect x="210" y="260" width="100" height="70" rx="4" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2"/>
      <rect x="218" y="268" width="84" height="50" rx="3" fill="#8B5CF6" fillOpacity="0.35"/>
      <rect x="190" y="320" width="140" height="12" rx="3" fill="#8B5CF6" fillOpacity="0.25" stroke="#8B5CF6" strokeWidth="1.5"/>
      {/* Screen content */}
      <rect x="228" y="278" width="50" height="8" rx="2" fill="#8B5CF6" fillOpacity="0.5"/>
      <rect x="228" y="292" width="64" height="6" rx="2" fill="#8B5CF6" fillOpacity="0.4"/>
      <rect x="228" y="302" width="40" height="6" rx="2" fill="#8B5CF6" fillOpacity="0.3"/>
      
      {/* Coffee mug - Green */}
      <path d="M340 290H380V320C380 330 370 340 360 340C350 340 340 330 340 320V290Z" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="2"/>
      <path d="M380 295H390C396 295 400 302 400 310C400 318 396 325 390 325H380" stroke="#10B981" strokeWidth="2"/>
      <path d="M352 280C352 280 356 286 360 286C364 286 368 280 368 280" stroke="#10B981" strokeWidth="2" strokeOpacity="0.6"/>
      <path d="M356 272C356 272 358 278 360 278C362 278 364 272 364 272" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.4"/>
      
      {/* Student sitting - Pink accent */}
      <circle cx="250" cy="180" r="45" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="2"/>
      <circle cx="250" cy="168" r="22" fill="#EC4899" fillOpacity="0.25"/>
      <path d="M225 220C225 195 233 182 250 182C267 182 275 195 275 220" stroke="#EC4899" strokeWidth="2.5"/>
      <rect x="218" y="215" width="64" height="105" rx="12" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="2"/>
      {/* Face */}
      <path d="M235 158C240 152 260 152 265 158" stroke="#EC4899" strokeWidth="2.5"/>
      <circle cx="240" cy="165" r="4" fill="#EC4899"/>
      <circle cx="260" cy="165" r="4" fill="#EC4899"/>
      <path d="M242 180C242 180 250 186 258 180" stroke="#EC4899" strokeWidth="2"/>
      {/* Hair */}
      <path d="M222 150C222 135 232 120 250 120C268 120 278 135 278 150" stroke="#EC4899" strokeWidth="2.5"/>
      <path d="M230 148C230 138 238 128 250 128" stroke="#EC4899" strokeWidth="2"/>
      
      {/* Floating book - Cyan */}
      <g className="animate-float">
        <rect x="60" y="100" width="50" height="65" rx="3" fill="#06B6D4" fillOpacity="0.2" stroke="#06B6D4" strokeWidth="2"/>
        <line x1="85" y1="100" x2="85" y2="165" stroke="#06B6D4" strokeWidth="1.5"/>
        <line x1="70" y1="115" x2="80" y2="115" stroke="#06B6D4" strokeWidth="1.5"/>
        <line x1="70" y1="125" x2="80" y2="125" stroke="#06B6D4" strokeWidth="1.5"/>
        <line x1="70" y1="135" x2="78" y2="135" stroke="#06B6D4" strokeWidth="1.5"/>
      </g>
      
      {/* Floating pencil - Orange */}
      <g className="animate-float-delayed">
        <rect x="420" y="120" width="12" height="80" rx="2" fill="#F97316" fillOpacity="0.3" stroke="#F97316" strokeWidth="1.5" transform="rotate(25 426 160)"/>
        <path d="M418 195L426 210L434 195" fill="#F97316" fillOpacity="0.4" stroke="#F97316" strokeWidth="1.5" transform="rotate(25 426 200)"/>
        <rect x="420" y="120" width="12" height="15" rx="1" fill="#F97316" fillOpacity="0.5" transform="rotate(25 426 127)"/>
      </g>
      
      {/* Floating lightbulb - Green */}
      <g className="animate-float-slow">
        <path d="M400 60C390 60 382 68 382 80C382 88 386 94 392 98V108H408V98C414 94 418 88 418 80C418 68 410 60 400 60Z" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="2"/>
        <path d="M392 108H408V115H392V108Z" fill="#10B981" fillOpacity="0.35"/>
        <path d="M388 118H412" stroke="#10B981" strokeWidth="2"/>
        <path d="M400 45V52M415 55L410 60M385 55L390 60" stroke="#10B981" strokeWidth="2"/>
      </g>
      
      {/* Floating graduation cap - Purple */}
      <g className="animate-float">
        <path d="M80 220L110 205L140 220L110 235L80 220Z" fill="#8B5CF6" fillOpacity="0.25" stroke="#8B5CF6" strokeWidth="2"/>
        <rect x="105" y="220" width="10" height="25" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="1.5"/>
        <path d="M140 220V235L130 240L125 225" stroke="#8B5CF6" strokeWidth="1.5"/>
        <circle cx="130" cy="242" r="3" fill="#8B5CF6" fillOpacity="0.4"/>
      </g>
      
      {/* Floating notebook - Pink */}
      <g className="animate-float-delayed">
        <rect x="380" y="380" width="55" height="70" rx="3" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2"/>
        <line x1="390" y1="395" x2="425" y2="395" stroke="#EC4899" strokeWidth="1.5"/>
        <line x1="390" y1="407" x2="420" y2="407" stroke="#EC4899" strokeWidth="1.5"/>
        <line x1="390" y1="419" x2="415" y2="419" stroke="#EC4899" strokeWidth="1.5"/>
        <line x1="390" y1="431" x2="422" y2="431" stroke="#EC4899" strokeWidth="1.5"/>
        <circle cx="385" cy="395" r="2" fill="#EC4899"/>
        <circle cx="385" cy="407" r="2" fill="#EC4899"/>
        <circle cx="385" cy="419" r="2" fill="#EC4899"/>
        <circle cx="385" cy="431" r="2" fill="#EC4899"/>
      </g>
      
      {/* Small floating stars */}
      <path d="M150 50L153 58H162L155 63L158 72L150 67L142 72L145 63L138 58H147L150 50Z" fill="#F97316" fillOpacity="0.4" stroke="#F97316" strokeWidth="1" className="animate-float"/>
      <path d="M320 80L322 86H328L323 90L325 96L320 92L315 96L317 90L312 86H318L320 80Z" fill="#06B6D4" fillOpacity="0.4" stroke="#06B6D4" strokeWidth="1" className="animate-float-delayed"/>
      <path d="M450 280L452 286H458L453 290L455 296L450 292L445 296L447 290L442 286H448L450 280Z" fill="#EC4899" fillOpacity="0.4" stroke="#EC4899" strokeWidth="1" className="animate-float-slow"/>
      <circle cx="70" cy="300" r="6" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="1.5" className="animate-float"/>
      <circle cx="470" y="180" r="8" fill="#8B5CF6" fillOpacity="0.25" stroke="#8B5CF6" strokeWidth="1.5" className="animate-float-delayed"/>
    </svg>
  )
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState("")

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  console.log("Form submitted!", email, password)
  setError("")
  try {
    const res = await API.post('/auth/login', { email, password })
    login(res.data.token, res.data.user)
    router.push('/')
  } catch (err) {
    console.log("Error:", err)
    setError("Invalid email or password")
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
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-purple-100/50">
            <h1 className="mb-2 text-2xl font-bold text-slate-800">
              Welcome back, scholar! 👋
            </h1>
            <p className="mb-8 text-slate-600">
              Sign in to continue your learning journey
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-800 transition-all duration-200 placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100"
                    placeholder="Enter your password"
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
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link href="#" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                  Forgot password?
                </Link>
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-pink-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-300/50 hover:brightness-105"
              >
                Sign In
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-8 text-center text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Join now
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
