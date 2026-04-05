"use client"

import { useState, useEffect } from "react"
import { StudyHubLayout } from "@/components/studyhub-layout"
import { MapPin, Calendar, Users, Plus, Clock, X } from "lucide-react"
import API from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

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

interface Event {
  id: number
  user_id: number
  title: string
  description: string
  subject: string
  location: string
  event_time: string
  created_at: string
  name: string
  surname: string
  participants_count: string
}

export default function EventsPage() {
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [joinedEvents, setJoinedEvents] = useState<number[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    subject: "",
    location: "",
    date: "",
    time: "",
  })
  const { user } = useAuth()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events')
      setEvents(res.data)
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = selectedSubject === "All"
    ? events
    : events.filter(event => event.subject === selectedSubject)

  const handleJoin = async (eventId: number) => {
    try {
      await API.post(`/events/${eventId}/join`)
      setJoinedEvents(prev => [...prev, eventId])
      fetchEvents()
    } catch (err) {
      console.error('Error joining event:', err)
    }
  }

  const handleLeave = async (eventId: number) => {
    try {
      await API.delete(`/events/${eventId}/leave`)
      setJoinedEvents(prev => prev.filter(id => id !== eventId))
      fetchEvents()
    } catch (err) {
      console.error('Error leaving event:', err)
    }
  }

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.subject || !newEvent.location || !newEvent.date || !newEvent.time) return
    try {
      await API.post('/events', {
        title: newEvent.title,
        description: newEvent.description,
        subject: newEvent.subject,
        location: newEvent.location,
        event_time: `${newEvent.date}T${newEvent.time}:00`
      })
      fetchEvents()
      setNewEvent({ title: "", description: "", subject: "", location: "", date: "", time: "" })
      setIsCreateDialogOpen(false)
    } catch (err) {
      console.error('Error creating event:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Events
            </h1>
            <p className="text-slate-600 mt-1">Join or create study sessions</p>
          </div>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold rounded-lg shadow-md hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const colors = subjectColors[event.subject] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" }
            const isOwner = user?.id === event.user_id
            const isJoined = joinedEvents.includes(event.id)

            return (
              <div
                key={event.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 flex flex-col"
              >
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

                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-cyan-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-violet-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.event_time)}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{formatTime(event.event_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <Users className="w-4 h-4" />
                    <span>{event.participants_count} participants</span>
                  </div>
                </div>

                {!isOwner && (
                  <button
                    onClick={() => isJoined ? handleLeave(event.id) : handleJoin(event.id)}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
                      isJoined
                        ? "border-2 border-pink-400 text-pink-500 hover:bg-pink-50"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:brightness-110"
                    }`}
                  >
                    {isJoined ? "Leave" : "Join"}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No events found</h3>
            <p className="text-slate-500">Be the first to create an event for {selectedSubject}!</p>
          </div>
        )}
      </div>

      {isCreateDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#FFFAF7] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Create New Event
              </h2>
              <button
                onClick={() => setIsCreateDialogOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Title</label>
                <input
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  placeholder="What will you study?"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
                  rows={3}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
                <select
                  value={newEvent.subject}
                  onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
                >
                  <option value="">Select subject</option>
                  {subjects.filter(s => s !== "All").map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>
                <input
                  placeholder="Where will you meet?"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
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
            </div>
          </div>
        </div>
      )}
    </StudyHubLayout>
  )
}