"use client"

import { useState, useEffect } from "react"
import { StudyHubLayout } from "@/components/studyhub-layout"
import { Button } from "@/components/ui/button"
import { Plus, X, Mail, Trash2, CheckCircle, Tag } from "lucide-react"
import API from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

const subjects = [
  { name: "All", color: "bg-slate-100 text-slate-700 border-slate-200", activeColor: "bg-slate-700 text-white border-slate-700", cardAccent: "border-l-slate-400" },
  { name: "Mathematics", color: "bg-cyan-50 text-cyan-700 border-cyan-200", activeColor: "bg-cyan-500 text-white border-cyan-500", cardAccent: "border-l-cyan-400" },
  { name: "Programming", color: "bg-emerald-50 text-emerald-700 border-emerald-200", activeColor: "bg-emerald-500 text-white border-emerald-500", cardAccent: "border-l-emerald-400" },
  { name: "Physics", color: "bg-violet-50 text-violet-700 border-violet-200", activeColor: "bg-violet-500 text-white border-violet-500", cardAccent: "border-l-violet-400" },
  { name: "Chemistry", color: "bg-pink-50 text-pink-700 border-pink-200", activeColor: "bg-pink-500 text-white border-pink-500", cardAccent: "border-l-pink-400" },
  { name: "Biology", color: "bg-orange-50 text-orange-700 border-orange-200", activeColor: "bg-orange-500 text-white border-orange-500", cardAccent: "border-l-orange-400" },
  { name: "Literature", color: "bg-cyan-50 text-cyan-700 border-cyan-200", activeColor: "bg-cyan-500 text-white border-cyan-500", cardAccent: "border-l-cyan-400" },
  { name: "History", color: "bg-emerald-50 text-emerald-700 border-emerald-200", activeColor: "bg-emerald-500 text-white border-emerald-500", cardAccent: "border-l-emerald-400" },
  { name: "Economics", color: "bg-violet-50 text-violet-700 border-violet-200", activeColor: "bg-violet-500 text-white border-violet-500", cardAccent: "border-l-violet-400" },
]

const getSubjectColors = (subjectName: string) => {
  const subject = subjects.find(s => s.name === subjectName)
  return subject || subjects[0]
}

interface Listing {
  id: number
  user_id: number
  title: string
  description: string
  subject: string
  price: number
  status: "available" | "sold"
  name: string
  surname: string
  email: string
  created_at: string
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [showPostModal, setShowPostModal] = useState(false)
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    subject: "Mathematics",
    price: ""
  })
  const { user } = useAuth()

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await API.get('/marketplace/listings')
      setListings(res.data)
    } catch (err) {
      console.error('Error fetching listings:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = selectedSubject === "All"
    ? listings
    : listings.filter(listing => listing.subject === selectedSubject)

  const handleMarkAsSold = async (listingId: number) => {
    try {
      await API.put(`/marketplace/listings/${listingId}/status`, { status: "sold" })
      fetchListings()
    } catch (err) {
      console.error('Error marking as sold:', err)
    }
  }

  const handleDelete = async (listingId: number) => {
    try {
      await API.delete(`/marketplace/listings/${listingId}`)
      fetchListings()
    } catch (err) {
      console.error('Error deleting listing:', err)
    }
  }

  const handleSubmitListing = async () => {
    if (!newListing.title.trim() || !newListing.description.trim()) return
    try {
      await API.post('/marketplace/listings', {
        title: newListing.title,
        description: newListing.description,
        subject: newListing.subject,
        price: newListing.price ? parseFloat(newListing.price) : 0
      })
      fetchListings()
      setNewListing({ title: "", description: "", subject: "Mathematics", price: "" })
      setShowPostModal(false)
    } catch (err) {
      console.error('Error creating listing:', err)
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
      <div className="py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="mt-1 text-slate-600">Buy, sell, or give away textbooks and study materials</p>
          </div>
          <Button
            onClick={() => setShowPostModal(true)}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Post a Listing
          </Button>
        </div>

        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {subjects.map((subject) => (
              <button
                key={subject.name}
                onClick={() => setSelectedSubject(subject.name)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedSubject === subject.name
                    ? subject.activeColor
                    : subject.color + " hover:brightness-95"
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => {
            const subjectColors = getSubjectColors(listing.subject)
            const isSold = listing.status === "sold"
            const isOwn = user?.id === listing.user_id

            return (
              <div
                key={listing.id}
                className={`relative overflow-hidden rounded-2xl border-l-4 ${subjectColors.cardAccent} bg-white shadow-sm transition-all duration-300 ${
                  isSold ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                {isSold && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="rotate-[-15deg] rounded-lg border-4 border-pink-500 bg-white/90 px-6 py-2 shadow-lg">
                      <span className="text-2xl font-black tracking-wider text-pink-500">SOLD</span>
                    </div>
                  </div>
                )}

                <div className={`p-5 ${isSold ? "pointer-events-none" : ""}`}>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${subjectColors.color}`}>
                      {listing.subject}
                    </span>
                    <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${
                      listing.price === 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      <Tag className="h-3 w-3" />
                      {Number(listing.price) === 0 ? "Free" : `${Number(listing.price).toFixed(0)} ден`}
                    </span>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-lg font-bold text-slate-800">{listing.title}</h3>
                  <p className="mb-4 line-clamp-2 text-sm text-slate-600">{listing.description}</p>

                  <div className="mb-3 rounded-lg bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-700">{listing.name} {listing.surname}</p>
                    <a
                      href={`mailto:${listing.email}`}
                      className="mt-1 flex items-center gap-1.5 text-xs text-cyan-600 transition-colors hover:text-cyan-700"
                    >
                      <Mail className="h-3 w-3" />
                      {listing.email}
                    </a>
                  </div>

                  <p className="text-xs text-slate-400">
                    Posted {new Date(listing.created_at).toLocaleDateString()}
                  </p>

                  {isOwn && !isSold && (
                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsSold(listing.id)}
                        className="flex-1 gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Mark as Sold
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(listing.id)}
                        className="gap-1.5 border-pink-200 text-xs font-semibold text-pink-600 transition-all hover:bg-pink-50 hover:text-pink-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredListings.length === 0 && !loading && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Tag className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No listings yet</h3>
            <p className="mt-1 text-slate-600">Be the first to post a listing in {selectedSubject}!</p>
          </div>
        )}
      </div>

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Post a Listing
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
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Title</label>
                <input
                  type="text"
                  value={newListing.title}
                  onChange={(e) => setNewListing(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Calculus Textbook 8th Edition"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={newListing.description}
                  onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the condition, what's included, etc."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
                <select
                  value={newListing.subject}
                  onChange={(e) => setNewListing(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {subjects.filter(s => s.name !== "All").map((subject) => (
                    <option key={subject.name} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Price <span className="font-normal text-slate-400">(leave empty or 0 for free)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newListing.price}
                  onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPostModal(false)}
                className="flex-1 font-semibold text-slate-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitListing}
                disabled={!newListing.title.trim() || !newListing.description.trim()}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-50"
              >
                Post Listing
              </Button>
            </div>
          </div>
        </div>
      )}
    </StudyHubLayout>
  )
}