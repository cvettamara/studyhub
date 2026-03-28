"import { useState, useEffect } from 'react';
import { locationsAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import { MapPin, Plus, Star, Navigation, Coffee, Library, Building2 } from 'lucide-react';

// Mock data for initial display
const mockLocations = [
  { id: 1, name: 'Central Library', description: 'Quiet study area with 24/7 access', lat: 40.7128, lng: -74.006, rating: 4.8, type: 'library' },
  { id: 2, name: 'Campus Coffee House', description: 'Great WiFi, cozy atmosphere', lat: 40.7138, lng: -74.008, rating: 4.5, type: 'cafe' },
  { id: 3, name: 'Science Building Study Hall', description: 'Large tables, whiteboard access', lat: 40.7118, lng: -74.004, rating: 4.2, type: 'building' },
  { id: 4, name: 'Student Union', description: 'Group study rooms available', lat: 40.7148, lng: -74.002, rating: 4.6, type: 'building' },
];

const getIcon = (type) => {
  switch (type) {
    case 'library': return Library;
    case 'cafe': return Coffee;
    default: return Building2;
  }
};

const Map = () => {
  const [locations, setLocations] = useState(mockLocations);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    description: '',
    lat: '',
    lng: '',
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await locationsAPI.getAll();
      if (response.data?.length > 0) {
        setLocations(response.data);
      }
    } catch (error) {
      // Keep mock data if API fails
      console.log('Using mock data for locations');
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    
    if (!newLocation.name || !newLocation.description || !newLocation.lat || !newLocation.lng) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await locationsAPI.create({
        ...newLocation,
        lat: parseFloat(newLocation.lat),
        lng: parseFloat(newLocation.lng),
      });
      setLocations([...locations, response.data]);
      toast.success('Location added successfully!');
    } catch (error) {
      // Add to local state even if API fails
      const newLoc = {
        id: Date.now(),
        ...newLocation,
        lat: parseFloat(newLocation.lat),
        lng: parseFloat(newLocation.lng),
        rating: 0,
        type: 'building',
      };
      setLocations([...locations, newLoc]);
      toast.success('Location added locally!');
    }
    
    setNewLocation({ name: '', description: '', lat: '', lng: '' });
    setIsDialogOpen(false);
  };

  const renderStars = (rating) => {
    return (
      <div className=\"flex items-center gap-1\">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
            }`}
          />
        ))}
        <span className=\"ml-1 text-sm font-medium text-slate-600\">{rating}</span>
      </div>
    );
  };

  return (
    <div data-testid=\"map-page\" className=\"min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8\">
      <div className=\"max-w-7xl mx-auto\">
        {/* Header */}
        <div className=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8\">
          <div>
            <h1 className=\"text-4xl font-bold text-slate-900\" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Study Locations
            </h1>
            <p className=\"text-slate-500 mt-1\">Find the perfect spot to study near you</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                data-testid=\"add-location-btn\"
                className=\"bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all\"
              >
                <Plus className=\"w-5 h-5 mr-2\" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className=\"rounded-3xl\">
              <DialogHeader>
                <DialogTitle className=\"text-2xl\" style={{ fontFamily: 'Outfit, sans-serif' }}>Add New Location</DialogTitle>
                <DialogDescription>Share a great study spot with the community</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddLocation} className=\"space-y-4 mt-4\">
                <div className=\"space-y-2\">
                  <Label htmlFor=\"loc-name\">Location Name</Label>
                  <Input
                    id=\"loc-name\"
                    data-testid=\"location-name-input\"
                    placeholder=\"e.g., Main Library 3rd Floor\"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    className=\"rounded-xl\"
                  />
                </div>
                <div className=\"space-y-2\">
                  <Label htmlFor=\"loc-desc\">Description</Label>
                  <Textarea
                    id=\"loc-desc\"
                    data-testid=\"location-desc-input\"
                    placeholder=\"What makes this spot great for studying?\"
                    value={newLocation.description}
                    onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                    className=\"rounded-xl resize-none\"
                    rows={3}
                  />
                </div>
                <div className=\"grid grid-cols-2 gap-4\">
                  <div className=\"space-y-2\">
                    <Label htmlFor=\"loc-lat\">Latitude</Label>
                    <Input
                      id=\"loc-lat\"
                      data-testid=\"location-lat-input\"
                      type=\"number\"
                      step=\"any\"
                      placeholder=\"40.7128\"
                      value={newLocation.lat}
                      onChange={(e) => setNewLocation({ ...newLocation, lat: e.target.value })}
                      className=\"rounded-xl\"
                    />
                  </div>
                  <div className=\"space-y-2\">
                    <Label htmlFor=\"loc-lng\">Longitude</Label>
                    <Input
                      id=\"loc-lng\"
                      data-testid=\"location-lng-input\"
                      type=\"number\"
                      step=\"any\"
                      placeholder=\"-74.0060\"
                      value={newLocation.lng}
                      onChange={(e) => setNewLocation({ ...newLocation, lng: e.target.value })}
                      className=\"rounded-xl\"
                    />
                  </div>
                </div>
                <Button 
                  type=\"submit\" 
                  data-testid=\"submit-location-btn\"
                  className=\"w-full bg-indigo-600 hover:bg-indigo-700 rounded-full\"
                >
                  Add Location
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className=\"grid lg:grid-cols-3 gap-6\">
          {/* Map Placeholder */}
          <div className=\"lg:col-span-2\">
            <Card className=\"border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden\">
              <div 
                data-testid=\"map-container\"
                className=\"relative h-[500px] bg-slate-100 map-placeholder flex items-center justify-center\"
              >
                {/* Mock map markers */}
                <div className=\"absolute inset-0 p-8\">
                  {locations.map((loc, index) => {
                    const Icon = getIcon(loc.type);
                    return (
                      <button
                        key={loc.id}
                        data-testid={`map-marker-${loc.id}`}
                        onClick={() => setSelectedLocation(loc)}
                        className={`absolute transition-all hover:scale-110 ${
                          selectedLocation?.id === loc.id ? 'scale-125 z-10' : ''
                        }`}
                        style={{
                          top: `${20 + (index * 15) % 60}%`,
                          left: `${15 + (index * 20) % 70}%`,
                        }}
                      >
                        <div className={`p-3 rounded-full shadow-lg ${
                          selectedLocation?.id === loc.id 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white text-indigo-600'
                        }`}>
                          <Icon className=\"w-5 h-5\" />
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Map unavailable overlay */}
                <div className=\"text-center z-0\">
                  <div className=\"bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg\">
                    <MapPin className=\"w-12 h-12 text-indigo-400 mx-auto mb-3\" />
                    <p className=\"text-slate-600 font-medium mb-2\">Interactive Map</p>
                    <p className=\"text-slate-400 text-sm mb-4\">Google Maps API key required</p>
                    <Button 
                      variant=\"outline\" 
                      className=\"rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50\"
                    >
                      <Navigation className=\"w-4 h-4 mr-2\" />
                      Enable Location
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Locations List */}
          <div className=\"space-y-4\">
            <h2 className=\"text-xl font-semibold text-slate-900\" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Nearby Spots ({locations.length})
            </h2>
            <div className=\"space-y-3 max-h-[460px] overflow-y-auto pr-2\">
              {locations.map((location) => {
                const Icon = getIcon(location.type);
                return (
                  <Card
                    key={location.id}
                    data-testid={`location-card-${location.id}`}
                    onClick={() => setSelectedLocation(location)}
                    className={`cursor-pointer border-0 shadow-sm hover:shadow-md transition-all rounded-2xl ${
                      selectedLocation?.id === location.id
                        ? 'ring-2 ring-indigo-500 bg-indigo-50'
                        : 'bg-white hover:-translate-y-1'
                    }`}
                  >
                    <CardContent className=\"p-4\">
                      <div className=\"flex items-start gap-3\">
                        <div className={`p-2 rounded-xl ${
                          selectedLocation?.id === location.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          <Icon className=\"w-5 h-5\" />
                        </div>
                        <div className=\"flex-1 min-w-0\">
                          <h3 className=\"font-semibold text-slate-900 truncate\">{location.name}</h3>
                          <p className=\"text-sm text-slate-500 line-clamp-2 mt-1\">{location.description}</p>
                          <div className=\"mt-2\">{renderStars(location.rating)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
"