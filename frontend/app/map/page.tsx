"use client"

import { useState } from "react"
import { MapPin, Plus, Star, X, Clock, User, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StudyHubLayout } from "@/components/studyhub-layout"

// Mock data for locations
const mockLocations = [
  {
    id: 1,
    name: "Central Library - 3rd Floor",
    description: "Quiet zone with individual study pods and great natural lighting. Power outlets at every desk.",
    latitude: 45.2512,
    longitude: 19.8367,
    image_url: null,
    created_at: "2024-01-15",
    user: { name: "Ana M." },
    ratings: [5, 4, 5, 5, 4],
    userRated: false,
  },
  {
    id: 2,
    name: "Caffeine Corner Café",
    description: "Cozy café near campus with strong WiFi and bottomless coffee. Gets busy after 2pm.",
    latitude: 45.2498,
    longitude: 19.8401,
    image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    created_at: "2024-02-20",
    user: { name: "Marko P." },
    ratings: [4, 4, 5, 3, 4],
    userRated: true,
  },
  {
    id: 3,
    name: "Garden Courtyard",
    description: "Open-air study spot with benches and shade trees. Perfect for group study sessions.",
    latitude: 45.2525,
    longitude: 19.8355,
    image_url: null,
    created_at: "2024-03-05",
    user: { name: "Stefan K." },
    ratings: [5, 5, 4],
    userRated: false,
  },
  {
    id: 4,
    name: "Tech Hub - Room 204",
    description: "Computer lab with high-speed internet and dual monitors. Open 24/7 during exam period.",
    latitude: 45.2530,
    longitude: 19.8380,
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    created_at: "2024-03-10",
    user: { name: "Ivana D." },
    ratings: [5, 5, 5, 5, 4, 5],
    userRated: false,
  },
  {
    id: 5,
    name: "Riverside Reading Spot",
    description: "Peaceful benches by the river, ideal for reading. Bring your own blanket and snacks!",
    latitude: 45.2480,
    longitude: 19.8420,
    image_url: null,
    created_at: "2024-03-12",
    user: { name: "Jovan T." },
    ratings: [4, 5, 4, 4],
    userRated: true,
  },
  {
    id: 6,
    name: "Student Union Lounge",
    description: "Comfortable sofas and vending machines nearby. Background music keeps the energy up.",
    latitude: 45.2508,
    longitude: 19.8392,
    image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    created_at: "2024-03-14",
    user: { name: "Milica R." },
    ratings: [3, 4, 4, 3, 4, 4],
    userRated: false,
  },
]

function StarRating({ rating, onRate, disabled, interactive = true }: { 
  rating: number
  onRate?: (rating: number) => void
  disabled?: boolean
  interactive?: boolean 
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled || !interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && !disabled && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`transition-transform ${interactive && !disabled ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
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

function LocationCard({ location }: { location: typeof mockLocations[0] }) {
  const [userRating, setUserRating] = useState(0)
  const [hasRated, setHasRated] = useState(location.userRated)

  const avgRating = location.ratings.length > 0 
    ? location.ratings.reduce((a, b) => a + b, 0) / location.ratings.length 
    : 0

  const handleRate = (rating: number) => {
    if (!hasRated) {
      setUserRating(rating)
      setHasRated(true)
      // In a real app, this would make an API call
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
      
      {/* Rating display */}
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
        <span className="text-sm text-slate-500">({location.ratings.length} ratings)</span>
      </div>

      {/* Rate this spot */}
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

      {/* Meta info */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <User className="w-3.5 h-3.5" />
          <span>{location.user.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date(location.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

function AddLocationModal() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    image_url: "",
  })

  const isFormValid = formData.name.trim() !== "" && 
    formData.description.trim() !== "" && 
    formData.latitude.trim() !== "" && 
    formData.longitude.trim() !== ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    // In a real app, this would make an API call
    console.log("Submitting:", formData)
    setOpen(false)
    setFormData({ name: "", description: "", latitude: "", longitude: "", image_url: "" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white shadow-md hover:brightness-110 border-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#F97316] to-[#EC4899] bg-clip-text text-transparent">
            Add Study Location
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">Location Name</Label>
            <Input
              id="name"
              placeholder="e.g., Library 2nd Floor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-slate-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the study spot..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="border-slate-200 focus:border-orange-400 focus:ring-orange-400 min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-slate-700">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="45.2512"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                required
                className="border-slate-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-slate-700">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="19.8367"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                required
                className="border-slate-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-slate-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Image URL (optional)
            </Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="border-slate-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white border-0 transition-all ${
                isFormValid 
                  ? 'hover:brightness-110 opacity-100' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Add Location
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function MapPlaceholder() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#06B6D4]/10 via-[#06B6D4]/5 to-[#10B981]/10 border border-[#06B6D4]/20">
      {/* Grid pattern */}
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
      
      {/* Decorative paths (roads) */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300" preserveAspectRatio="none">
        <path d="M0 150 Q100 100, 200 150 T400 150" stroke="#06B6D4" strokeWidth="8" fill="none"/>
        <path d="M200 0 Q250 100, 200 200 T200 300" stroke="#10B981" strokeWidth="6" fill="none"/>
        <path d="M50 50 Q150 150, 350 100" stroke="#06B6D4" strokeWidth="4" fill="none"/>
        <path d="M100 250 Q200 200, 350 250" stroke="#10B981" strokeWidth="4" fill="none"/>
      </svg>
      
      {/* Decorative location pins */}
      <div className="absolute top-[20%] left-[25%] animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>
        <div className="relative">
          <MapPin className="w-8 h-8 text-[#F97316] fill-[#F97316]/20 drop-shadow-lg" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-sm" />
        </div>
      </div>
      <div className="absolute top-[40%] left-[60%] animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.2s' }}>
        <div className="relative">
          <MapPin className="w-8 h-8 text-[#EC4899] fill-[#EC4899]/20 drop-shadow-lg" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-sm" />
        </div>
      </div>
      <div className="absolute top-[60%] left-[35%] animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '1.8s' }}>
        <div className="relative">
          <MapPin className="w-8 h-8 text-[#8B5CF6] fill-[#8B5CF6]/20 drop-shadow-lg" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-sm" />
        </div>
      </div>
      <div className="absolute top-[30%] left-[75%] animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '2.4s' }}>
        <div className="relative">
          <MapPin className="w-8 h-8 text-[#10B981] fill-[#10B981]/20 drop-shadow-lg" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-sm" />
        </div>
      </div>
      <div className="absolute top-[70%] left-[70%] animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2s' }}>
        <div className="relative">
          <MapPin className="w-8 h-8 text-[#06B6D4] fill-[#06B6D4]/20 drop-shadow-lg" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-sm" />
        </div>
      </div>
      
      {/* Center message */}
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

// Floating SVG illustrations
function FloatingIllustrations() {
  return (
    <>
      {/* Book - Orange */}
      <svg className="absolute top-20 left-[5%] w-16 h-16 animate-float opacity-60" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="12" width="48" height="40" rx="2" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="2"/>
        <line x1="32" y1="12" x2="32" y2="52" stroke="#F97316" strokeWidth="2"/>
        <path d="M16 20h12M16 28h10M16 36h8" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
        <path d="M36 20h12M36 28h10M36 36h8" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      
      {/* Coffee cup - Pink */}
      <svg className="absolute top-32 right-[8%] w-14 h-14 animate-float-delayed opacity-60" viewBox="0 0 64 64" fill="none">
        <path d="M12 20h32v28a8 8 0 01-8 8H20a8 8 0 01-8-8V20z" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2"/>
        <path d="M44 24h6a6 6 0 010 12h-6" stroke="#EC4899" strokeWidth="2"/>
        <path d="M20 8c0 4 4 8 4 12M28 8c0 4 4 8 4 12M36 8c0 4 4 8 4 12" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      
      {/* Lightbulb - Purple */}
      <svg className="absolute bottom-40 left-[3%] w-12 h-12 animate-float-slow opacity-60" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="24" r="16" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2"/>
        <path d="M24 40h16M26 46h12M28 52h8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26 24l6 6 10-10" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      
      {/* Compass - Emerald */}
      <svg className="absolute top-48 left-[12%] w-10 h-10 animate-float opacity-50" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2"/>
        <path d="M32 12v8M32 44v8M12 32h8M44 32h8" stroke="#10B981" strokeWidth="2"/>
        <polygon points="32,20 38,32 32,44 26,32" fill="#10B981" fillOpacity="0.4" stroke="#10B981" strokeWidth="1"/>
      </svg>
      
      {/* Pencil - Cyan */}
      <svg className="absolute bottom-32 right-[5%] w-14 h-14 animate-float-delayed opacity-60" viewBox="0 0 64 64" fill="none">
        <path d="M48 8l8 8-32 32H16V40L48 8z" fill="#06B6D4" fillOpacity="0.2" stroke="#06B6D4" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M40 16l8 8" stroke="#06B6D4" strokeWidth="2"/>
        <path d="M16 48l4-12 8 8-12 4z" fill="#06B6D4" fillOpacity="0.4"/>
      </svg>
      
      {/* Location pin - Orange */}
      <svg className="absolute top-[60%] right-[10%] w-10 h-10 animate-float-slow opacity-50" viewBox="0 0 64 64" fill="none">
        <path d="M32 56s20-16 20-28a20 20 0 00-40 0c0 12 20 28 20 28z" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="2"/>
        <circle cx="32" cy="28" r="8" fill="#F97316" fillOpacity="0.4" stroke="#F97316" strokeWidth="2"/>
      </svg>
      
      {/* Star - Pink */}
      <svg className="absolute bottom-[20%] left-[8%] w-8 h-8 animate-float opacity-50" viewBox="0 0 64 64" fill="none">
        <path d="M32 4l7.5 15.2L56 22l-12 11.7L46.9 52 32 44l-14.9 8 2.9-18.3L8 22l16.5-2.8L32 4z" fill="#EC4899" fillOpacity="0.3" stroke="#EC4899" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
      
      {/* Wifi - Emerald */}
      <svg className="absolute top-[45%] left-[2%] w-10 h-10 animate-float-delayed opacity-40" viewBox="0 0 64 64" fill="none">
        <path d="M32 48a4 4 0 100-8 4 4 0 000 8z" fill="#10B981"/>
        <path d="M24 36a12 12 0 0116 0M16 28a24 24 0 0132 0M8 20a36 36 0 0148 0" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </>
  )
}

export default function MapPage() {
return (
    <StudyHubLayout>
      <div className="relative overflow-hidden">
      <FloatingIllustrations />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F97316] to-[#EC4899] bg-clip-text text-transparent mb-2">
              Study Map
            </h1>
            <p className="text-slate-600">Discover the best study spots around campus</p>
          </div>
          <AddLocationModal />
        </div>
        
        {/* Map Placeholder */}
        <div className="mb-10">
          <MapPlaceholder />
        </div>
        
        {/* Location Cards Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F97316]" />
            Study Locations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </div>
</div>
    </div>
    </StudyHubLayout>
  )
}
