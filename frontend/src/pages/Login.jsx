"import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/map';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { user, token } = response.data;
      login(user, token);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"min-h-screen bg-slate-50 flex\">
      {/* Left side - Image */}
      <div className=\"hidden lg:flex lg:w-1/2 relative\">
        <img
          src=\"https://images.unsplash.com/photo-1741699427706-7bfb38c716d8\"
          alt=\"Student studying\"
          className=\"absolute inset-0 w-full h-full object-cover\"
        />
        <div className=\"absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80\" />
        <div className=\"relative z-10 flex flex-col justify-center px-16 text-white\">
          <BookOpen className=\"w-16 h-16 mb-6\" />
          <h1 className=\"text-5xl font-bold mb-4\" style={{ fontFamily: 'Outfit, sans-serif' }}>
            StudyHub
          </h1>
          <p className=\"text-xl text-white/90 leading-relaxed max-w-md\">
            Connect with fellow students, find study spots, share resources, and ace your exams together.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
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
              Welcome back
            </CardTitle>
            <CardDescription className=\"text-slate-500\">
              Sign in to continue learning together
            </CardDescription>
          </CardHeader>
          <CardContent className=\"pt-6\">
            <form onSubmit={handleSubmit} className=\"space-y-5\">
              <div className=\"space-y-2\">
                <Label htmlFor=\"email\" className=\"text-slate-700 font-medium\">Email</Label>
                <div className=\"relative\">
                  <Mail className=\"absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400\" />
                  <Input
                    id=\"email\"
                    data-testid=\"login-email\"
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
                    data-testid=\"login-password\"
                    type=\"password\"
                    placeholder=\"Enter your password\"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className=\"pl-11 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500\"
                  />
                </div>
              </div>
              <Button
                type=\"submit\"
                data-testid=\"login-submit\"
                disabled={loading}
                className=\"w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25\"
              >
                {loading ? (
                  <div className=\"w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin\" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className=\"ml-2 w-5 h-5\" />
                  </>
                )}
              </Button>
            </form>
            <div className=\"mt-6 text-center\">
              <p className=\"text-slate-500\">
                Don't have an account?{' '}
                <Link 
                  to=\"/register\" 
                  data-testid=\"register-link\"
                  className=\"text-indigo-600 hover:text-indigo-700 font-medium\"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
"