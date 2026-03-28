"import { useState, useEffect } from 'react';
import { forumAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { 
  Plus, 
  MessageSquare, 
  ThumbsUp, 
  Clock, 
  ArrowLeft,
  Send,
  User
} from 'lucide-react';

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'Literature',
  'History',
  'Psychology',
  'General',
];

// Mock data
const mockQuestions = [
  { 
    id: 1, 
    title: 'How do I solve integration by parts?', 
    body: 'I'm struggling with integration by parts problems. Can someone explain the LIATE rule?',
    subject: 'Mathematics', 
    likes: 12, 
    author: 'John D.',
    createdAt: '2024-01-15T10:30:00Z',
    answers: [
      { id: 1, body: 'The LIATE rule helps you choose u and dv. L=Logarithmic, I=Inverse trig, A=Algebraic, T=Trig, E=Exponential.', author: 'Sarah M.', createdAt: '2024-01-15T11:00:00Z' },
      { id: 2, body: 'Remember the formula: ∫u dv = uv - ∫v du. Practice with examples!', author: 'Mike R.', createdAt: '2024-01-15T12:30:00Z' },
    ]
  },
  { 
    id: 2, 
    title: 'Best resources for learning Python?', 
    body: 'I'm a beginner looking for free resources to learn Python programming.',
    subject: 'Computer Science', 
    likes: 24, 
    author: 'Emma W.',
    createdAt: '2024-01-14T15:45:00Z',
    answers: [
      { id: 3, body: 'Try Codecademy or freeCodeCamp. Both have great Python courses!', author: 'Alex K.', createdAt: '2024-01-14T16:00:00Z' },
    ]
  },
  { 
    id: 3, 
    title: 'Can someone explain supply and demand curves?', 
    body: 'Having trouble understanding how supply and demand curves interact to determine equilibrium.',
    subject: 'Economics', 
    likes: 8, 
    author: 'Lisa P.',
    createdAt: '2024-01-13T09:00:00Z',
    answers: []
  },
  { 
    id: 4, 
    title: 'Tips for memorizing organic chemistry reactions?', 
    body: 'There are so many reactions in orgo. What study techniques work best?',
    subject: 'Chemistry', 
    likes: 18, 
    author: 'David C.',
    createdAt: '2024-01-12T14:20:00Z',
    answers: [
      { id: 4, body: 'Flashcards and drawing mechanisms repeatedly. Group reactions by type!', author: 'Rachel B.', createdAt: '2024-01-12T15:00:00Z' },
    ]
  },
];

const Forum = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState(mockQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', body: '', subject: '' });
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await forumAPI.getQuestions();
      if (response.data?.length > 0) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.log('Using mock data for forum');
    }
  };

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    
    if (!newQuestion.title || !newQuestion.body || !newQuestion.subject) {
      toast.error('Please fill in all fields');
      return;
    }

    const question = {
      ...newQuestion,
      author: user?.name || 'Anonymous',
      likes: 0,
      createdAt: new Date().toISOString(),
      answers: [],
    };

    try {
      const response = await forumAPI.createQuestion(question);
      setQuestions([response.data, ...questions]);
      toast.success('Question posted successfully!');
    } catch (error) {
      const newQ = { id: Date.now(), ...question };
      setQuestions([newQ, ...questions]);
      toast.success('Question posted locally!');
    }
    
    setNewQuestion({ title: '', body: '', subject: '' });
    setIsQuestionDialogOpen(false);
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    
    if (!newAnswer.trim()) {
      toast.error('Please write an answer');
      return;
    }

    const answer = {
      id: Date.now(),
      body: newAnswer,
      author: user?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
    };

    try {
      await forumAPI.createAnswer(selectedQuestion.id, { body: newAnswer });
    } catch (error) {
      console.log('Answer saved locally');
    }

    const updatedQuestions = questions.map((q) =>
      q.id === selectedQuestion.id
        ? { ...q, answers: [...q.answers, answer] }
        : q
    );
    setQuestions(updatedQuestions);
    setSelectedQuestion({ ...selectedQuestion, answers: [...selectedQuestion.answers, answer] });
    setNewAnswer('');
    toast.success('Answer posted!');
  };

  const handleLikeQuestion = async (questionId) => {
    try {
      await forumAPI.likeQuestion(questionId);
    } catch (error) {
      console.log('Like saved locally');
    }

    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, likes: q.likes + 1 } : q
    );
    setQuestions(updatedQuestions);
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion({ ...selectedQuestion, likes: selectedQuestion.likes + 1 });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-700',
      'Physics': 'bg-purple-100 text-purple-700',
      'Chemistry': 'bg-green-100 text-green-700',
      'Biology': 'bg-emerald-100 text-emerald-700',
      'Computer Science': 'bg-orange-100 text-orange-700',
      'Economics': 'bg-yellow-100 text-yellow-700',
      'Literature': 'bg-pink-100 text-pink-700',
      'History': 'bg-amber-100 text-amber-700',
      'Psychology': 'bg-cyan-100 text-cyan-700',
      'General': 'bg-slate-100 text-slate-700',
    };
    return colors[subject] || colors['General'];
  };

  // Question Detail View
  if (selectedQuestion) {
    return (
      <div data-testid=\"question-detail\" className=\"min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8\">
        <div className=\"max-w-3xl mx-auto\">
          <Button
            variant=\"ghost\"
            data-testid=\"back-to-questions\"
            onClick={() => setSelectedQuestion(null)}
            className=\"mb-6 rounded-full text-slate-600 hover:text-slate-900\"
          >
            <ArrowLeft className=\"w-4 h-4 mr-2\" />
            Back to Questions
          </Button>

          <Card className=\"border-0 shadow-lg shadow-slate-200/50 rounded-3xl mb-6\">
            <CardContent className=\"p-8\">
              <div className=\"flex items-center gap-3 mb-4\">
                <Badge className={`rounded-full ${getSubjectColor(selectedQuestion.subject)}`}>
                  {selectedQuestion.subject}
                </Badge>
                <span className=\"text-sm text-slate-400 flex items-center gap-1\">
                  <Clock className=\"w-4 h-4\" />
                  {formatDate(selectedQuestion.createdAt)}
                </span>
              </div>
              <h1 className=\"text-2xl md:text-3xl font-bold text-slate-900 mb-4\" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {selectedQuestion.title}
              </h1>
              <p className=\"text-slate-600 text-lg leading-relaxed mb-6\">{selectedQuestion.body}</p>
              <div className=\"flex items-center justify-between pt-4 border-t border-slate-100\">
                <div className=\"flex items-center gap-2 text-slate-500\">
                  <User className=\"w-4 h-4\" />
                  <span className=\"text-sm\">{selectedQuestion.author}</span>
                </div>
                <Button
                  variant=\"ghost\"
                  data-testid=\"like-question-btn\"
                  onClick={() => handleLikeQuestion(selectedQuestion.id)}
                  className=\"rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50\"
                >
                  <ThumbsUp className=\"w-4 h-4 mr-2\" />
                  {selectedQuestion.likes}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Answers */}
          <div className=\"mb-6\">
            <h2 className=\"text-xl font-semibold text-slate-900 mb-4\" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {selectedQuestion.answers.length} Answer{selectedQuestion.answers.length !== 1 ? 's' : ''}
            </h2>
            <div className=\"space-y-4\">
              {selectedQuestion.answers.map((answer) => (
                <Card key={answer.id} data-testid={`answer-${answer.id}`} className=\"border-0 shadow-sm rounded-2xl\">
                  <CardContent className=\"p-6\">
                    <p className=\"text-slate-700 leading-relaxed mb-4\">{answer.body}</p>
                    <div className=\"flex items-center gap-3 text-sm text-slate-500\">
                      <User className=\"w-4 h-4\" />
                      <span>{answer.author}</span>
                      <span>•</span>
                      <span>{formatDate(answer.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Post Answer */}
          <Card className=\"border-0 shadow-sm rounded-3xl\">
            <CardContent className=\"p-6\">
              <h3 className=\"font-semibold text-slate-900 mb-4\">Your Answer</h3>
              <form onSubmit={handlePostAnswer} className=\"space-y-4\">
                <Textarea
                  data-testid=\"answer-input\"
                  placeholder=\"Share your knowledge...\"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className=\"rounded-xl resize-none\"
                  rows={4}
                />
                <Button 
                  type=\"submit\" 
                  data-testid=\"submit-answer-btn\"
                  className=\"bg-indigo-600 hover:bg-indigo-700 rounded-full\"
                >
                  <Send className=\"w-4 h-4 mr-2\" />
                  Post Answer
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Questions List View
  return (
    <div data-testid=\"forum-page\" className=\"min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8\">
      <div className=\"max-w-4xl mx-auto\">
        {/* Header */}
        <div className=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8\">
          <div>
            <h1 className=\"text-4xl font-bold text-slate-900\" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Forum
            </h1>
            <p className=\"text-slate-500 mt-1\">Ask questions, share knowledge</p>
          </div>
          <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                data-testid=\"ask-question-btn\"
                className=\"bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all\"
              >
                <Plus className=\"w-5 h-5 mr-2\" />
                Ask Question
              </Button>
            </DialogTrigger>
            <DialogContent className=\"rounded-3xl max-w-md\">
              <DialogHeader>
                <DialogTitle className=\"text-2xl\" style={{ fontFamily: 'Outfit, sans-serif' }}>Ask a Question</DialogTitle>
                <DialogDescription>Get help from the community</DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePostQuestion} className=\"space-y-4 mt-4\">
                <div className=\"space-y-2\">
                  <Label htmlFor=\"q-title\">Title *</Label>
                  <Input
                    id=\"q-title\"
                    data-testid=\"question-title-input\"
                    placeholder=\"e.g., How do I solve this equation?\"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    className=\"rounded-xl\"
                  />
                </div>
                <div className=\"space-y-2\">
                  <Label htmlFor=\"q-subject\">Subject *</Label>
                  <Select
                    value={newQuestion.subject}
                    onValueChange={(value) => setNewQuestion({ ...newQuestion, subject: value })}
                  >
                    <SelectTrigger data-testid=\"question-subject-select\" className=\"rounded-xl\">
                      <SelectValue placeholder=\"Select subject\" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className=\"space-y-2\">
                  <Label htmlFor=\"q-body\">Details *</Label>
                  <Textarea
                    id=\"q-body\"
                    data-testid=\"question-body-input\"
                    placeholder=\"Explain your question in detail...\"
                    value={newQuestion.body}
                    onChange={(e) => setNewQuestion({ ...newQuestion, body: e.target.value })}
                    className=\"rounded-xl resize-none\"
                    rows={4}
                  />
                </div>
                <Button 
                  type=\"submit\" 
                  data-testid=\"submit-question-btn\"
                  className=\"w-full bg-indigo-600 hover:bg-indigo-700 rounded-full\"
                >
                  Post Question
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Questions List */}
        <div className=\"space-y-4\">
          {questions.map((question, index) => (
            <Card
              key={question.id}
              data-testid={`question-card-${question.id}`}
              onClick={() => setSelectedQuestion(question)}
              className=\"border-0 shadow-sm hover:shadow-lg transition-all rounded-2xl bg-white cursor-pointer hover:-translate-y-1 animate-fade-in\"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className=\"p-6\">
                <div className=\"flex items-start gap-4\">
                  <div className=\"hidden sm:flex flex-col items-center gap-1 min-w-[60px] py-2\">
                    <Button
                      variant=\"ghost\"
                      size=\"sm\"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeQuestion(question.id);
                      }}
                      className=\"rounded-full hover:bg-indigo-50 hover:text-indigo-600\"
                    >
                      <ThumbsUp className=\"w-5 h-5\" />
                    </Button>
                    <span className=\"font-semibold text-slate-700\">{question.likes}</span>
                    <span className=\"text-xs text-slate-400\">likes</span>
                  </div>
                  <div className=\"flex-1 min-w-0\">
                    <div className=\"flex flex-wrap items-center gap-2 mb-2\">
                      <Badge className={`rounded-full ${getSubjectColor(question.subject)}`}>
                        {question.subject}
                      </Badge>
                      <span className=\"text-xs text-slate-400 flex items-center gap-1\">
                        <MessageSquare className=\"w-3 h-3\" />
                        {question.answers.length} answers
                      </span>
                    </div>
                    <h3 className=\"font-semibold text-lg text-slate-900 mb-2 line-clamp-2\">
                      {question.title}
                    </h3>
                    <p className=\"text-slate-500 text-sm line-clamp-2 mb-3\">{question.body}</p>
                    <div className=\"flex items-center gap-3 text-xs text-slate-400\">
                      <span className=\"flex items-center gap-1\">
                        <User className=\"w-3 h-3\" />
                        {question.author}
                      </span>
                      <span>•</span>
                      <span>{formatDate(question.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {questions.length === 0 && (
          <div className=\"text-center py-16\">
            <MessageSquare className=\"w-16 h-16 text-slate-300 mx-auto mb-4\" />
            <h3 className=\"text-xl font-semibold text-slate-700 mb-2\">No questions yet</h3>
            <p className=\"text-slate-500 mb-6\">Be the first to ask a question!</p>
            <Button 
              onClick={() => setIsQuestionDialogOpen(true)}
              className=\"bg-indigo-600 hover:bg-indigo-700 rounded-full\"
            >
              <Plus className=\"w-5 h-5 mr-2\" />
              Ask First Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
"