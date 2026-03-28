"import { useState, useEffect } from 'react';
import { marketplaceAPI } from '../lib/api';
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
import { Plus, Book, Tag, Mail, DollarSign, Search, Filter, X } from 'lucide-react';

const subjects = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'Literature',
  'History',
  'Psychology',
  'Other',
];

// Mock data
const mockListings = [
  { id: 1, title: 'Calculus: Early Transcendentals', subject: 'Mathematics', price: 45, isFree: false, contact: 'john@uni.edu', description: 'Great condition, minimal highlighting' },
  { id: 2, title: 'Introduction to Algorithms', subject: 'Computer Science', price: 0, isFree: true, contact: 'sarah@uni.edu', description: 'Free to a good home, some wear on cover' },
  { id: 3, title: 'Organic Chemistry Notes Bundle', subject: 'Chemistry', price: 15, isFree: false, contact: 'mike@uni.edu', description: 'Complete notes from CHEM201, includes diagrams' },
  { id: 4, title: 'Physics for Scientists 4th Ed', subject: 'Physics', price: 35, isFree: false, contact: 'emma@uni.edu', description: 'Includes solution manual' },
  { id: 5, title: 'Psychology 101 Textbook', subject: 'Psychology', price: 0, isFree: true, contact: 'alex@uni.edu', description: 'Giving away, pickup only' },
  { id: 6, title: 'Microeconomics Study Guide', subject: 'Economics', price: 10, isFree: false, contact: 'lisa@uni.edu', description: 'Self-made comprehensive study guide' },
];

const Marketplace = () => {
  const [listings, setListings] = useState(mockListings);
  const [filteredListings, setFilteredListings] = useState(mockListings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [newListing, setNewListing] = useState({
    title: '',
    subject: '',
    price: '',
    isFree: false,
    contact: '',
    description: '',
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [selectedSubject, searchQuery, listings]);

  const fetchListings = async () => {
    try {
      const response = await marketplaceAPI.getAll();
      if (response.data?.length > 0) {
        setListings(response.data);
      }
    } catch (error) {
      console.log('Using mock data for marketplace');
    }
  };

  const filterListings = () => {
    let filtered = [...listings];
    
    if (selectedSubject && selectedSubject !== 'All Subjects') {
      filtered = filtered.filter((item) => item.subject === selectedSubject);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredListings(filtered);
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    
    if (!newListing.title || !newListing.subject || !newListing.contact) {
      toast.error('Please fill in all required fields');
      return;
    }

    const listing = {
      ...newListing,
      price: newListing.isFree ? 0 : parseFloat(newListing.price) || 0,
    };

    try {
      const response = await marketplaceAPI.create(listing);
      setListings([response.data, ...listings]);
      toast.success('Listing posted successfully!');
    } catch (error) {
      const newItem = { id: Date.now(), ...listing };
      setListings([newItem, ...listings]);
      toast.success('Listing posted locally!');
    }
    
    setNewListing({ title: '', subject: '', price: '', isFree: false, contact: '', description: '' });
    setIsDialogOpen(false);
  };

  const clearFilters = () => {
    setSelectedSubject('All Subjects');
    setSearchQuery('');
  };

  return (
    <div data-testid=\"marketplace-page\" className=\"min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8\">
      <div className=\"max-w-7xl mx-auto\">
        {/* Header */}
        <div className=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8\">
          <div>
            <h1 className=\"text-4xl font-bold text-slate-900\" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Marketplace
            </h1>
            <p className=\"text-slate-500 mt-1\">Buy, sell, or share study materials</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                data-testid=\"post-listing-btn\"
                className=\"bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all\"
              >
                <Plus className=\"w-5 h-5 mr-2\" />
                Post Listing
              </Button>
            </DialogTrigger>
            <DialogContent className=\"rounded-3xl max-w-md\">
              <DialogHeader>
                <DialogTitle className=\"text-2xl\" style={{ fontFamily: 'Outfit, sans-serif' }}>Post New Listing</DialogTitle>
                <DialogDescription>Share your study materials with others</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddListing} className=\"space-y-4 mt-4\">
                <div className=\"space-y-2\">
                  <Label htmlFor=\"listing-title\">Title *</Label>
                  <Input
                    id=\"listing-title\"
                    data-testid=\"listing-title-input\"
                    placeholder=\"e.g., Calculus Textbook 8th Edition\"
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                    className=\"rounded-xl\"
                  />
                </div>
                <div className=\"space-y-2\">
                  <Label htmlFor=\"listing-subject\">Subject *</Label>
                  <Select
                    value={newListing.subject}
                    onValueChange={(value) => setNewListing({ ...newListing, subject: value })}
                  >
                    <SelectTrigger data-testid=\"listing-subject-select\" className=\"rounded-xl\">
                      <SelectValue placeholder=\"Select subject\" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.filter(s => s !== 'All Subjects').map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className=\"space-y-2\">
                  <Label htmlFor=\"listing-desc\">Description</Label>
                  <Textarea
                    id=\"listing-desc\"
                    data-testid=\"listing-desc-input\"
                    placeholder=\"Describe the condition, edition, etc.\"
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                    className=\"rounded-xl resize-none\"
                    rows={3}
                  />
                </div>
                <div className=\"flex items-center gap-4\">
                  <div className=\"flex-1 space-y-2\">
                    <Label htmlFor=\"listing-price\">Price ($)</Label>
                    <Input
                      id=\"listing-price\"
                      data-testid=\"listing-price-input\"
                      type=\"number\"
                      min=\"0\"
                      step=\"0.01\"
                      placeholder=\"0.00\"
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                      disabled={newListing.isFree}
                      className=\"rounded-xl\"
                    />
                  </div>
                  <div className=\"pt-6\">
                    <label className=\"flex items-center gap-2 cursor-pointer\">
                      <input
                        type=\"checkbox\"
                        data-testid=\"listing-free-checkbox\"
                        checked={newListing.isFree}
                        onChange={(e) => setNewListing({ ...newListing, isFree: e.target.checked, price: '' })}
                        className=\"w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500\"
                      />
                      <span className=\"text-sm text-slate-600\">Free</span>
                    </label>
                  </div>
                </div>
                <div className=\"space-y-2\">
                  <Label htmlFor=\"listing-contact\">Contact Email *</Label>
                  <Input
                    id=\"listing-contact\"
                    data-testid=\"listing-contact-input\"
                    type=\"email\"
                    placeholder=\"you@university.edu\"
                    value={newListing.contact}
                    onChange={(e) => setNewListing({ ...newListing, contact: e.target.value })}
                    className=\"rounded-xl\"
                  />
                </div>
                <Button 
                  type=\"submit\" 
                  data-testid=\"submit-listing-btn\"
                  className=\"w-full bg-indigo-600 hover:bg-indigo-700 rounded-full\"
                >
                  Post Listing
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className=\"bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6\">
          <div className=\"flex flex-col md:flex-row gap-4\">
            <div className=\"flex-1 relative\">
              <Search className=\"absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400\" />
              <Input
                data-testid=\"search-input\"
                placeholder=\"Search listings...\"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=\"pl-10 rounded-xl border-slate-200\"
              />
            </div>
            <div className=\"flex items-center gap-3\">
              <Filter className=\"w-5 h-5 text-slate-400\" />
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger data-testid=\"filter-subject\" className=\"w-[180px] rounded-xl\">
                  <SelectValue placeholder=\"Filter by subject\" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(selectedSubject !== 'All Subjects' || searchQuery) && (
                <Button 
                  variant=\"ghost\" 
                  size=\"sm\" 
                  onClick={clearFilters}
                  className=\"rounded-full text-slate-500 hover:text-slate-700\"
                >
                  <X className=\"w-4 h-4 mr-1\" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className=\"text-sm text-slate-500 mb-4\">
          Showing {filteredListings.length} of {listings.length} listings
        </p>

        {/* Listings Grid */}
        <div className=\"grid md:grid-cols-2 lg:grid-cols-3 gap-6\">
          {filteredListings.map((listing, index) => (
            <Card
              key={listing.id}
              data-testid={`listing-card-${listing.id}`}
              className=\"border-0 shadow-sm hover:shadow-lg transition-all rounded-3xl bg-white hover:-translate-y-1 animate-fade-in\"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className=\"p-6\">
                <div className=\"flex items-start justify-between gap-3 mb-4\">
                  <div className=\"p-3 bg-indigo-100 text-indigo-600 rounded-2xl\">
                    <Book className=\"w-6 h-6\" />
                  </div>
                  <Badge 
                    className={`rounded-full ${
                      listing.isFree 
                        ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {listing.isFree ? 'Free' : `$${listing.price}`}
                  </Badge>
                </div>
                <h3 className=\"font-semibold text-lg text-slate-900 mb-2 line-clamp-2\">
                  {listing.title}
                </h3>
                <p className=\"text-slate-500 text-sm mb-4 line-clamp-2\">
                  {listing.description}
                </p>
                <div className=\"flex items-center gap-2 mb-4\">
                  <Tag className=\"w-4 h-4 text-slate-400\" />
                  <span className=\"text-sm text-slate-600\">{listing.subject}</span>
                </div>
                <div className=\"flex items-center gap-2 pt-4 border-t border-slate-100\">
                  <Mail className=\"w-4 h-4 text-slate-400\" />
                  <a 
                    href={`mailto:${listing.contact}`}
                    className=\"text-sm text-indigo-600 hover:text-indigo-700\"
                  >
                    {listing.contact}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className=\"text-center py-16\">
            <Book className=\"w-16 h-16 text-slate-300 mx-auto mb-4\" />
            <h3 className=\"text-xl font-semibold text-slate-700 mb-2\">No listings found</h3>
            <p className=\"text-slate-500 mb-6\">Try adjusting your filters or post a new listing</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className=\"bg-indigo-600 hover:bg-indigo-700 rounded-full\"
            >
              <Plus className=\"w-5 h-5 mr-2\" />
              Post First Listing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
"