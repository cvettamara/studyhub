"use client"

import { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from "react"
import Image from "next/image"
import { StudyHubLayout } from "@/components/studyhub-layout"
import { Button } from "@/components/ui/button"
import {
  Plus,
  X,
  Mail,
  Trash2,
  CheckCircle,
  Tag,
  Image as ImageIcon,
  Search,
  Loader2,
} from "lucide-react"
import API from "@/lib/api"
import { useAuth, useRequireAuth } from "@/context/AuthContext"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const SUBJECTS = [
  {
    name: "Сите",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    activeColor: "bg-slate-700 text-white border-slate-700",
    cardAccent: "border-l-slate-400",
  },
  {
    name: "Математика 1",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    activeColor: "bg-cyan-500 text-white border-cyan-500",
    cardAccent: "border-l-cyan-400",
  },
  {
    name: "Програмирање и алгоритми",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    activeColor: "bg-emerald-500 text-white border-emerald-500",
    cardAccent: "border-l-emerald-400",
  },
  {
    name: "Физика 1",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    activeColor: "bg-violet-500 text-white border-violet-500",
    cardAccent: "border-l-violet-400",
  },
  {
    name: "Сигнали и системи",
    color: "bg-pink-50 text-pink-700 border-pink-200",
    activeColor: "bg-pink-500 text-white border-pink-500",
    cardAccent: "border-l-pink-400",
  },
  {
    name: "Комуникациски технологии",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    activeColor: "bg-orange-500 text-white border-orange-500",
    cardAccent: "border-l-orange-400",
  },
  {
    name: "Логички дизајн",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    activeColor: "bg-cyan-500 text-white border-cyan-500",
    cardAccent: "border-l-cyan-400",
  },
  {
    name: "Мерења во електротехника",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    activeColor: "bg-emerald-500 text-white border-emerald-500",
    cardAccent: "border-l-emerald-400",
  },
  {
    name: "Основи на WEB програмирање",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    activeColor: "bg-violet-500 text-white border-violet-500",
    cardAccent: "border-l-violet-400",
  },
] as const

const getSubjectColors = (subjectName: string) => {
  return SUBJECTS.find((s) => s.name === subjectName) || SUBJECTS[0]
}

interface Listing {
  id: number
  user_id: number
  title: string
  description: string
  subject: string
  price: number
  status: "available" | "sold"
  image_url: string | null
  name: string
  surname: string
  email: string
  created_at: string
}

export default function MarketplacePage() {
  useRequireAuth()

  const { user } = useAuth()

  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState("Сите")

  const [showPostModal, setShowPostModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newListing, setNewListing] = useState<{
    title: string
    description: string
    subject: string
    price: string
    image: File | null
    imagePreview: string | null
  }>({
    title: "",
    description: "",
    subject: SUBJECTS[1].name,
    price: "",
    image: null,
    imagePreview: null,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Listing[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const fetchListings = useCallback(async () => {
    try {
      const res = await API.get("/marketplace/listings")
      setListings(res.data)
    } catch (err) {
      console.error("Грешка при преземање на огласите:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }

    setIsSearching(true)
    try {
      const res = await API.get(
        `/marketplace/listings/search?q=${encodeURIComponent(searchQuery.trim())}`
      )
      setSearchResults(res.data)
    } catch (err) {
      console.error("Грешка при пребарување на огласите:", err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults(null)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (newListing.imagePreview) {
        URL.revokeObjectURL(newListing.imagePreview)
      }
      setNewListing((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleRemoveImage = () => {
    if (newListing.imagePreview) {
      URL.revokeObjectURL(newListing.imagePreview)
    }
    setNewListing((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }))
  }

  const handleMarkAsSold = async (listingId: number) => {
    try {
      await API.put(`/marketplace/listings/${listingId}/status`, {
        status: "sold",
      })

      const updateStatus = (list: Listing[]) =>
        list.map((l) => (l.id === listingId ? { ...l, status: "sold" as const } : l))

      setListings((prev) => updateStatus(prev))
      if (searchResults) {
        setSearchResults((prev) => (prev ? updateStatus(prev) : null))
      }
    } catch (err) {
      console.error("Грешка при означување како продадено:", err)
    }
  }

  const handleDelete = async (listingId: number) => {
    try {
      await API.delete(`/marketplace/listings/${listingId}`)

      setListings((prev) => prev.filter((l) => l.id !== listingId))
      if (searchResults) {
        setSearchResults((prev) => (prev ? prev.filter((l) => l.id !== listingId) : null))
      }
    } catch (err) {
      console.error("Грешка при бришење на огласот:", err)
    }
  }

  const handleSubmitListing = async () => {
    if (!newListing.title.trim() || !newListing.description.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", newListing.title.trim())
      formData.append("description", newListing.description.trim())
      formData.append("subject", newListing.subject)
      formData.append("price", newListing.price ? newListing.price : "0")

      if (newListing.image) {
        formData.append("image", newListing.image)
      }

      await API.post("/marketplace/listings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      await fetchListings()

      handleRemoveImage()
      setNewListing({
        title: "",
        description: "",
        subject: SUBJECTS[1].name,
        price: "",
        image: null,
        imagePreview: null,
      })

      setShowPostModal(false)
    } catch (err) {
      console.error("Грешка при креирање оглас:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredListings = (searchResults ?? listings).filter((listing) => {
    if (selectedSubject === "Сите") return true
    return listing.subject === selectedSubject
  })

  if (loading) {
    return (
      <StudyHubLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="ml-2 text-slate-500">Се вчитава...</span>
        </div>
      </StudyHubLayout>
    )
  }

  return (
    <StudyHubLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                Маркет
              </span>
            </h1>
            <p className="mt-1 text-slate-600">
              Купи, продади или подари учебници и материјали за учење
            </p>
          </div>

          <Button
            onClick={() => setShowPostModal(true)}
            className="gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Објави оглас
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (!e.target.value.trim()) {
                  setSearchResults(null)
                }
              }}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") handleSearch()
              }}
              placeholder="Пребарувај огласи (пр. лаптоп, математика)..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />

            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="rounded-xl border border-cyan-200 bg-cyan-50 px-5 text-sm font-semibold text-cyan-700 shadow-sm transition-all hover:bg-cyan-100 disabled:opacity-50 shrink-0"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Пребарај"}
          </Button>
        </div>

        {/* Subject filters */}
        <div className="mb-7 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {SUBJECTS.map((subject) => (
              <button
                key={subject.name}
                onClick={() => setSelectedSubject(subject.name)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${selectedSubject === subject.name
                  ? subject.activeColor
                  : `${subject.color} hover:brightness-95`
                  }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {filteredListings.map((listing) => {
            const subjectColors = getSubjectColors(listing.subject)
            const isSold = listing.status === "sold"
            const isOwn = user?.id === listing.user_id

            return (
              <div
                key={listing.id}
                className={`relative flex flex-col sm:flex-row overflow-hidden rounded-r-3xl border border-slate-100 border-l-4 ${subjectColors.cardAccent} bg-white shadow-sm transition-all duration-300 ${isSold ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"
                  }`}
              >
                {/* Sold overlay */}
                {isSold && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                    <div className="rotate-[-15deg] rounded-xl border-4 border-pink-500 bg-white/95 px-6 py-2 shadow-lg">
                      <span className="text-2xl font-black tracking-wider text-pink-500">
                        ПРОДАДЕНО
                      </span>
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="sm:w-48 h-48 sm:h-auto shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden border-b sm:border-b-0 sm:border-r border-slate-100 relative">
                  {listing.image_url ? (
                    <Image
                      src={`${API_BASE_URL}${listing.image_url}`}
                      alt={listing.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300 p-4">
                      <ImageIcon className="h-10 w-10 mb-1" />
                      <span className="text-xs">Нема слика</span>
                    </div>
                  )}
                </div>

                {/* Card content */}
                <div className={`flex-1 p-5 flex flex-col justify-between ${isSold ? "pointer-events-none" : ""}`}>
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-2 flex-wrap">
                      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${subjectColors.color}`}>
                        {listing.subject}
                      </span>

                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${Number(listing.price) === 0
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-orange-100 text-orange-700"
                          }`}
                      >
                        <Tag className="h-3 w-3" />
                        {Number(listing.price) === 0
                          ? "Бесплатно"
                          : `${Number(listing.price).toFixed(0)} ден`}
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-1 text-lg font-bold text-slate-800">
                      {listing.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                      {listing.description}
                    </p>
                  </div>

                  <div>
                    {/* User information */}
                    <div className="mb-3 rounded-xl bg-slate-50 p-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-700">
                          {listing.name} {listing.surname}
                        </p>

                        <a
                          href={`mailto:${listing.email}`}
                          className="mt-0.5 flex items-center gap-1 text-xs text-cyan-600 transition-colors hover:text-cyan-700 pointer-events-auto"
                        >
                          <Mail className="h-3 w-3" />
                          {listing.email}
                        </a>
                      </div>

                      <p className="text-[10px] text-slate-400">
                        {new Date(listing.created_at).toLocaleDateString("mk-MK")}
                      </p>
                    </div>

                    {/* Owner actions */}
                    {isOwn && !isSold && (
                      <div className="flex gap-2 border-t border-slate-100 pt-3 pointer-events-auto">
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsSold(listing.id)}
                          className="flex-1 gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Означи продадено
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(listing.id)}
                          className="gap-1.5 rounded-xl border-pink-200 text-xs font-semibold text-pink-600 transition-all hover:bg-pink-50 hover:text-pink-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Избриши
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {filteredListings.length === 0 && !loading && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Tag className="h-8 w-8 text-emerald-500" />
            </div>

            <h3 className="text-lg font-semibold text-slate-800">
              Сè уште нема огласи
            </h3>

            <p className="mt-1 text-slate-600">
              {selectedSubject === "Сите"
                ? "Биди прв што ќе објави оглас!"
                : `Биди прв што ќе објави оглас за ${selectedSubject}!`}
            </p>
          </div>
        )}
      </div>

      {/* Post listing modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 pt-20 pb-8 backdrop-blur-sm">
          <div className="flex min-h-full items-start justify-center">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              {/* Modal header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                    Објави оглас
                  </span>
                </h2>

                <button
                  onClick={() => setShowPostModal(false)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Наслов
                  </label>
                  <input
                    type="text"
                    value={newListing.title}
                    onChange={(e) =>
                      setNewListing((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="пр. Записи и материјали по Математика 1"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Опис
                  </label>
                  <textarea
                    value={newListing.description}
                    onChange={(e) =>
                      setNewListing((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Опиши што продаваш или подаруваш..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Предмет
                  </label>
                  <select
                    value={newListing.subject}
                    onChange={(e) =>
                      setNewListing((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    {SUBJECTS.filter((s) => s.name !== "Сите").map((subject) => (
                      <option key={subject.name} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Цена{" "}
                    <span className="font-normal text-slate-400">
                      (остави празно или 0 за бесплатно)
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newListing.price}
                    onChange={(e) =>
                      setNewListing((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Слика (опционално)
                  </label>

                  {newListing.imagePreview ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-xl border border-slate-200">
                      <img
                        src={newListing.imagePreview}
                        alt="Предпреглед"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 rounded-full bg-slate-900/70 p-1.5 text-white transition-colors hover:bg-slate-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 transition-colors hover:border-emerald-400 hover:bg-slate-50">
                      <ImageIcon className="h-6 w-6 text-emerald-500 mb-1" />
                      <span>Избери слика...</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Modal buttons */}
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 rounded-xl font-semibold text-slate-600"
                >
                  Откажи
                </Button>

                <Button
                  onClick={handleSubmitListing}
                  disabled={
                    !newListing.title.trim() ||
                    !newListing.description.trim() ||
                    isSubmitting
                  }
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Објави оглас"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudyHubLayout>
  )
}