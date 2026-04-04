"use client"

import { useState } from "react"
import { StudyHubLayout } from "@/components/studyhub-layout"
import { Button } from "@/components/ui/button"
import { Plus, X, Mail, Trash2, CheckCircle, Tag } from "lucide-react"

// Subject tags with colors - matching forum
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

// Get subject color classes
const getSubjectColors = (subjectName: string) => {
  const subject = subjects.find(s => s.name === subjectName)
  return subject || subjects[0]
}

// Mock current user
const currentUser = {
  name: "Alex",
  surname: "Student",
  email: "alex.student@university.edu"
}

// Mock data for listings
const initialListings = [
  {
    id: 1,
    title: "Calculus: Early Transcendentals (8th Edition)",
    description: "Stewart's calculus textbook in excellent condition. Minor highlighting in first few chapters. Perfect for Calc I, II, and III courses.",
    subject: "Mathematics",
    price: 45,
    status: "available" as const,
    sellerName: "Sarah",
    sellerSurname: "Chen",
    sellerEmail: "sarah.chen@university.edu",
    datePosted: "2 days ago",
  },
  {
    id: 2,
    title: "Introduction to Algorithms (CLRS)",
    description: "The classic algorithms textbook. Hardcover, no markings or damage. Includes all original problem sets.",
    subject: "Programming",
    price: 0,
    status: "available" as const,
    sellerName: "Mike",
    sellerSurname: "Johnson",
    sellerEmail: "mike.j@university.edu",
    datePosted: "3 days ago",
  },
  {
    id: 3,
    title: "University Physics with Modern Physics",
    description: "Young & Freedman 15th edition. Some wear on cover but pages are clean. Comes with unused access code.",
    subject: "Physics",
    price: 60,
    status: "sold" as const,
    sellerName: "David",
    sellerSurname: "Park",
    sellerEmail: "d.park@university.edu",
    datePosted: "1 week ago",
  },
  {
    id: 4,
    title: "Organic Chemistry Notes Bundle",
    description: "Complete handwritten notes from CHEM 201-202. Includes reaction mechanisms, practice problems, and exam prep materials.",
    subject: "Chemistry",
    price: 15,
    status: "available" as const,
    sellerName: "Lisa",
    sellerSurname: "Wang",
    sellerEmail: "lisa.wang@university.edu",
    datePosted: "5 days ago",
  },
  {
    id: 5,
    title: "Campbell Biology (12th Edition)",
    description: "Like new condition. Used for one semester only. Includes all diagrams and study guide.",
    subject: "Biology",
    price: 55,
    status: "available" as const,
    sellerName: "James",
    sellerSurname: "Wilson",
    sellerEmail: "j.wilson@university.edu",
    datePosted: "1 day ago",
  },
  {
    id: 6,
    title: "Data Structures Practice Problems",
    description: "Collection of 200+ coding problems with solutions. Great for interview prep and course review.",
    subject: "Programming",
    price: 0,
    status: "available" as const,
    sellerName: "Alex",
    sellerSurname: "Student",
    sellerEmail: "alex.student@university.edu",
    datePosted: "4 days ago",
  },
  {
    id: 7,
    title: "Linear Algebra Done Right",
    description: "Axler's famous textbook. Third edition, paperback. Some pencil notes that can be erased.",
    subject: "Mathematics",
    price: 25,
    status: "sold" as const,
    sellerName: "Emma",
    sellerSurname: "Davis",
    sellerEmail: "emma.d@university.edu",
    datePosted: "2 weeks ago",
  },
  {
    id: 8,
    title: "Quantum Mechanics Lecture Notes",
    description: "Comprehensive notes from Prof. Thompson's PHYS 301. Includes worked examples and formula sheets.",
    subject: "Physics",
    price: 10,
    status: "available" as const,
    sellerName: "Alex",
    sellerSurname: "Student",
    sellerEmail: "alex.student@university.edu",
    datePosted: "6 days ago",
  },
]

interface Listing {
  id: number
  title: string
  description: string
  subject: string
  price: number
  status: "available" | "sold"
  sellerName: string
  sellerSurname: string
  sellerEmail: string
  datePosted: string
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [showPostModal, setShowPostModal] = useState(false)
  const [newListing, setNewListing] = useState({ 
    title: "", 
    description: "", 
    subject: "Mathematics",
    price: ""
  })

  const filteredListings = selectedSubject === "All" 
    ? listings 
    : listings.filter(listing => listing.subject === selectedSubject)

  const isOwnListing = (listing: Listing) => {
    return listing.sellerEmail === currentUser.email
  }

  const handleMarkAsSold = (listingId: number) => {
    setListings(listings.map(listing => {
      if (listing.id === listingId) {
        return { ...listing, status: "sold" as const }
      }
      return listing
    }))
  }

  const handleDelete = (listingId: number) => {
    setListings(listings.filter(listing => listing.id !== listingId))
  }

  const handleSubmitListing = () => {
    if (!newListing.title.trim() || !newListing.description.trim()) return
    
    const listing: Listing = {
      id: listings.length + 1,
      title: newListing.title,
      description: newListing.description,
      subject: newListing.subject,
      price: newListing.price ? parseFloat(newListing.price) : 0,
      status: "available",
      sellerName: currentUser.name,
      sellerSurname: currentUser.surname,
      sellerEmail: currentUser.email,
      datePosted: "Just now",
    }
    
    setListings([listing, ...listings])
    setNewListing({ title: "", description: "", subject: "Mathematics", price: "" })
    setShowPostModal(false)
  }

  return (
    <StudyHubLayout>
      <div className="py-8">
        {/* Header */}
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

        {/* Subject Filter Bar */}
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

        {/* Listings Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => {
            const subjectColors = getSubjectColors(listing.subject)
            const isSold = listing.status === "sold"
            const isOwn = isOwnListing(listing)
            
            return (
              <div
                key={listing.id}
                className={`relative overflow-hidden rounded-2xl border-l-4 ${subjectColors.cardAccent} bg-white shadow-sm transition-all duration-300 ${
                  isSold 
                    ? "opacity-60" 
                    : "hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                {/* Sold Badge */}
                {isSold && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="rotate-[-15deg] rounded-lg border-4 border-pink-500 bg-white/90 px-6 py-2 shadow-lg">
                      <span className="text-2xl font-black tracking-wider text-pink-500">SOLD</span>
                    </div>
                  </div>
                )}
                
                <div className={`p-5 ${isSold ? "pointer-events-none" : ""}`}>
                  {/* Subject Tag & Price */}
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
                      {listing.price === 0 ? "Free" : `$${listing.price}`}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="mb-2 line-clamp-2 text-lg font-bold text-slate-800">
                    {listing.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                    {listing.description}
                  </p>
                  
                  {/* Seller Info */}
                  <div className="mb-3 rounded-lg bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-700">
                      {listing.sellerName} {listing.sellerSurname}
                    </p>
                    <a 
                      href={`mailto:${listing.sellerEmail}`}
                      className="mt-1 flex items-center gap-1.5 text-xs text-cyan-600 transition-colors hover:text-cyan-700"
                    >
                      <Mail className="h-3 w-3" />
                      {listing.sellerEmail}
                    </a>
                  </div>
                  
                  {/* Date */}
                  <p className="text-xs text-slate-400">
                    Posted {listing.datePosted}
                  </p>
                  
                  {/* Owner Actions */}
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

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Tag className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No listings yet</h3>
            <p className="mt-1 text-slate-600">Be the first to post a listing in {selectedSubject}!</p>
          </div>
        )}
      </div>

      {/* Post Listing Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg animate-in fade-in zoom-in-95 rounded-2xl bg-white p-6 shadow-2xl duration-200">
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
              {/* Title */}
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
              
              {/* Description */}
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
              
              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
                <select
                  value={newListing.subject}
                  onChange={(e) => setNewListing(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {subjects.filter(s => s.name !== "All").map((subject) => (
                    <option key={subject.name} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Price <span className="font-normal text-slate-400">(leave empty or 0 for free)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newListing.price}
                    onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-8 pr-4 text-slate-700 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>
            
            {/* Modal Actions */}
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
