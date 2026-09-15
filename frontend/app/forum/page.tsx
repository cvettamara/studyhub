"use client"

import { useState, useEffect } from "react"
import { StudyHubLayout } from "@/components/studyhub-layout"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Plus, X, ChevronDown, ChevronUp, Send, Trash2, Sparkles, Search } from "lucide-react"
import API from "@/lib/api"
import { useAuth, useRequireAuth } from "@/context/AuthContext"

const subjects = [
  { name: "Сите", color: "bg-slate-100 text-slate-700 border-slate-200", activeColor: "bg-slate-800 text-white border-slate-800" },
  { name: "Математика 1", color: "bg-cyan-50 text-cyan-700 border-cyan-200", activeColor: "bg-cyan-600 text-white border-cyan-600" },
  { name: "Програмирање и алгоритми", color: "bg-emerald-50 text-emerald-700 border-emerald-200", activeColor: "bg-emerald-600 text-white border-emerald-600" },
  { name: "Физика 1", color: "bg-violet-50 text-violet-700 border-violet-200", activeColor: "bg-violet-600 text-white border-violet-600" },
  { name: "Сигнали и системи", color: "bg-pink-50 text-pink-700 border-pink-200", activeColor: "bg-pink-600 text-white border-pink-600" },
  { name: "Комуникациски технологии", color: "bg-amber-50 text-amber-700 border-amber-200", activeColor: "bg-amber-600 text-white border-amber-600" },
  { name: "Логички дизајн", color: "bg-sky-50 text-sky-700 border-sky-200", activeColor: "bg-sky-600 text-white border-sky-600" },
  { name: "Мерења во електротехника", color: "bg-teal-50 text-teal-700 border-teal-200", activeColor: "bg-teal-600 text-white border-teal-600" },
  { name: "Основи на WEB програмирање", color: "bg-purple-50 text-purple-700 border-purple-200", activeColor: "bg-purple-600 text-white border-purple-600" },
]

const getSubjectColors = (subjectName: string) => {
  const subject = subjects.find(s => s.name === subjectName)
  return subject || { color: "bg-slate-100 text-slate-700 border-slate-200", activeColor: "" }
}

interface Answer {
  id: number
  user_id: number
  content: string
  created_at: string
  name: string
  surname: string
}

interface Post {
  id: number
  _id?: string
  user_id: number
  title: string
  content: string
  subject: string
  created_at: string
  name: string
  surname: string
  likes_count: number | string
  liked_by_me?: boolean
  answers?: Answer[]
}

export default function ForumPage() {
  useRequireAuth()
  const { user } = useAuth()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState("Сите")
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [showAskModal, setShowAskModal] = useState(false)
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "", subject: subjects[1].name })
  const [newAnswers, setNewAnswers] = useState<Record<number, string>>({})
  const [likeAnimations, setLikeAnimations] = useState<Record<number, boolean>>({})
  const [submittingAnswer, setSubmittingAnswer] = useState<number | null>(null)
  const [submittingQuestion, setSubmittingQuestion] = useState(false)

  const [aiSuggestions, setAiSuggestions] = useState<Record<number, string>>({})
  const [loadingAi, setLoadingAi] = useState<Record<number, boolean>>({})

  const [aiPreview, setAiPreview] = useState<string | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Post[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      try {
        const res = await API.get<Post[]>('/forum/posts')
        if (isMounted) {
          setPosts(res.data)
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchPosts()
    return () => { isMounted = false }
  }, [])

  const filteredPosts = searchResults !== null
    ? searchResults
    : selectedSubject === "Сите"
      ? posts
      : posts.filter(post => post.subject === selectedSubject)

  const handleSearch = async () => {
    const query = searchQuery.trim()
    if (!query) {
      setSearchResults(null)
      return
    }

    setIsSearching(true)
    try {
      const res = await API.get(`/forum/posts/search?q=${encodeURIComponent(query)}`)
      
      const enrichedResults = res.data.map((searchPost: Post) => {
        const existingPost = posts.find(p => p.id === searchPost.id)
        return existingPost ? { ...searchPost, ...existingPost } : searchPost
      })

      setSearchResults(enrichedResults)
    } catch (err) {
      console.error('Error searching posts:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleLike = async (postId: number) => {
    setLikeAnimations(prev => ({ ...prev, [postId]: true }))
    setTimeout(() => {
      setLikeAnimations(prev => ({ ...prev, [postId]: false }))
    }, 300)

    const targetPost = posts.find(p => p.id === postId) || searchResults?.find(p => p.id === postId)
    if (!targetPost) return

    const isCurrentlyLiked = targetPost.liked_by_me

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const currentCount = typeof p.likes_count === 'string' ? parseInt(p.likes_count, 10) : p.likes_count
        return {
          ...p,
          liked_by_me: !isCurrentlyLiked,
          likes_count: isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1
        }
      }
      return p
    }))

    if (searchResults !== null) {
      setSearchResults(prev => prev ? prev.map(p => {
        if (p.id === postId) {
          const currentCount = typeof p.likes_count === 'string' ? parseInt(p.likes_count, 10) : p.likes_count
          return {
            ...p,
            liked_by_me: !isCurrentlyLiked,
            likes_count: isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1
          }
        }
        return p
      }) : null)
    }

    try {
      if (isCurrentlyLiked) {
        await API.delete(`/forum/posts/${postId}/like`)
      } else {
        await API.post(`/forum/posts/${postId}/like`)
      }
    } catch (err) {
      console.error('Error toggling like:', err)
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const currentCount = typeof p.likes_count === 'string' ? parseInt(p.likes_count, 10) : p.likes_count
          return {
            ...p,
            liked_by_me: isCurrentlyLiked,
            likes_count: isCurrentlyLiked ? currentCount + 1 : Math.max(0, currentCount - 1)
          }
        }
        return p
      }))
    }
  }

  const handleDeletePost = async (postId: number) => {
    const originalPosts = [...posts]
    const originalSearchResults = searchResults ? [...searchResults] : null

    setPosts(prev => prev.filter(p => p.id !== postId))
    if (searchResults !== null) {
      setSearchResults(prev => prev ? prev.filter(p => p.id !== postId) : null)
    }
    if (expandedPost === postId) {
      setExpandedPost(null)
    }

    try {
      await API.delete(`/forum/posts/${postId}`)
    } catch (err) {
      console.error('Error deleting post:', err)
      setPosts(originalPosts)
      setSearchResults(originalSearchResults)
    }
  }

  const handleSubmitAnswer = async (postId: number) => {
    const answerContent = newAnswers[postId]
    if (!answerContent?.trim()) return

    setSubmittingAnswer(postId)
    try {
      const res = await API.post<Answer>(`/forum/posts/${postId}/answers`, {
        content: answerContent
      })

      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            answers: [...(p.answers || []), res.data]
          }
        }
        return p
      }))

      if (searchResults !== null) {
        setSearchResults(prev => prev ? prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              answers: [...(p.answers || []), res.data]
            }
          }
          return p
        }) : null)
      }

      setNewAnswers(prev => ({ ...prev, [postId]: "" }))
    } catch (err) {
      console.error('Error submitting answer:', err)
    } finally {
      setSubmittingAnswer(null)
    }
  }

  const handleAiSuggest = async (postId: number) => {
    setLoadingAi(prev => ({ ...prev, [postId]: true }))
    try {
      const res = await API.post(`/forum/posts/${postId}/ai-suggest`)
      setAiSuggestions(prev => ({ ...prev, [postId]: res.data.suggestion }))
    } catch (err) {
      console.error('Error getting AI suggestion:', err)
    } finally {
      setLoadingAi(prev => ({ ...prev, [postId]: false }))
    }
  }

  const handleAiPreview = async () => {
    setLoadingPreview(true)
    try {
      const res = await API.post('/forum/posts/ai-preview', {
        title: newQuestion.title,
        content: newQuestion.content
      })
      setAiPreview(res.data.suggestion)
    } catch (err) {
      console.error('Error getting AI preview:', err)
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleSubmitQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return

    setSubmittingQuestion(true)
    try {
      const res = await API.post<Post>('/forum/posts', {
        title: newQuestion.title,
        content: newQuestion.content,
        subject: newQuestion.subject
      })

      setPosts(prev => [res.data, ...prev])
      setShowAskModal(false)
      setAiPreview(null)
      setNewQuestion({ title: "", content: "", subject: subjects[1].name })
    } catch (err) {
      console.error('Error creating post:', err)
    } finally {
      setSubmittingQuestion(false)
    }
  }

  if (loading) {
    return (
      <StudyHubLayout>
        <div className="flex items-center justify-center py-32">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <span className="font-medium">Се вчитуваат прашањата...</span>
          </div>
        </div>
      </StudyHubLayout>
    )
  }

  return (
    <StudyHubLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Форум
              </span>
            </h1>
            <p className="mt-1 text-slate-600">Поставувај прашања, споделувај знаење и напредувајте заедно</p>
          </div>
          <Button
            onClick={() => { setShowAskModal(true); setAiPreview(null); }}
            className="gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 shrink-0"
          >
            <Plus className="h-5 w-5" />
            Постави прашање
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (!e.target.value.trim()) setSearchResults(null)
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Пребарувај прашања по наслов, содржина или автор..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setSearchResults(null); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="rounded-xl border border-violet-200 bg-violet-50 px-5 font-semibold text-violet-700 shadow-sm transition-all hover:bg-violet-100 disabled:opacity-50"
          >
            {isSearching ? "Пребарување..." : "Пребарај"}
          </Button>
        </div>

        {/* Subjects Horizontal Filter */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex gap-2">
            {subjects.map((subject, index) => (
              <button
                key={`subj-${subject.name}-${index}`}
                onClick={() => setSelectedSubject(subject.name)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${selectedSubject === subject.name
                  ? subject.activeColor + " shadow-sm"
                  : subject.color + " hover:shadow-sm"
                  }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post, postIndex) => {
            const subjectColors = getSubjectColors(post.subject)
            const isExpanded = expandedPost === post.id
            const isLiked = Boolean(post.liked_by_me)
            // Уникатен клуч што комбинира ID, уредување и индекс за да се избегнат дупликати како "26"
            const uniquePostKey = `post-${post.id}-${postIndex}`

            return (
              <div
                key={uniquePostKey}
                className="rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
              >
                <div
                  className="cursor-pointer p-6"
                  onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${subjectColors.color}`}>
                        {post.subject}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">{post.title}</h3>
                      <p className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{post.name} {post.surname}</span>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString("mk-MK")}</span>
                      </div>
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 flex items-center gap-3 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(post.id)
                      }}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${isLiked
                        ? "bg-pink-50 text-pink-600 border border-pink-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-pink-50 hover:text-pink-500"
                        }`}
                    >
                      <Heart
                        className={`h-4 w-4 transition-transform duration-300 ${likeAnimations[post.id] ? "scale-125" : ""
                          } ${isLiked ? "fill-pink-500 text-pink-500" : ""}`}
                      />
                      {post.likes_count}
                    </button>

                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-600">
                      <MessageCircle className="h-4 w-4" />
                      {post.answers?.length || 0} {post.answers?.length === 1 ? "одговор" : "одговори"}
                    </div>

                    {user?.id === post.user_id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePost(post.id)
                        }}
                        className="ml-auto flex items-center gap-1.5 rounded-xl border border-transparent px-3 py-1.5 text-xs font-semibold text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                        Избриши
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Answer Section */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-6 rounded-b-2xl space-y-6">

                    {/* AI Suggestion Box */}
                    {(!post.answers || post.answers.length === 0) && (
                      <div>
                        {!aiSuggestions[post.id] ? (
                          <button
                            onClick={() => handleAiSuggest(post.id)}
                            disabled={loadingAi[post.id]}
                            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-all disabled:opacity-50"
                          >
                            <Sparkles className="h-4 w-4 text-indigo-600" />
                            {loadingAi[post.id] ? "Генерирање предлог..." : "Прикажи AI предлог-одговор"}
                          </button>
                        ) : (
                          <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 p-4 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                              <Sparkles className="h-4 w-4" />
                              AI предлог (автоматски генериран):
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{aiSuggestions[post.id]}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Existing Answers */}
                    {post.answers && post.answers.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-800">
                          {post.answers.length} {post.answers.length === 1 ? "Одговор" : "Одговори"}
                        </h4>
                        <div className="space-y-2.5">
                          {post.answers.map((answer, ansIndex) => (
                            <div key={`answer-${answer.id}-${ansIndex}`} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                              <p className="text-sm text-slate-800 leading-relaxed">{answer.content}</p>
                              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-semibold text-slate-700">{answer.name} {answer.surname}</span>
                                <span>•</span>
                                <span>{new Date(answer.created_at).toLocaleDateString("mk-MK")}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reply Box */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                      <h4 className="text-sm font-bold text-slate-800">Напиши одговор</h4>
                      <textarea
                        value={newAnswers[post.id] || ""}
                        onChange={(e) => setNewAnswers(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Сподели го твоето решение или објаснување..."
                        className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleSubmitAnswer(post.id)}
                          disabled={!newAnswers[post.id]?.trim() || submittingAnswer === post.id}
                          className="gap-2 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                          {submittingAnswer === post.id ? "Испраќање..." : "Испрати одговор"}
                        </Button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Нема пронајдено прашања</h3>
            <p className="mt-1 text-xs text-slate-500">Биди првиот што ќе постави прашање во оваа категорија!</p>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center">
            <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Постави прашање
                  </span>
                </h2>
                <button
                  onClick={() => { setShowAskModal(false); setAiPreview(null); }}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Наслов</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Кое е твоето прашање?"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Детали</label>
                  <textarea
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Објасни го прашањето подетално..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Предмет</label>
                  <select
                    value={newQuestion.subject}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  >
                    {subjects.filter(s => s.name !== "Сите").map((subject, subIndex) => (
                      <option key={`modal-subj-${subject.name}-${subIndex}`} value={subject.name}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                {aiPreview && (
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 p-4 space-y-1">
                    <div className="text-sm font-bold text-indigo-700 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" /> AI предлог:
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{aiPreview}</p>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowAskModal(false); setAiPreview(null); }}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Откажи
                  </button>

                  <div className="flex items-center gap-2">
                    {!aiPreview ? (
                      <>
                        <button
                          type="submit"
                          disabled={!newQuestion.title.trim() || !newQuestion.content.trim() || submittingQuestion}
                          className="text-sm font-semibold text-slate-500 hover:text-slate-800 underline pr-2 disabled:opacity-50"
                        >
                          Објави директно
                        </button>
                        <Button
                          type="button"
                          onClick={handleAiPreview}
                          disabled={!newQuestion.title.trim() || !newQuestion.content.trim() || loadingPreview}
                          className="gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 disabled:opacity-50"
                        >
                          <Sparkles className="h-4 w-4" />
                          {loadingPreview ? "Проверка..." : "Провери со AI"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="submit"
                        disabled={submittingQuestion}
                        className="gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                        {submittingQuestion ? "Се постира..." : "Сепак постирај"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </StudyHubLayout>
  )
}