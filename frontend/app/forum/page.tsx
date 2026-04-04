"use client"

import { useState } from "react"
import { StudyHubLayout } from "@/components/studyhub-layout"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Plus, X, ChevronDown, ChevronUp, Send } from "lucide-react"

// Subject tags with colors
const subjects = [
  { name: "All", color: "bg-slate-100 text-slate-700 border-slate-200", activeColor: "bg-slate-700 text-white border-slate-700" },
  { name: "Mathematics", color: "bg-cyan-50 text-cyan-700 border-cyan-200", activeColor: "bg-cyan-500 text-white border-cyan-500" },
  { name: "Programming", color: "bg-emerald-50 text-emerald-700 border-emerald-200", activeColor: "bg-emerald-500 text-white border-emerald-500" },
  { name: "Physics", color: "bg-violet-50 text-violet-700 border-violet-200", activeColor: "bg-violet-500 text-white border-violet-500" },
  { name: "Chemistry", color: "bg-pink-50 text-pink-700 border-pink-200", activeColor: "bg-pink-500 text-white border-pink-500" },
  { name: "Biology", color: "bg-orange-50 text-orange-700 border-orange-200", activeColor: "bg-orange-500 text-white border-orange-500" },
  { name: "Literature", color: "bg-cyan-50 text-cyan-700 border-cyan-200", activeColor: "bg-cyan-500 text-white border-cyan-500" },
  { name: "History", color: "bg-emerald-50 text-emerald-700 border-emerald-200", activeColor: "bg-emerald-500 text-white border-emerald-500" },
  { name: "Economics", color: "bg-violet-50 text-violet-700 border-violet-200", activeColor: "bg-violet-500 text-white border-violet-500" },
]

// Get subject color classes
const getSubjectColors = (subjectName: string) => {
  const subject = subjects.find(s => s.name === subjectName)
  return subject || subjects[0]
}

// Mock data for posts
const initialPosts = [
  {
    id: 1,
    title: "How do I solve this differential equation?",
    content: "I'm struggling with solving dy/dx = x^2 + y. I've tried separation of variables but it doesn't seem to work. Can someone explain the proper method to approach this type of equation? I understand basic integration but this one has both x and y terms which confuses me. Any step-by-step guidance would be greatly appreciated!",
    subject: "Mathematics",
    author: "Sarah Chen",
    date: "2 hours ago",
    likes: 24,
    liked: false,
    answers: [
      { id: 1, author: "Prof. Martinez", content: "This is a first-order linear ODE. You'll need to use an integrating factor. The standard form is dy/dx + P(x)y = Q(x). In your case, rewrite it as dy/dx - y = x^2, so P(x) = -1 and Q(x) = x^2. The integrating factor is e^(-x).", date: "1 hour ago" },
      { id: 2, author: "Alex Kim", content: "To add to Prof. Martinez's answer: multiply both sides by the integrating factor e^(-x), then the left side becomes d/dx[y*e^(-x)]. Integrate both sides and solve for y. Don't forget the constant of integration!", date: "45 mins ago" },
    ],
  },
  {
    id: 2,
    title: "Best practices for React state management in 2024?",
    content: "I'm building a medium-sized application and wondering what the current best practices are for state management. Should I use Redux, Zustand, Jotai, or just stick with React Context? The app has about 20 components with some shared state.",
    subject: "Programming",
    author: "Mike Johnson",
    date: "5 hours ago",
    likes: 42,
    liked: false,
    answers: [
      { id: 1, author: "Emma Dev", content: "For a medium-sized app, I'd recommend Zustand. It's much simpler than Redux but powerful enough for most use cases. The boilerplate is minimal and it works great with TypeScript.", date: "4 hours ago" },
    ],
  },
  {
    id: 3,
    title: "Explain quantum entanglement in simple terms?",
    content: "I'm trying to understand quantum entanglement for my physics class but all the explanations I find are either too simple (spooky action at a distance) or too complex (full mathematical treatment). Can someone explain it at an undergraduate level?",
    subject: "Physics",
    author: "David Park",
    date: "1 day ago",
    likes: 89,
    liked: false,
    answers: [
      { id: 1, author: "Dr. Quantum", content: "Think of it this way: when two particles are entangled, measuring one instantly determines the state of the other, regardless of distance. But it's not communication - it's more like having two gloves in separate boxes. Open one and find a left glove, you instantly know the other is right. The quantum twist is that the gloves don't 'decide' which is which until you look!", date: "20 hours ago" },
      { id: 2, author: "Physics TA", content: "Adding to Dr. Quantum's analogy: the key difference from classical correlation is superposition. Before measurement, each particle exists in a superposition of states. The entanglement means their superpositions are correlated, so when one collapses to a definite state, the other must too.", date: "18 hours ago" },
      { id: 3, author: "Curious Student", content: "So does this mean information travels faster than light?", date: "15 hours ago" },
    ],
  },
  {
    id: 4,
    title: "Tips for organic chemistry nomenclature?",
    content: "I keep making mistakes naming organic compounds. Any mnemonics or tips for remembering IUPAC naming rules, especially for complex molecules with multiple functional groups?",
    subject: "Chemistry",
    author: "Lisa Wang",
    date: "3 days ago",
    likes: 56,
    liked: false,
    answers: [],
  },
  {
    id: 5,
    title: "Understanding the Krebs Cycle",
    content: "Can someone explain why the Krebs cycle is so important? I understand the steps but I'm not connecting it to the bigger picture of cellular respiration and energy production.",
    subject: "Biology",
    author: "James Wilson",
    date: "1 week ago",
    likes: 33,
    liked: false,
    answers: [
      { id: 1, author: "Bio Major", content: "The Krebs cycle is crucial because it's the hub of metabolism! It takes acetyl-CoA (from carbs, fats, and proteins) and extracts high-energy electrons to NADH and FADH2. These then go to the electron transport chain where most ATP is actually made. Without Krebs, you'd only get 2 ATP per glucose instead of ~30-32!", date: "6 days ago" },
    ],
  },
]

interface Answer {
  id: number
  author: string
  content: string
  date: string
}

interface Post {
  id: number
  title: string
  content: string
  subject: string
  author: string
  date: string
  likes: number
  liked: boolean
  answers: Answer[]
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [showAskModal, setShowAskModal] = useState(false)
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "", subject: "Mathematics" })
  const [newAnswers, setNewAnswers] = useState<Record<number, string>>({})
  const [likeAnimations, setLikeAnimations] = useState<Record<number, boolean>>({})

  const filteredPosts = selectedSubject === "All" 
    ? posts 
    : posts.filter(post => post.subject === selectedSubject)

  const handleLike = (postId: number) => {
    // Trigger animation
    setLikeAnimations(prev => ({ ...prev, [postId]: true }))
    setTimeout(() => {
      setLikeAnimations(prev => ({ ...prev, [postId]: false }))
    }, 300)

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        }
      }
      return post
    }))
  }

  const handleSubmitQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return
    
    const newPost: Post = {
      id: posts.length + 1,
      title: newQuestion.title,
      content: newQuestion.content,
      subject: newQuestion.subject,
      author: "You",
      date: "Just now",
      likes: 0,
      liked: false,
      answers: []
    }
    
    setPosts([newPost, ...posts])
    setNewQuestion({ title: "", content: "", subject: "Mathematics" })
    setShowAskModal(false)
  }

  const handleSubmitAnswer = (postId: number) => {
    const answerContent = newAnswers[postId]
    if (!answerContent?.trim()) return

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          answers: [...post.answers, {
            id: post.answers.length + 1,
            author: "You",
            content: answerContent,
            date: "Just now"
          }]
        }
      }
      return post
    }))
    
    setNewAnswers(prev => ({ ...prev, [postId]: "" }))
  }

  return (
    <StudyHubLayout>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
              <span className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
                Forum
              </span>
            </h1>
            <p className="mt-1 text-slate-600">Ask questions, share knowledge, help each other succeed</p>
          </div>
          <Button
            onClick={() => setShowAskModal(true)}
            className="gap-2 bg-gradient-to-r from-violet-500 to-pink-500 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Ask a Question
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

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const subjectColors = getSubjectColors(post.subject)
            const isExpanded = expandedPost === post.id
            
            return (
              <div
                key={post.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {/* Question Card Header */}
                <div
                  className="cursor-pointer p-5"
                  onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Subject Tag */}
                      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${subjectColors.color}`}>
                        {post.subject}
                      </span>
                      
                      {/* Title */}
                      <h3 className="mt-2 text-lg font-bold text-slate-800">
                        {post.title}
                      </h3>
                      
                      {/* Preview (only when collapsed) */}
                      {!isExpanded && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {post.content}
                        </p>
                      )}
                      
                      {/* Author and Date */}
                      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                    
                    {/* Expand/Collapse Icon */}
                    <div className="flex-shrink-0 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  
                  {/* Actions Bar */}
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(post.id)
                      }}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                        post.liked 
                          ? "bg-pink-100 text-pink-600" 
                          : "bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-500"
                      }`}
                    >
                      <Heart 
                        className={`h-4 w-4 transition-transform duration-300 ${
                          likeAnimations[post.id] ? "scale-125" : ""
                        } ${post.liked ? "fill-pink-500" : ""}`} 
                      />
                      {post.likes}
                    </button>
                    <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                      <MessageCircle className="h-4 w-4" />
                      {post.answers.length} {post.answers.length === 1 ? "Answer" : "Answers"}
                    </div>
                  </div>
                </div>
                
                {/* Expanded Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5">
                    {/* Full Question Content */}
                    <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
                      <p className="whitespace-pre-wrap text-slate-700">{post.content}</p>
                    </div>
                    
                    {/* Answers */}
                    {post.answers.length > 0 && (
                      <div className="mb-6">
                        <h4 className="mb-4 font-semibold text-slate-800">
                          {post.answers.length} {post.answers.length === 1 ? "Answer" : "Answers"}
                        </h4>
                        <div className="space-y-3">
                          {post.answers.map((answer, index) => {
                            // Cycle through colors for answers
                            const answerColors = [
                              "border-l-cyan-400 bg-cyan-50/50",
                              "border-l-emerald-400 bg-emerald-50/50",
                              "border-l-violet-400 bg-violet-50/50",
                              "border-l-pink-400 bg-pink-50/50",
                              "border-l-orange-400 bg-orange-50/50",
                            ]
                            const colorClass = answerColors[index % answerColors.length]
                            
                            return (
                              <div
                                key={answer.id}
                                className={`rounded-lg border-l-4 bg-white p-4 ${colorClass}`}
                              >
                                <p className="text-slate-700">{answer.content}</p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                  <span className="font-medium text-slate-700">{answer.author}</span>
                                  <span>•</span>
                                  <span>{answer.date}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Answer Form */}
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <h4 className="mb-3 font-semibold text-slate-800">Write an Answer</h4>
                      <div className="flex gap-3">
                        <textarea
                          value={newAnswers[post.id] || ""}
                          onChange={(e) => setNewAnswers(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Share your knowledge..."
                          className="flex-1 resize-none rounded-lg border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                          rows={3}
                        />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button
                          onClick={() => handleSubmitAnswer(post.id)}
                          disabled={!newAnswers[post.id]?.trim()}
                          className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                          Submit Answer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
              <MessageCircle className="h-8 w-8 text-violet-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No questions yet</h3>
            <p className="mt-1 text-slate-600">Be the first to ask a question in {selectedSubject}!</p>
          </div>
        )}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg animate-in fade-in zoom-in-95 rounded-2xl bg-white p-6 shadow-2xl duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                  Ask a Question
                </span>
              </h2>
              <button
                onClick={() => setShowAskModal(false)}
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
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's your question?"
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              
              {/* Content */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Details</label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Provide more context for your question..."
                  className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  rows={5}
                />
              </div>
              
              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
                <select
                  value={newQuestion.subject}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  {subjects.filter(s => s.name !== "All").map((subject) => (
                    <option key={subject.name} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowAskModal(false)}
                className="text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitQuestion}
                disabled={!newQuestion.title.trim() || !newQuestion.content.trim()}
                className="gap-2 bg-gradient-to-r from-violet-500 to-pink-500 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Post Question
              </Button>
            </div>
          </div>
        </div>
      )}
    </StudyHubLayout>
  )
}
