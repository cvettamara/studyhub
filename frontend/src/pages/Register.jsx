"import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { BookOpen, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register(name, email, password);
      const { user, token } = response.data;
      login(user, token);
      toast.success('Welcome to StudyHub!');
      navigate('/map');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"min-h-screen bg-slate-50 flex\">
      {/* Left side - Form */}
      <div className=\"flex-1 flex items-center justify-center p-8\">
        <Card className=\"w-full max-w-md border-0 shadow-xl shadow-slate-200/50 rounded-3xl\">
          <CardHeader className=\"text-center pb-2\">
            <div className=\"flex items-center justify-center gap-2 mb-4 lg:hidden\">
              <BookOpen className=\"w-8 h-8 text-indigo-600\" />
              <span className=\"text-2xl font-bold text-indigo-600\" style={{ fontFamily: 'Outfit, sans-serif' }}>
                StudyHub
              </span>
            </div>
            <CardTitle className=\"text-3xl font-bold\" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Join StudyHub
            </CardTitle>
            <CardDescription className=\"text-slate-500\">
              Create an account to start collaborating
            </CardDescription>
          </CardHeader>
          <CardContent className=\"pt-6\">
            <form onSubmit={handleSubmit} className=\"space-y-5\">
              <div className=\"space-y-2\">
                <Label htmlFor=\"name\" className=\"text-slate-700 font-medium\">Full Name</Label>
                <div className=\"relative\">
                  <User className=\"absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400\" />
                  <Input
                    id=\"name\"
                    data-testid=\"register-name\"
                    type=\"text\"
                    placeholder=\"John Doe\"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className=\"pl-11 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500\"
                  />
                </div>
              </div>
              <div className=\"space-y-2\">
                <Label htmlFor=\"email\" className=\"text-slate-700 font-medium\">Email</Label>
                <div className=\"relative\">
                  <Mail className=\"absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400\" />
                  <Input
                    id=\"email\"
                    data-testid=\"register-email\"
                    type=\"email\"
                    placeholder=\"you@university.edu\"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className=\"pl-11 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500\"
                  />
                </div>
              </div>
              <div className=\"space-y-2\">
                <Label htmlFor=\"password\" className=\"text-slate-700 font-medium\">Password</Label>
                <div className=\"relative\">
                  <Lock className=\"absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400\" />
                  <Input
                    id=\"password\"
                    data-testid=\"register-password\"
                    type=\"password\"
                    placeholder=\"Create a password\"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className=\"pl-11 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500\"
                  />
                </div>
                <p className=\"text-xs text-slate-400\">Must be at least 6 characters</p>
              </div>
              <Button
                type=\"submit\"
                data-testid=\"register-submit\"
                disabled={loading}
                className=\"w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25\"
              >
                {loading ? (
                  <div className=\"w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin\" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className=\"ml-2 w-5 h-5\" />
                  </>
                )}
              </Button>
            </form>
            <div className=\"mt-6 text-center\">
              <p className=\"text-slate-500\">
                Already have an account?{' '}
                <Link 
                  to=\"/login\" 
                  data-testid=\"login-link\"
                  className=\"text-indigo-600 hover:text-indigo-700 font-medium\"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Image */}
      <div className=\"hidden lg:flex lg:w-1/2 relative\">
        <img
          src=\"https://images.pexels.com/photos/6283211/pexels-photo-6283211.jpeg\"
          alt=\"Students collaborating\"
          className=\"absolute inset-0 w-full h-full object-cover\"
        />
        <div className=\"absolute inset-0 bg-gradient-to-l from-indigo-600/80 to-teal-500/80\" />
        <div className=\"relative z-10 flex flex-col justify-center px-16 text-white\">
          <BookOpen className=\"w-16 h-16 mb-6\" />
          <h1 className=\"text-5xl font-bold mb-4\" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Learn Together
          </h1>
          <p className=\"text-xl text-white/90 leading-relaxed max-w-md\">
            Join thousands of students who are already collaborating, sharing resources, and achieving their academic goals.
          </p>
          <div className=\"mt-8 flex items-center gap-6\">
            <div className=\"text-center\">
              <div className=\"text-3xl font-bold\">10k+</div>
              <div className=\"text-white/70 text-sm\">Students</div>
            </div>
            <div className=\"w-px h-12 bg-white/30\" />
            <div className=\"text-center\">
              <div className=\"text-3xl font-bold\">500+</div>
              <div className=\"text-white/70 text-sm\">Study Spots</div>
            </div>
            <div className=\"w-px h-12 bg-white/30\" />
            <div className=\"text-center\">
              <div className=\"text-3xl font-bold\">2k+</div>
              <div className=\"text-white/70 text-sm\">Resources</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
"