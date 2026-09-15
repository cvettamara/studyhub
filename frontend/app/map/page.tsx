"use client"

import { useState, useEffect } from "react"
import { MapPin, Plus, Star, X, Clock, User } from "lucide-react"
import { StudyHubLayout } from "@/components/studyhub-layout"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import API from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useRequireAuth } from '@/context/AuthContext'

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <p className="text-center text-slate-400 py-20">Се вчитува картата...</p>,
})

interface Location {
  id: number
  user_id: number
  name: string
  description: string
  latitude: number
  longitude: number
  image_url: string | null
  created_at: string
  user_name: string
  user_surname: string
  avg_rating: string | null
  ratings_count: string
  rated_by_me: boolean
}

function StarRating({ rating, onRate, disabled }: {
  rating: number
  onRate?: (rating: number) => void
  disabled?: boolean
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`transition-transform ${!disabled ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`w-5 h-5 transition-colors ${(hovered || rating) >= star
              ? 'fill-[#F97316] text-[#F97316]'
              : 'fill-transparent text-slate-300'
              }`}
          />
        </button>
      ))}
    </div>
  )
}

function LocationCard({ location, onRate }: { location: Location, onRate: (locationId: number, rating: number) => void }) {
  const [userRating, setUserRating] = useState(0)
  const [hasRated, setHasRated] = useState(location.rated_by_me || false)

  const avgRating = location.avg_rating ? parseFloat(location.avg_rating) : 0

  const handleRate = async (rating: number) => {
    if (!hasRated) {
      setUserRating(rating)
      setHasRated(true)
      onRate(location.id, rating)
    }
  }

  return (
    <div className="group relative rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-200">
      {location.image_url && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={location.image_url}
            alt={location.name}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <h3 className="text-lg font-bold text-slate-800 mb-2">{location.name}</h3>
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{location.description}</p>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${avgRating >= star
                ? 'fill-[#F97316] text-[#F97316]'
                : avgRating >= star - 0.5
                  ? 'fill-[#F97316]/50 text-[#F97316]'
                  : 'fill-transparent text-slate-300'
                }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-slate-700">{avgRating.toFixed(1)}</span>
        <span className="text-sm text-slate-500">({location.ratings_count} оценки)</span>
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-1.5">
          {hasRated ? "Благодариме за оценката!" : "Оцени го местото:"}
        </p>
        <StarRating
          rating={userRating}
          onRate={handleRate}
          disabled={hasRated}
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <User className="w-3.5 h-3.5" />
          <span>{location.user_name} {location.user_surname}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date(location.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

function FloatingIllustrations() {
  return (
    <>
      <svg className="absolute top-20 left-[5%] w-16 h-16 animate-float opacity-60" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="12" width="48" height="40" rx="2" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="2" />
        <line x1="32" y1="12" x2="32" y2="52" stroke="#F97316" strokeWidth="2" />
        <path d="M16 20h12M16 28h10M16 36h8" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="absolute top-32 right-[8%] w-14 h-14 animate-float-delayed opacity-60" viewBox="0 0 64 64" fill="none">
        <path d="M12 20h32v28a8 8 0 01-8 8H20a8 8 0 01-8-8V20z" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2" />
        <path d="M44 24h6a6 6 0 010 12h-6" stroke="#EC4899" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-40 left-[3%] w-12 h-12 animate-float-slow opacity-60" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="24" r="16" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2" />
        <path d="M24 40h16M26 46h12M28 52h8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="absolute bottom-32 right-[5%] w-14 h-14 animate-float-delayed opacity-60" viewBox="0 0 64 64" fill="none">
        <path d="M32 56s20-16 20-28a20 20 0 00-40 0c0 12 20 28 20 28z" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="2" />
        <circle cx="32" cy="28" r="8" fill="#F97316" fillOpacity="0.4" stroke="#F97316" strokeWidth="2" />
      </svg>
    </>
  )
}

export default function MapPage() {
  useRequireAuth()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isGeocoding, setIsGeocoding] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await API.get('/map/locations')
      setLocations(res.data)
    } catch (err) {
      console.error('Error fetching locations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGeocode = async () => {
    if (!searchQuery.trim()) return
    setIsGeocoding(true)
    try {
      const token = localStorage.getItem('token')
      const res = await API.get(`/map/locations/geocode?q=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data && res.data.lat && res.data.lon) {
        setFormData(prev => ({
          ...prev,
          latitude: res.data.lat.toString(),
          longitude: res.data.lon.toString(),
          name: prev.name || res.data.display_name.split(',')[0]
        }))
      }
    } catch (err) {
      console.error('Geocoding error:', err)
      alert('Локацијата не е пронајдена.')
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleRate = async (locationId: number, rating: number) => {
    try {
      await API.post(`/map/locations/${locationId}/rate`, { rating })
      fetchLocations()
    } catch (err) {
      console.error('Error rating location:', err)
    }
  }

  const isFormValid = formData.name.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.latitude.trim() !== "" &&
    formData.longitude.trim() !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    try {
      await API.post('/map/locations', {
        name: formData.name,
        description: formData.description,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      })
      fetchLocations()
      setShowModal(false)
      setFormData({ name: "", description: "", latitude: "", longitude: "" })
      setSearchQuery("")
    } catch (err) {
      console.error('Error adding location:', err)
    }
  }

  if (loading) {
    return (
      <StudyHubLayout>
        <div className="flex items-center justify-center py-32">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <span className="font-medium">Се вчитува...</span>
          </div>
        </div>
      </StudyHubLayout>
    )
  }

  return (
    <StudyHubLayout>
      <div className="relative overflow-hidden">
        <FloatingIllustrations />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Мапа на места за учење
                </span>
              </h1>
              <p className="mt-1 text-slate-600">Откриј ги најдобрите места за учење</p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Додади локација
            </Button>
          </div>

          <div className="mb-10">
            <LeafletMap locations={locations} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#F97316]" />
              Места за учење
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} onRate={handleRate} />
              ))}
            </div>
            {locations.length === 0 && (
              <div className="text-center py-16">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">Нема пронајдени локации</h3>
                <p className="text-slate-500">Биди прв што ќе додаде место за учење!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center">
            <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                    Додади локација за учење
                  </span>
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Пополни од адреса / место</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Пример: Public Room, Скопје"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <button
                      type="button"
                      onClick={handleGeocode}
                      disabled={isGeocoding}
                      className="shrink-0 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
                    >
                      {isGeocoding ? "Се пребарува..." : "Најди"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Име на локацијата</label>
                  <input
                    placeholder="пр. Библиотека, втор кат"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Опис</label>
                  <textarea
                    placeholder="Опиши го местото за учење..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Ширина</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="45.2512"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Должина</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="19.8367"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Откажи
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all ${isFormValid ? 'hover:brightness-110' : 'cursor-not-allowed opacity-50'
                      }`}
                  >
                    Додади локација
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </StudyHubLayout>
  )
}