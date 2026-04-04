"use client"


import { StudyHubLayout } from "@/components/studyhub-layout"
import { MapPin, ShoppingBag, MessageSquare, Calendar, Sparkles } from "lucide-react"

const modules = [
  {
    name: "Map",
    description: "Discover and share the best study spots around campus",
    icon: MapPin,
    textColor: "text-cyan-700",
    iconColor: "text-cyan-600",
    gradientBg: "bg-gradient-to-br from-cyan-100 via-cyan-50 to-cyan-100/50",
    borderColor: "border-cyan-200/60",
    hoverShadow: "hover:shadow-cyan-200/50",
  },
  {
    name: "Marketplace",
    description: "Buy and sell textbooks and study materials",
    icon: ShoppingBag,
    textColor: "text-emerald-700",
    iconColor: "text-emerald-600",
    gradientBg: "bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-100/50",
    borderColor: "border-emerald-200/60",
    hoverShadow: "hover:shadow-emerald-200/50",
  },
  {
    name: "Forum",
    description: "Ask questions and share knowledge with peers",
    icon: MessageSquare,
    textColor: "text-violet-700",
    iconColor: "text-violet-600",
    gradientBg: "bg-gradient-to-br from-violet-100 via-violet-50 to-violet-100/50",
    borderColor: "border-violet-200/60",
    hoverShadow: "hover:shadow-violet-200/50",
  },
  {
    name: "Events",
    description: "Join and create study groups and academic events",
    icon: Calendar,
    textColor: "text-pink-700",
    iconColor: "text-pink-600",
    gradientBg: "bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100/50",
    borderColor: "border-pink-200/60",
    hoverShadow: "hover:shadow-pink-200/50",
  },
  {
    name: "Resources",
    description: "Access curated learning materials and guides",
    icon: Sparkles,
    textColor: "text-orange-700",
    iconColor: "text-orange-600",
    gradientBg: "bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100/50",
    borderColor: "border-orange-200/60",
    hoverShadow: "hover:shadow-orange-200/50",
  },
]

function HeroIllustration() {
  return (
    <svg
      className="mx-auto h-64 w-full max-w-lg sm:h-80"
      viewBox="0 0 400 300"
      fill="none"
    >
      {/* Table */}
      <rect x="50" y="180" width="300" height="15" rx="3" fill="#F97316" fillOpacity="0.3" stroke="#F97316" strokeWidth="2"/>
      <rect x="70" y="195" width="15" height="60" rx="2" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="1.5"/>
      <rect x="315" y="195" width="15" height="60" rx="2" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="1.5"/>
      
      {/* Books on table */}
      <rect x="100" y="160" width="40" height="20" rx="2" fill="#06B6D4" fillOpacity="0.3" stroke="#06B6D4" strokeWidth="2"/>
      <rect x="105" y="155" width="35" height="20" rx="2" fill="#06B6D4" fillOpacity="0.2" stroke="#06B6D4" strokeWidth="1.5"/>
      
      {/* Laptop */}
      <rect x="160" y="140" width="80" height="50" rx="3" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2"/>
      <rect x="165" y="145" width="70" height="35" rx="2" fill="#8B5CF6" fillOpacity="0.3"/>
      <rect x="145" y="180" width="110" height="8" rx="2" fill="#8B5CF6" fillOpacity="0.25" stroke="#8B5CF6" strokeWidth="1.5"/>
      
      {/* Coffee cup */}
      <path d="M280 165H310V180C310 185 305 190 295 190C285 190 280 185 280 180V165Z" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2"/>
      <path d="M310 168H315C318 168 320 172 320 176C320 180 318 183 315 183H310" stroke="#10B981" strokeWidth="1.5"/>
      <path d="M288 158C288 158 290 162 295 162C300 162 302 158 302 158" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.6"/>
      
      {/* Student 1 - Left (Cyan accent) */}
      <circle cx="120" cy="100" r="25" fill="#06B6D4" fillOpacity="0.2" stroke="#06B6D4" strokeWidth="2"/>
      <circle cx="120" cy="95" r="12" fill="#06B6D4" fillOpacity="0.3"/>
      <path d="M105 130C105 115 110 108 120 108C130 108 135 115 135 130" stroke="#06B6D4" strokeWidth="2"/>
      <rect x="100" y="125" width="40" height="55" rx="8" fill="#06B6D4" fillOpacity="0.15" stroke="#06B6D4" strokeWidth="2"/>
      <path d="M112 88C115 85 125 85 128 88" stroke="#06B6D4" strokeWidth="2"/>
      <circle cx="115" cy="93" r="2" fill="#06B6D4"/>
      <circle cx="125" cy="93" r="2" fill="#06B6D4"/>
      <path d="M116 100C116 100 120 103 124 100" stroke="#06B6D4" strokeWidth="1.5"/>
      
      {/* Student 2 - Center (Purple accent) */}
      <circle cx="200" cy="85" r="28" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2"/>
      <circle cx="200" cy="80" r="14" fill="#8B5CF6" fillOpacity="0.3"/>
      <path d="M182 118C182 100 188 92 200 92C212 92 218 100 218 118" stroke="#8B5CF6" strokeWidth="2"/>
      <rect x="178" y="115" width="44" height="65" rx="10" fill="#8B5CF6" fillOpacity="0.15" stroke="#8B5CF6" strokeWidth="2"/>
      <path d="M190 70C194 66 206 66 210 70" stroke="#8B5CF6" strokeWidth="2"/>
      <circle cx="193" cy="78" r="2.5" fill="#8B5CF6"/>
      <circle cx="207" cy="78" r="2.5" fill="#8B5CF6"/>
      <path d="M194 87C194 87 200 91 206 87" stroke="#8B5CF6" strokeWidth="1.5"/>
      
      {/* Student 3 - Right (Pink accent) */}
      <circle cx="280" cy="100" r="25" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2"/>
      <circle cx="280" cy="95" r="12" fill="#EC4899" fillOpacity="0.3"/>
      <path d="M265 130C265 115 270 108 280 108C290 108 295 115 295 130" stroke="#EC4899" strokeWidth="2"/>
      <rect x="260" y="125" width="40" height="55" rx="8" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="2"/>
      <path d="M272 88C275 85 285 85 288 88" stroke="#EC4899" strokeWidth="2"/>
      <circle cx="275" cy="93" r="2" fill="#EC4899"/>
      <circle cx="285" cy="93" r="2" fill="#EC4899"/>
      <path d="M276 100C276 100 280 103 284 100" stroke="#EC4899" strokeWidth="1.5"/>
      <path d="M268 82C268 78 272 72 280 72C288 72 292 78 292 82" stroke="#EC4899" strokeWidth="2"/>
      
      {/* Floating elements */}
      <path d="M60 60L65 70L75 70L68 77L70 87L60 82L50 87L52 77L45 70L55 70L60 60Z" fill="#10B981" fillOpacity="0.4" stroke="#10B981" strokeWidth="1.5"/>
      <path d="M340 50L343 58L352 58L346 63L348 72L340 67L332 72L334 63L328 58L337 58L340 50Z" fill="#F97316" fillOpacity="0.4" stroke="#F97316" strokeWidth="1.5"/>
      <circle cx="330" cy="120" r="8" fill="#06B6D4" fillOpacity="0.3" stroke="#06B6D4" strokeWidth="1.5"/>
      <circle cx="70" cy="140" r="6" fill="#EC4899" fillOpacity="0.3" stroke="#EC4899" strokeWidth="1.5"/>
      
      {/* Lightbulb above center student - idea moment */}
      <path d="M200 35C195 35 191 39 191 44C191 47 193 50 196 51.5V55H204V51.5C207 50 209 47 209 44C209 39 205 35 200 35Z" fill="#F97316" fillOpacity="0.3" stroke="#F97316" strokeWidth="1.5"/>
      <path d="M196 55H204V58H196V55Z" fill="#F97316" fillOpacity="0.4"/>
      <path d="M200 28V32M210 34L207 37M190 34L193 37" stroke="#F97316" strokeWidth="1.5"/>
    </svg>
  )
}

export default function HomePage() {
  return (
    <StudyHubLayout>
      <div className="py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold text-slate-800 sm:text-5xl lg:text-6xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              StudyHub
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-slate-600">
            Your all-in-one platform for student collaboration. Find study spots, trade materials,
            discuss topics, and join study events — all in one place.
          </p>
          <div className="mt-8">
            <HeroIllustration />
          </div>
        </section>

        {/* Modules Grid */}
        <section>
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-800">
            Explore Our Modules
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {modules.map((module) => (
              <div
                key={module.name}
                className={`group flex cursor-pointer items-start gap-3 rounded-xl border ${module.borderColor} ${module.gradientBg} px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${module.hoverShadow}`}
              >
                <div className="flex-shrink-0 pt-0.5">
                  <module.icon className={`h-5 w-5 ${module.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-sm font-bold ${module.textColor}`}>{module.name}</h3>
                  <p className="mt-0.5 text-xs leading-snug text-slate-600">{module.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Welcoming Section */}
        <section className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100/50 px-8 py-12 sm:px-12 sm:py-16">
          <svg className="absolute left-4 top-4 h-12 w-12 animate-float opacity-40 sm:left-8 sm:top-8 sm:h-16 sm:w-16" viewBox="0 0 50 50" fill="none">
            <path d="M25 5L28 18H42L31 27L34 40L25 32L16 40L19 27L8 18H22L25 5Z" fill="#F97316" stroke="#F97316" strokeWidth="1.5"/>
          </svg>
          <svg className="absolute right-6 top-6 h-10 w-10 animate-float-delayed opacity-40 sm:right-12 sm:h-14 sm:w-14" viewBox="0 0 50 50" fill="none">
            <path d="M25 8L27 16H35L29 21L31 29L25 24L19 29L21 21L15 16H23L25 8Z" fill="#EC4899" stroke="#EC4899" strokeWidth="1.5"/>
          </svg>
          <svg className="absolute bottom-8 left-8 h-14 w-14 animate-float-slow opacity-30 sm:left-16 sm:h-20 sm:w-20" viewBox="0 0 60 60" fill="none">
            <rect x="10" y="15" width="40" height="30" rx="2" fill="#F97316" fillOpacity="0.3" stroke="#F97316" strokeWidth="2"/>
            <rect x="15" y="10" width="35" height="30" rx="2" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="1.5"/>
            <line x1="20" y1="22" x2="40" y2="22" stroke="#F97316" strokeWidth="1.5"/>
            <line x1="20" y1="28" x2="35" y2="28" stroke="#F97316" strokeWidth="1.5"/>
          </svg>
          <div className="relative z-10 text-center">
            <h3 className="mb-6 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-600 bg-clip-text text-transparent">
                Your Journey to Success Starts Here
              </span>
            </h3>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-700">
              Every great achievement begins with the decision to try. Whether you&apos;re preparing for 
              exams, working on a group project, or exploring new subjects — you&apos;re not alone. 
              Join thousands of students who support each other every day.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-cyan-700 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                Learn Together
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Grow Together
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Succeed Together
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-pink-700 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-pink-500" />
                Share Knowledge
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-orange-700 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Build Friendships
              </span>
            </div>
          </div>
        </section>
      </div>
    </StudyHubLayout>
  )
}