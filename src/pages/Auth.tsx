import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please try again.');
          } else {
            setError(error.message);
          }
        } else {
          toast({
            title: "Welcome back! 🌟",
            description: "You're signed in and ready to plan amazing meals!",
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes('User already registered')) {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setError(error.message);
          }
        } else {
          toast({
            title: "Welcome to your meal planning journey! 🎉",
            description: "Please check your email to confirm your account.",
          });
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@mealplanner.com');
    setPassword('demo123456');
    if (!isLogin) {
      setName('Demo User');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-warm border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back! 💕' : 'Join Our Family! 🌟'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin 
                ? 'Ready to continue your wellness journey?' 
                : 'Start your personalized meal planning adventure!'
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your beautiful name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Your secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In 🌟' : 'Create Account ✨')}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="text-center">
              <Button
                variant="outline"
                onClick={fillDemoCredentials}
                className="text-sm"
              >
                Try Demo Account
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-sm text-muted-foreground"
              >
                {isLogin 
                  ? "Don't have an account? Sign up here!" 
                  : "Already have an account? Sign in here!"
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}