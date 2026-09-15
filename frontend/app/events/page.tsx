"use client"

import { useState, useEffect } from "react"
import { StudyHubLayout } from "@/components/studyhub-layout"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, Plus, Clock, X } from "lucide-react"
import API from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useRequireAuth } from '@/context/AuthContext'

const subjectColors: Record<string, { bg: string; text: string; border: string; activeBg: string }> = {
  "Математика 1": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-300", activeBg: "bg-orange-400" },
  "Програмирање и алгоритми": { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-300", activeBg: "bg-violet-400" },
  "Физика 1": { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-300", activeBg: "bg-cyan-400" },
  "Сигнали и системи": { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-300", activeBg: "bg-pink-400" },
  "Комуникациски технологии": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-300", activeBg: "bg-emerald-400" },
  "Логички дизајн": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-300", activeBg: "bg-orange-400" },
  "Мерења во електротехника": { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-300", activeBg: "bg-violet-400" },
  "Основи на WEB програмирање": { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-300", activeBg: "bg-cyan-400" },
}

const subjects = [
  "Сите",
  "Математика 1",
  "Програмирање и алгоритми",
  "Физика 1",
  "Сигнали и системи",
  "Комуникациски технологии",
  "Логички дизајн",
  "Мерења во електротехника",
  "Основи на WEB програмирање"
]

interface Participant {
  id: number
  name: string
  surname: string
}

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
  participants_list?: Participant[]
}

export default function EventsPage() {
  useRequireAuth()
  const [selectedSubject, setSelectedSubject] = useState("Сите")
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
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await API.get('/events')
      setEvents(res.data)
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = selectedSubject === "Сите"
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
    return date.toLocaleDateString("mk-MK", { weekday: "short", month: "short", day: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("mk-MK", { hour: "numeric", minute: "2-digit" })
  }

  if (loading) {
    return (
      <StudyHubLayout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 flex items-center justify-center">
          <p className="text-slate-500">Се вчитува...</p>
        </div>
      </StudyHubLayout>
    )
  }

  return (
    <StudyHubLayout>
      {/* Стандардизиран Wrapper со точни маргини и димензии */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Настани
              </span>
            </h1>
            <p className="mt-1 text-slate-600">Пронајди група за учење или креирај своја</p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Креирај настан
          </Button>
        </div>

        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {subjects.map((subject) => {
              const isSelected = selectedSubject === subject
              const colors = subject === "Сите"
                ? { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-300", activeBg: "bg-slate-500" }
                : subjectColors[subject] || { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-300", activeBg: "bg-slate-500" }

              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${isSelected
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
                className="bg-white/85 backdrop-blur-sm rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                    {event.subject}
                  </span>
                  {isOwner && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 border border-orange-200">
                      твој настан
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-cyan-600">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-violet-600">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>{formatDate(event.event_time)}</span>
                    <Clock className="w-4 h-4 ml-2 shrink-0" />
                    <span>{formatTime(event.event_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{event.participants_count} учесници</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-orange-500">
                    <span>Креирано од {event.name} {event.surname}</span>
                  </div>
                  {event.participants_list && event.participants_list.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs font-medium text-slate-500 mb-2">Учесници:</p>
                      <div className="flex flex-wrap gap-1">
                        {event.participants_list.map((p) => (
                          <span key={p.id} className="text-xs bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5">
                            {p.name} {p.surname}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!isOwner && (
                  <button
                    onClick={() => isJoined ? handleLeave(event.id) : handleJoin(event.id)}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all ${isJoined
                      ? "border-2 border-pink-400 text-pink-500 hover:bg-pink-50"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:brightness-110"
                      }`}
                  >
                    {isJoined ? "Напушти" : "Придружи се"}
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
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Нема најдени настани</h3>
            <p className="text-slate-500">Биди првиот што ќе креира настан за {selectedSubject}!</p>
          </div>
        )}
      </div>

      {isCreateDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 pt-20 pb-8 backdrop-blur-sm">
          <div className="flex min-h-full items-start justify-center">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                    Креирај нов настан
                  </span>
                </h2>
                <button
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Наслов</label>
                  <input
                    placeholder="Наслов на настанот"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Опис</label>
                  <textarea
                    placeholder="Опис на настанот"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Предмет</label>
                  <select
                    value={newEvent.subject}
                    onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">Избери предмет</option>
                    {subjects.filter(s => s !== "Сите").map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Локација</label>
                  <input
                    placeholder="Каде ќе се сретнете?"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Датум</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Време</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Откажи
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={!newEvent.title || !newEvent.subject || !newEvent.location || !newEvent.date || !newEvent.time}
                  className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Креирај настан
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudyHubLayout>
  )
}