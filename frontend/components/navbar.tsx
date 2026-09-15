"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, GraduationCap, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

const navLinks = [
  {
    name: "Почетна",
    href: "/",
    subtitle: "",
    color: "hover:text-orange-500",
    activeColor: "text-orange-500 border-orange-500",
    borderColor: "hover:border-orange-500",
  },
  {
    name: "Форум",
    href: "/forum",
    subtitle: "Прашај и одговори",
    color: "hover:text-violet-500",
    activeColor: "text-violet-500 border-violet-500",
    borderColor: "hover:border-violet-500",
  },
  {
    name: "Маркет",
    href: "/marketplace",
    subtitle: "Размени, купи или продади",
    color: "hover:text-emerald-500",
    activeColor: "text-emerald-500 border-emerald-500",
    borderColor: "hover:border-emerald-500",
  },
  {
    name: "Настани",
    href: "/events",
    subtitle: "Учи заедно",
    color: "hover:text-pink-500",
    activeColor: "text-pink-500 border-pink-500",
    borderColor: "hover:border-pink-500",
  },
  {
    name: "Мапа",
    href: "/map",
    subtitle: "Најди места за учење",
    color: "hover:text-cyan-500",
    activeColor: "text-cyan-500 border-cyan-500",
    borderColor: "hover:border-cyan-500",
  },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isLoggedIn, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group flex flex-col items-center border-b-2 px-2 py-1 transition-all duration-300 ${isActive
                    ? link.activeColor
                    : `border-transparent ${link.color} ${link.borderColor}`
                    }`}
                >
                  <span
                    className={`text-sm font-semibold transition-colors duration-300 ${isActive ? "" : "text-slate-800"
                      }`}
                  >
                    {link.name}
                  </span>
                  {link.subtitle && (
                    /* Променето од text-[10px] во text-xs и додадена малку подобра видливост */
                    <span className="text-xs font-medium text-slate-500 transition-colors duration-300">
                      {link.subtitle}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons / User Info */}
          <div className="hidden items-center gap-3 lg:flex">
            {isLoggedIn ? (
              <>
                <span className="font-medium text-slate-700">
                  Здраво, <span className="text-orange-500">{user?.name}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-slate-600 hover:bg-pink-50 hover:text-pink-500"
                >
                  <LogOut className="h-4 w-4" />
                  Одјави се
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
                  <Link href="/login">Најави се</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110"
                  asChild
                >
                  <Link href="/register">Регистрирај се</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Затвори мени" : "Отвори мени"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`block rounded-lg px-4 py-3 transition-all duration-200 ${isActive
                  ? "bg-slate-100 font-bold"
                  : `hover:bg-slate-50 ${link.color}`
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="block font-semibold text-slate-800">
                  {link.name}
                </span>
                {link.subtitle && (
                  /* Променето од text-xs во text-sm за мобилната верзија */
                  <span className="block text-sm font-normal text-slate-500">
                    {link.subtitle}
                  </span>
                )}
              </Link>
            )
          })}
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {isLoggedIn ? (
              <>
                <span className="px-4 font-medium text-slate-700">
                  Здраво, <span className="text-orange-500">{user?.name}</span>
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
                  Одјави се
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                  asChild
                >
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Најави се
                  </Link>
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 font-semibold text-white"
                  asChild
                >
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Регистрирај се
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