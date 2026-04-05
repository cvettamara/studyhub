"use client"

import { useState, useEffect } from "react"
import { MapPin, Plus, Star, X, Clock, User, Image as ImageIcon } from "lucide-react"
import { StudyHubLayout } from "@/components/studyhub-layout"
import API from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

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
            className={`w-5 h-5 transition-colors ${
              (hovered || rating) >= star
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
  const [hasRated, setHasRated] = useState(false)

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
              className={`w-4 h-4 ${
                avgRating >= star
                  ? 'fill-[#F97316] text-[#F97316]'
                  : avgRating >= star - 0.5
                  ? 'fill-[#F97316]/50 text-[#F97316]'
                  : 'fill-transparent text-slate-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-slate-700">{avgRating.toFixed(1)}</span>
        <span className="text-sm text-slate-500">({location.ratings_count} ratings)</span>
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-1.5">
          {hasRated ? "Thanks for rating!" : "Rate this spot:"}
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

function MapPlaceholder() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#06B6D4]/10 via-[#06B6D4]/5 to-[#10B981]/10 border border-[#06B6D4]/20">
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06B6D4" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300" preserveAspectRatio="none">
        <path d="M0 150 Q100 100, 200 150 T400 150" stroke="#06B6D4" strokeWidth="8" fill="none"/>
        <path d="M200 0 Q250 100, 200 200 T200 300" stroke="#10B981" strokeWidth="6" fill="none"/>
      </svg>
      <div className="absolute top-[20%] left-[25%] animate-bounce" style={{ animationDuration: '2s' }}>
        <MapPin className="w-8 h-8 text-[#F97316] fill-[#F97316]/20 drop-shadow-lg" />
      </div>
      <div className="absolute top-[40%] left-[60%] animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.2s' }}>
        <MapPin className="w-8 h-8 text-[#EC4899] fill-[#EC4899]/20 drop-shadow-lg" />
      </div>
      <div className="absolute top-[60%] left-[35%] animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '1.8s' }}>
        <MapPin className="w-8 h-8 text-[#8B5CF6] fill-[#8B5CF6]/20 drop-shadow-lg" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-[#06B6D4]/20 text-center">
          <MapPin className="w-10 h-10 text-[#06B6D4] mx-auto mb-2" />
          <p className="text-lg font-semibold text-slate-700">Map coming soon</p>
          <p className="text-sm text-slate-500">Google Maps integration in progress</p>
        </div>
      </div>
    </div>
  )
}

function FloatingIllustrations() {
  return (
    <>
      <svg className="absolute top-20 left-[5%] w-16 h-16 animate-float opacity-60" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="12" width="48" height="40" rx="2" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="2"/>
        <line x1="32" y1="12" x2="32" y2="52" stroke="#F97316" strokeWidth="2"/>
        <path d="M16 20h12M16 28h10M16 36h8" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <svg className="absolute top-32 right-[8%] w-14 h-14 animate-float-delayed opacity-60" viewBox="0 0 64 64" fill="none">
        <path d="M12 20h32v28a8 8 0 01-8 8H20a8 8 0 01-8-8V20z" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2"/>
        <path d="M44 24h6a6 6 0 010 12h-6" stroke="#EC4899" strokeWidth="2"/>
      </svg>
      <svg className="absolute bottom-40 left-[3%] w-12 h-12 animate-float-slow opacity-60" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="24" r="16" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2"/>
        <path d="M24 40h16M26 46h12M28 52h8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <svg className="absolute bottom-32 right-[5%] w-14 h-14 animate-float-delayed opacity-60" viewBox="0 0 64 64" fill="none">
        <path d="M32 56s20-16 20-28a20 20 0 00-40 0c0 12 20 28 20 28z" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="2"/>
        <circle cx="32" cy="28" r="8" fill="#F97316" fillOpacity="0.4" stroke="#F97316" strokeWidth="2"/>
      </svg>
    </>
  )
}

export default function MapPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    image_url: "",
  })
  const { user } = useAuth()

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const res = await API.get('/map/locations')
      setLocations(res.data)
    } catch (err) {
      console.error('Error fetching locations:', err)
    } finally {
      setLoading(false)
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
        image_url: formData.image_url || null
      })
      fetchLocations()
      setShowModal(false)
      setFormData({ name: "", description: "", latitude: "", longitude: "", image_url: "" })
    } catch (err) {
      console.error('Error adding location:', err)
    }
  }

  if (loading) {
    return (
      <StudyHubLayout>
        <div className="flex items-center justify-center py-32">
          <p className="text-slate-500">Loading...</p>
        </div>
      </StudyHubLayout>
    )
  }

  return (
    <StudyHubLayout>
      <div className="relative overflow-hidden">
        <FloatingIllustrations />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F97316] to-[#EC4899] bg-clip-text text-transparent mb-2">
                Study Map
              </h1>
              <p className="text-slate-600">Discover the best study spots around campus</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white font-semibold rounded-lg shadow-md hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Location
            </button>
          </div>

          <div className="mb-10">
            <MapPlaceholder />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#F97316]" />
              Study Locations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} onRate={handleRate} />
              ))}
            </div>
            {locations.length === 0 && (
              <div className="text-center py-16">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">No locations yet</h3>
                <p className="text-slate-500">Be the first to add a study spot!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#F97316] to-[#EC4899] bg-clip-text text-transparent">
                Add Study Location
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Location Name</label>
                <input
                  placeholder="e.g., Library 2nd Floor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  placeholder="Describe the study spot..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 min-h-[80px]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="45.2512"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="19.8367"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`flex-1 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EC4899] px-4 py-2 text-sm font-semibold text-white transition-all ${
                    isFormValid ? 'hover:brightness-110' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Add Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StudyHubLayout>
  )
}