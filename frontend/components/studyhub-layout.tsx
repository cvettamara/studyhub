"use client"

import { ReactNode } from "react"
import { Navbar } from "./navbar"

function FloatingDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Book - Orange */}
      <svg className="absolute top-20 left-10 w-16 h-16 animate-float opacity-20" viewBox="0 0 64 64" fill="none">
        <path d="M8 12C8 9.79086 9.79086 8 12 8H52C54.2091 8 56 9.79086 56 12V52C56 54.2091 54.2091 56 52 56H12C9.79086 56 8 54.2091 8 52V12Z" fill="#F97316"/>
        <path d="M16 16H48V48H16V16Z" fill="#FFFAF7"/>
        <path d="M20 24H44M20 32H44M20 40H36" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      {/* Pencil - Pink */}
      <svg className="absolute top-40 right-20 w-14 h-14 animate-float-delayed opacity-20" viewBox="0 0 64 64" fill="none">
        <path d="M12 52L8 56L12 52ZM12 52L44 20L52 28L20 60L8 56L12 52Z" fill="#EC4899"/>
        <path d="M44 20L48 16L56 24L52 28L44 20Z" fill="#EC4899"/>
        <path d="M8 56L12 52L20 60L8 56Z" fill="#FFFAF7"/>
      </svg>
      {/* Graduation Cap - Purple */}
      <svg className="absolute bottom-32 left-20 w-20 h-20 animate-float-slow opacity-20" viewBox="0 0 64 64" fill="none">
        <path d="M32 8L4 24L32 40L60 24L32 8Z" fill="#8B5CF6"/>
        <path d="M12 28V44L32 56L52 44V28" stroke="#8B5CF6" strokeWidth="3" fill="none"/>
        <path d="M56 24V40" stroke="#8B5CF6" strokeWidth="3"/>
        <circle cx="56" cy="42" r="3" fill="#8B5CF6"/>
      </svg>
      {/* Lightbulb - Green */}
      <svg className="absolute top-1/3 right-40 w-12 h-12 animate-float opacity-20" viewBox="0 0 64 64" fill="none">
        <path d="M32 8C21.5066 8 13 16.5066 13 27C13 33.627 16.373 39.4539 21.5 43V48C21.5 50.2091 23.2909 52 25.5 52H38.5C40.7091 52 42.5 50.2091 42.5 48V43C47.627 39.4539 51 33.627 51 27C51 16.5066 42.4934 8 32 8Z" fill="#10B981"/>
        <path d="M25 56H39" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
        <path d="M27 60H37" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      {/* Clock - Cyan */}
      <svg className="absolute bottom-20 right-32 w-16 h-16 animate-float-delayed opacity-20" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" fill="#06B6D4"/>
        <circle cx="32" cy="32" r="20" fill="#FFFAF7"/>
        <path d="M32 16V32L42 42" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      {/* Calculator - Orange */}
      <svg className="absolute top-2/3 left-40 w-14 h-14 animate-float-slow opacity-20" viewBox="0 0 64 64" fill="none">
        <rect x="12" y="8" width="40" height="48" rx="4" fill="#F97316"/>
        <rect x="16" y="12" width="32" height="12" rx="2" fill="#FFFAF7"/>
        <circle cx="22" cy="34" r="3" fill="#FFFAF7"/>
        <circle cx="32" cy="34" r="3" fill="#FFFAF7"/>
        <circle cx="42" cy="34" r="3" fill="#FFFAF7"/>
        <circle cx="22" cy="46" r="3" fill="#FFFAF7"/>
        <circle cx="32" cy="46" r="3" fill="#FFFAF7"/>
        <circle cx="42" cy="46" r="3" fill="#FFFAF7"/>
      </svg>
      {/* Star - Pink */}
      <svg className="absolute top-16 right-1/3 w-10 h-10 animate-float opacity-20" viewBox="0 0 64 64" fill="none">
        <path d="M32 4L39.5 24.5H60L43.5 38L51 60L32 46L13 60L20.5 38L4 24.5H24.5L32 4Z" fill="#EC4899"/>
      </svg>
      {/* Atom - Purple */}
      <svg className="absolute bottom-40 right-1/4 w-18 h-18 animate-float opacity-20" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="6" fill="#8B5CF6"/>
        <ellipse cx="32" cy="32" rx="24" ry="10" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
        <ellipse cx="32" cy="32" rx="24" ry="10" stroke="#8B5CF6" strokeWidth="2" fill="none" transform="rotate(60 32 32)"/>
        <ellipse cx="32" cy="32" rx="24" ry="10" stroke="#8B5CF6" strokeWidth="2" fill="none" transform="rotate(120 32 32)"/>
      </svg>
    </div>
  )
}


interface StudyHubLayoutProps {
  children: ReactNode
}

export function StudyHubLayout({ children }: StudyHubLayoutProps) {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FFFAF7' }}>
      <FloatingDecorations />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {children}
      </main>
    </div>
  )
}