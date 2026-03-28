"import { useState, useEffect } from 'react';
import { eventsAPI } from '../lib/api';
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
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users,
  CheckCircle,
  Tag
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
const mockEvents = [
  { 
    id: 1, 
    title: 'Calculus Study Group', 
    subject: 'Mathematics', 
    location: 'Main Library Room 204',
    date: '2024-01-20',
    time: '14:00',
    description: 'Weekly calculus study session. Bring your homework!',
    attendees: 8,
    joined: false
  },
  { 
    id: 2, 
    title: 'Python Coding Workshop', 
    subject: 'Computer Science', 
    location: 'Computer Lab B',
    date: '2024-01-21',
    time: '16:00',
    description: 'Learn Python basics and work on mini projects together.',
    attendees: 15,
    joined: true
  },
  { 
    id: 3, 
    title: 'Economics Exam Prep', 
    subject: 'Economics', 
    location: 'Student Union Room 3',
    date: '2024-01-22',
    time: '10:00',
    description: 'Preparing for the midterm exam. Review sessions and practice problems.',
    attendees: 12,
    joined: false
  },
  { 
    id: 4, 
    title: 'Chemistry Lab Review', 
    subject: 'Chemistry', 
    location: 'Science Building 301',
    date: '2024-01-23',
    time: '13:00',
    description: 'Going over lab techniques and safety procedures.',
    attendees: 6,
    joined: false
  },
];

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState(mockEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    subject: '',
    location: '',
    date: '',
    time: '',
    description: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      if (response.data?.length > 0) {
        setEvents(response.data);
      }
    } catch (error) {
      console.log('Using mock data for events');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.subject || !newEvent.location || !newEvent.date || !newEvent.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const event = {
      ...newEvent,
      attendees: 1,
      joined: true,
    };

    try {
      const response = await eventsAPI.create(event);
      setEvents([response.data, ...events]);
      toast.success('Event created successfully!');
    } catch (error) {
      const newE = { id: Date.now(), ...event };
      setEvents([newE, ...events]);
      toast.success('Event created locally!');
    }
    
    setNewEvent({ title: '', subject: '', location: '', date: '', time: '', description: '' });
    setSelectedDate(null);
    setIsDialogOpen(false);
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await eventsAPI.join(eventId);
    } catch (error) {
      console.log('Join saved locally');
    }

    const updatedEvents = events.map((e) =>
      e.id === eventId
        ? { ...e, joined: !e.joined, attendees: e.joined ? e.attendees - 1 : e.attendees + 1 }
        : e
    );
    setEvents(updatedEvents);
    const event = events.find(e => e.id === eventId);
    toast.success(event?.joined ? 'Left event' : 'Joined event!');
  };

  const formatEventDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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

  const isUpcoming = (dateStr) => {
    return new Date(dateStr) >= new Date();
  };

  const upcomingEvents = events.filter(e => isUpcoming(e.date));
  const pastEvents = events.filter(e => !isUpcoming(e.date));

  return (
    <div data-testid=\"events-page\" className=\"min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8\">
      <div className=\"max-w-5xl mx-auto\">
        {/* Header */}
        <div className=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8\">
          <div>
            <h1 className=\"text-4xl font-bold text-slate-900\" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Study Events
            </h1>
            <p className=\"text-slate-500 mt-1\">Join study groups and collaborative sessions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                data-testid=\"create-event-btn\"
                className=\"bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all\"
              >
                <Plus className=\"w-5 h-5 mr-2\" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className=\"rounded-3xl max-w-md\">
              <DialogHeader>
                <DialogTitle className=\"text-2xl\" style={{ fontFamily: 'Outfit, sans-serif' }}>Create Study Event</DialogTitle>
                <DialogDescription>Organize a study session with classmates</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className=\"space-y-4 mt-4\">
                <div className=\"space-y-2\">
                  <Label htmlFor=\"event-title\">Event Title *</Label>
                  <Input
                    id=\"event-title\"
                    data-testid=\"event-title-input\"
                    placeholder=\"e.g., Calculus Study Group\"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className=\"rounded-xl\"
                  />
                </div>
                <div className=\"space-y-2\">
                  <Label htmlFor=\"event-subject\">Subject *</Label>
                  <Select
                    value={newEvent.subject}
                    onValueChange={(value) => setNewEvent({ ...newEvent, subject: value })}
                  >
                    <SelectTrigger data-testid=\"event-subject-select\" className=\"rounded-xl\">
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
                  <Label htmlFor=\"event-location\">Location *</Label>
                  <Input
                    id=\"event-location\"
                    data-testid=\"event-location-input\"
                    placeholder=\"e.g., Library Room 204\"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className=\"rounded-xl\"
                  />
                </div>
                <div className=\"grid grid-cols-2 gap-4\">
                  <div className=\"space-y-2\">
                    <Label>Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant=\"outline\"
                          data-testid=\"event-date-picker\"
                          className=\"w-full justify-start text-left font-normal rounded-xl\"
                        >
                          <CalendarIcon className=\"mr-2 h-4 w-4\" />
                          {selectedDate ? format(selectedDate, 'MMM dd') : 'Pick date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className=\"w-auto p-0\" align=\"start\">
                        <Calendar
                          mode=\"single\"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setNewEvent({ ...newEvent, date: date ? format(date, 'yyyy-MM-dd') : '' });
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className=\"space-y-2\">
                    <Label htmlFor=\"event-time\">Time *</Label>
                    <Input
                      id=\"event-time\"
                      data-testid=\"event-time-input\"
                      type=\"time\"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className=\"rounded-xl\"
                    />
                  </div>
                </div>
                <div className=\"space-y-2\">
                  <Label htmlFor=\"event-desc\">Description</Label>
                  <Textarea
                    id=\"event-desc\"
                    data-testid=\"event-desc-input\"
                    placeholder=\"What will you be studying?\"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className=\"rounded-xl resize-none\"
                    rows={3}
                  />
                </div>
                <Button 
                  type=\"submit\" 
                  data-testid=\"submit-event-btn\"
                  className=\"w-full bg-indigo-600 hover:bg-indigo-700 rounded-full\"
                >
                  Create Event
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Upcoming Events */}
        <div className=\"mb-10\">
          <h2 className=\"text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2\" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <CalendarIcon className=\"w-5 h-5 text-indigo-500\" />
            Upcoming Events ({upcomingEvents.length})
          </h2>
          <div className=\"grid md:grid-cols-2 gap-6\">
            {upcomingEvents.map((event, index) => (
              <Card
                key={event.id}
                data-testid={`event-card-${event.id}`}
                className=\"border-0 shadow-sm hover:shadow-lg transition-all rounded-3xl bg-white hover:-translate-y-1 animate-fade-in\"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className=\"p-6\">
                  <div className=\"flex items-start justify-between gap-4 mb-4\">
                    <Badge className={`rounded-full ${getSubjectColor(event.subject)}`}>
                      <Tag className=\"w-3 h-3 mr-1\" />
                      {event.subject}
                    </Badge>
                    {event.joined && (
                      <Badge className=\"rounded-full bg-teal-100 text-teal-700\">
                        <CheckCircle className=\"w-3 h-3 mr-1\" />
                        Joined
                      </Badge>
                    )}
                  </div>
                  <h3 className=\"font-semibold text-xl text-slate-900 mb-3\">{event.title}</h3>
                  <p className=\"text-slate-500 text-sm mb-4 line-clamp-2\">{event.description}</p>
                  <div className=\"space-y-2 mb-5\">
                    <div className=\"flex items-center gap-2 text-slate-600\">
                      <CalendarIcon className=\"w-4 h-4 text-indigo-500\" />
                      <span className=\"text-sm\">{formatEventDate(event.date)}</span>
                    </div>
                    <div className=\"flex items-center gap-2 text-slate-600\">
                      <Clock className=\"w-4 h-4 text-indigo-500\" />
                      <span className=\"text-sm\">{event.time}</span>
                    </div>
                    <div className=\"flex items-center gap-2 text-slate-600\">
                      <MapPin className=\"w-4 h-4 text-indigo-500\" />
                      <span className=\"text-sm\">{event.location}</span>
                    </div>
                  </div>
                  <div className=\"flex items-center justify-between pt-4 border-t border-slate-100\">
                    <div className=\"flex items-center gap-2 text-slate-500\">
                      <Users className=\"w-4 h-4\" />
                      <span className=\"text-sm\">{event.attendees} attending</span>
                    </div>
                    <Button
                      data-testid={`join-event-${event.id}`}
                      variant={event.joined ? 'outline' : 'default'}
                      onClick={() => handleJoinEvent(event.id)}
                      className={`rounded-full ${
                        event.joined 
                          ? 'border-slate-200 text-slate-600 hover:bg-slate-50' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {event.joined ? 'Leave' : 'Join'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {upcomingEvents.length === 0 && (
            <div className=\"text-center py-12 bg-white rounded-3xl shadow-sm\">
              <CalendarIcon className=\"w-16 h-16 text-slate-300 mx-auto mb-4\" />
              <h3 className=\"text-xl font-semibold text-slate-700 mb-2\">No upcoming events</h3>
              <p className=\"text-slate-500 mb-6\">Be the first to organize a study session!</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className=\"bg-indigo-600 hover:bg-indigo-700 rounded-full\"
              >
                <Plus className=\"w-5 h-5 mr-2\" />
                Create Event
              </Button>
            </div>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className=\"text-xl font-semibold text-slate-400 mb-4\" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Past Events
            </h2>
            <div className=\"grid md:grid-cols-2 gap-4 opacity-60\">
              {pastEvents.map((event) => (
                <Card
                  key={event.id}
                  className=\"border-0 shadow-sm rounded-2xl bg-slate-50\"
                >
                  <CardContent className=\"p-5\">
                    <div className=\"flex items-center gap-3 mb-2\">
                      <Badge variant=\"secondary\" className=\"rounded-full\">
                        {event.subject}
                      </Badge>
                      <span className=\"text-xs text-slate-400\">{formatEventDate(event.date)}</span>
                    </div>
                    <h3 className=\"font-medium text-slate-600\">{event.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
"