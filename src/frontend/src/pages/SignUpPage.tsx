import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from '@tanstack/react-router';
import { UserPlus, CheckCircle2, Shield, User } from 'lucide-react';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Redirect authenticated users to home after a brief moment
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate({ to: '/' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.message === 'User is already authenticated') {
        navigate({ to: '/' });
      }
    }
  };

  if (isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">You're Already Signed In!</CardTitle>
              <CardDescription className="text-base">
                You're all set and ready to explore RockHog TV.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg">
                <Link to="/">Continue to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Join RockHog TV
          </h1>
          <p className="text-xl text-muted-foreground">
            Create your account and start streaming in seconds
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                RockHog TV uses Internet Identity, a secure blockchain-based authentication system that protects your privacy and keeps your account safe.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                <User className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Personalized Profile</CardTitle>
              <CardDescription>
                After signing up, you'll be prompted to create your display name and set up your profile. This helps personalize your RockHog TV experience.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-base">
              Click the button below to create your Internet Identity account. The process is quick, secure, and completely free.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button
              onClick={handleSignUp}
              disabled={isLoggingIn}
              size="lg"
              className="gap-2 min-w-[200px]"
            >
              <UserPlus className="w-5 h-5" />
              {isLoggingIn ? 'Creating Account...' : 'Sign Up Now'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/" className="text-primary hover:underline font-medium">
                Log in instead
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">What You'll Get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎬</div>
              <h3 className="font-semibold mb-2">Stream Content</h3>
              <p className="text-sm text-muted-foreground">
                Access thousands of live streams across multiple categories
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎮</div>
              <h3 className="font-semibold mb-2">Play Bacon Ops</h3>
              <p className="text-sm text-muted-foreground">
                Compete in our exclusive game and track your high scores
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📺</div>
              <h3 className="font-semibold mb-2">Create Channels</h3>
              <p className="text-sm text-muted-foreground">
                Start your own streaming channel and build your audience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
