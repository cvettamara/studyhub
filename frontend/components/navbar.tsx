"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, GraduationCap, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

const navLinks = [
  {
    name: "Home",
    href: "/",
    subtitle: "",
    color: "hover:text-orange-500",
    borderColor: "hover:border-orange-500",
  },
  {
    name: "Map",
    href: "/map",
    subtitle: "Find study spots",
    color: "hover:text-cyan-500",
    borderColor: "hover:border-cyan-500",
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    subtitle: "Buy & sell materials",
    color: "hover:text-emerald-500",
    borderColor: "hover:border-emerald-500",
  },
  {
    name: "Forum",
    href: "/forum",
    subtitle: "Ask & answer",
    color: "hover:text-violet-500",
    borderColor: "hover:border-violet-500",
  },
  {
    name: "Events",
    href: "/events",
    subtitle: "Study together",
    color: "hover:text-pink-500",
    borderColor: "hover:border-pink-500",
  },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isLoggedIn, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-orange-500" />
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
              StudyHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`group flex flex-col items-center border-b-2 border-transparent px-2 py-1 transition-all duration-300 ${link.color} ${link.borderColor}`}
              >
                <span className="text-sm font-semibold text-slate-800 transition-colors duration-300 group-hover:inherit">
                  {link.name}
                </span>
                {link.subtitle && (
                  <span className="text-[10px] text-slate-400 transition-colors duration-300">
                    {link.subtitle}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons / User Info */}
          <div className="hidden items-center gap-3 lg:flex">
            {isLoggedIn ? (
              <>
                <span className="font-medium text-slate-700">
                  Hi, <span className="text-orange-500">{user?.name}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-slate-600 hover:bg-pink-50 hover:text-pink-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110"
                  asChild
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block rounded-lg px-4 py-3 transition-all duration-200 hover:bg-slate-50 ${link.color}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="block font-semibold text-slate-800">{link.name}</span>
              {link.subtitle && (
                <span className="block text-xs text-slate-400">{link.subtitle}</span>
              )}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {isLoggedIn ? (
              <>
                <span className="px-4 font-medium text-slate-700">
                  Hi, <span className="text-orange-500">{user?.name}</span>
                </span>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full justify-start gap-2 text-slate-600 hover:bg-pink-50 hover:text-pink-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                  asChild
                >
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 font-semibold text-white"
                  asChild
                >
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}