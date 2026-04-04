"use client"

import { useState } from "react"
import { StudyHubLayout } from "@/components/studyhub-layout"
import {
  MapPin,
  Calendar,
  Users,
  Plus,
  Clock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Subject colors mapping
const subjectColors: Record<string, { bg: string; text: string; border: string; activeBg: string }> = {
  Mathematics: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-300", activeBg: "bg-orange-400" },
  Programming: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-300", activeBg: "bg-violet-400" },
  Physics: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-300", activeBg: "bg-cyan-400" },
  Chemistry: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-300", activeBg: "bg-pink-400" },
  Biology: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-300", activeBg: "bg-emerald-400" },
  Literature: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-300", activeBg: "bg-orange-400" },
  History: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-300", activeBg: "bg-violet-400" },
  Economics: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-300", activeBg: "bg-cyan-400" },
}

const subjects = ["All", "Mathematics", "Programming", "Physics", "Chemistry", "Biology", "Literature", "History", "Economics"]

// Mock data for events
const mockEvents = [
  {
    id: 1,
    userId: 1,
    title: "Calculus Study Group",
    description: "Let's work through integration techniques and practice problems together.",
    subject: "Mathematics",
    location: "Library Room 204",
    eventTime: "2026-04-02T14:00:00",
    participants: 8,
    isJoined: false,
  },
  {
    id: 2,
    userId: 2,
    title: "Python Workshop",
    description: "Beginner-friendly session covering data structures and algorithms in Python.",
    subject: "Programming",
    location: "Computer Lab B",
    eventTime: "2026-04-03T10:00:00",
    participants: 15,
    isJoined: true,
  },
  {
    id: 3,
    userId: 1, // Current user's event
    title: "Quantum Mechanics Discussion",
    description: "Deep dive into wave functions and Schrödinger equation. Bring your questions!",
    subject: "Physics",
    location: "Physics Building 101",
    eventTime: "2026-04-04T16:00:00",
    participants: 6,
    isJoined: true,
  },
  {
    id: 4,
    userId: 3,
    title: "Organic Chemistry Review",
    description: "Preparing for midterms - focus on reaction mechanisms and nomenclature.",
    subject: "Chemistry",
    location: "Science Center 302",
    eventTime: "2026-04-05T13:00:00",
    participants: 12,
    isJoined: false,
  },
  {
    id: 5,
    userId: 4,
    title: "Biology Lab Prep",
    description: "Pre-lab discussion for the upcoming genetics experiment.",
    subject: "Biology",
    location: "Bio Lab 105",
    eventTime: "2026-04-06T09:00:00",
    participants: 10,
    isJoined: false,
  },
  {
    id: 6,
    userId: 5,
    title: "Shakespeare Reading Circle",
    description: "Analyzing Hamlet together - Act 3 this week.",
    subject: "Literature",
    location: "Humanities Hall 210",
    eventTime: "2026-04-07T15:00:00",
    participants: 7,
    isJoined: true,
  },
]

// Mock current user ID
const currentUserId = 1

export default function EventsPage() {
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [events, setEvents] = useState(mockEvents)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    subject: "",
    location: "",
    date: "",
    time: "",
  })

  const filteredEvents = selectedSubject === "All"
    ? events
    : events.filter(event => event.subject === selectedSubject)

  const handleJoinLeave = (eventId: number) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          isJoined: !event.isJoined,
          participants: event.isJoined ? event.participants - 1 : event.participants + 1,
        }
      }
      return event
    }))
  }

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.subject || !newEvent.location || !newEvent.date || !newEvent.time) {
      return
    }

    const newEventData = {
      id: events.length + 1,
      userId: currentUserId,
      title: newEvent.title,
      description: newEvent.description,
      subject: newEvent.subject,
      location: newEvent.location,
      eventTime: `${newEvent.date}T${newEvent.time}:00`,
      participants: 1,
      isJoined: true,
    }

    setEvents([newEventData, ...events])
    setNewEvent({ title: "", description: "", subject: "", location: "", date: "", time: "" })
    setIsCreateDialogOpen(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  }

  return (
    <StudyHubLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Events
            </h1>
            <p className="text-slate-600 mt-1">Join or create study sessions</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold rounded-lg shadow-md hover:brightness-110 transition-all">
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" style={{ backgroundColor: '#FFFAF7' }}>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Create New Event
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Set up a study session for others to join.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <Input
                    placeholder="Event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="border-slate-200 focus:border-orange-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    placeholder="What will you study?"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 resize-none"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subject</label>
                  <Select value={newEvent.subject} onValueChange={(value) => setNewEvent({ ...newEvent, subject: value })}>
                    <SelectTrigger className="w-full border-slate-200">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.filter(s => s !== "All").map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Location</label>
                  <Input
                    placeholder="Where will you meet?"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="border-slate-200 focus:border-orange-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Date</label>
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="border-slate-200 focus:border-orange-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Time</label>
                    <Input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="border-slate-200 focus:border-orange-300"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <button
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title || !newEvent.subject || !newEvent.location || !newEvent.date || !newEvent.time}
                  className={`w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-md transition-all ${
                    !newEvent.title || !newEvent.subject || !newEvent.location || !newEvent.date || !newEvent.time
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:brightness-110"
                  }`}
                >
                  Create Event
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Subject Filter */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {subjects.map((subject) => {
              const isSelected = selectedSubject === subject
              const colors = subject === "All" 
                ? { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-300", activeBg: "bg-slate-500" }
                : subjectColors[subject] || { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-300", activeBg: "bg-slate-500" }
              
              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    isSelected
                      ? `${colors.activeBg} text-white border-transparent shadow-md`
                      : `${colors.bg} ${colors.text} ${colors.border} hover:shadow-sm`
                  }`}
                >
                  {subject}
                </button>
              )
            })}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const colors = subjectColors[event.subject] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" }
            const isOwner = event.userId === currentUserId

            return (
              <div
                key={event.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 flex flex-col"
              >
                {/* Header with subject tag and owner badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                    {event.subject}
                  </span>
                  {isOwner && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 border border-orange-200">
                      yours
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
                  {event.description}
                </p>

                {/* Event details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-cyan-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-violet-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.eventTime)}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{formatTime(event.eventTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <Users className="w-4 h-4" />
                    <span>{event.participants} participants</span>
                  </div>
                </div>

                {/* Join/Leave Button */}
                {!isOwner && (
                  <button
                    onClick={() => handleJoinLeave(event.id)}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
                      event.isJoined
                        ? "border-2 border-pink-400 text-pink-500 hover:bg-pink-50"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:brightness-110"
                    }`}
                  >
                    {event.isJoined ? "Leave" : "Join"}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No events found</h3>
            <p className="text-slate-500">Be the first to create an event for {selectedSubject}!</p>
          </div>
        )}
      </div>
    </StudyHubLayout>
  )
}
