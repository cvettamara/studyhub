"import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  MapPin, 
  ShoppingBag, 
  MessageSquare, 
  Calendar, 
  LogOut, 
  Menu,
  User,
  BookOpen
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/map', label: 'Map', icon: MapPin },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { path: '/forum', label: 'Forum', icon: MessageSquare },
    { path: '/events', label: 'Events', icon: Calendar },
  ];

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated()) return null;

  return (
    <nav 
      data-testid=\"navbar\"
      className=\"fixed top-4 left-4 right-4 h-16 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-lg shadow-slate-200/30 z-50 flex items-center justify-between px-6\"
    >
      {/* Logo */}
      <Link 
        to=\"/map\" 
        data-testid=\"navbar-logo\"
        className=\"flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors\"
      >
        <BookOpen className=\"w-7 h-7\" />
        <span className=\"font-bold text-xl tracking-tight hidden sm:block\" style={{ fontFamily: 'Outfit, sans-serif' }}>
          StudyHub
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className=\"hidden md:flex items-center gap-1\">
        {navLinks.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            data-testid={`nav-${label.toLowerCase()}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              isActive(path)
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <Icon className=\"w-4 h-4\" />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      {/* User Menu */}
      <div className=\"flex items-center gap-3\">
        {/* Desktop User Info */}
        <div className=\"hidden md:flex items-center gap-3\">
          <span className=\"text-sm text-slate-600\">{user?.name || user?.email}</span>
          <Button
            data-testid=\"logout-btn\"
            variant=\"ghost\"
            size=\"sm\"
            onClick={handleLogout}
            className=\"rounded-full text-slate-600 hover:text-red-600 hover:bg-red-50\"
          >
            <LogOut className=\"w-4 h-4 mr-2\" />
            Logout
          </Button>
        </div>

        {/* Mobile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className=\"md:hidden\">
            <Button 
              variant=\"ghost\" 
              size=\"icon\" 
              data-testid=\"mobile-menu-btn\"
              className=\"rounded-full\"
            >
              <Menu className=\"w-5 h-5\" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align=\"end\" className=\"w-56 rounded-2xl p-2\">
            <div className=\"px-3 py-2 text-sm text-slate-600 flex items-center gap-2\">
              <User className=\"w-4 h-4\" />
              {user?.name || user?.email}
            </div>
            <DropdownMenuSeparator />
            {navLinks.map(({ path, label, icon: Icon }) => (
              <DropdownMenuItem 
                key={path} 
                asChild
                className=\"rounded-xl cursor-pointer\"
              >
                <Link to={path} className=\"flex items-center gap-2\">
                  <Icon className=\"w-4 h-4\" />
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              data-testid=\"mobile-logout-btn\"
              className=\"rounded-xl cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50\"
            >
              <LogOut className=\"w-4 h-4 mr-2\" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
"