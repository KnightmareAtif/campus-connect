import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Loader2, User, BookOpen, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import authIllustration from '@/assets/auth-illustration.png';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(signupName, signupEmail, signupPassword, selectedRole);
      toast({
        title: 'Account created!',
        description: 'Welcome to CampusHub.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'Could not create account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'student', label: 'Student', icon: User, description: 'Access timetables, connect with friends' },
    { value: 'teacher', label: 'Teacher', icon: BookOpen, description: 'Manage classes and office hours' },
    { value: 'club', label: 'Club', icon: Users, description: 'Post events and manage followers' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="flex min-h-screen">
        {/* Left Side - Illustration (hidden on mobile) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10"
        >
          {/* Decorative shapes */}
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-info/20 blur-3xl" />
          
          {/* Main illustration */}
          <div className="relative z-10 flex flex-col items-center justify-center p-12 w-full">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              <img 
                src={authIllustration} 
                alt="College students studying together" 
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <h2 className="font-display text-3xl font-bold text-foreground">
                Connect. Learn. Thrive.
              </h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-md">
                Join thousands of students building meaningful connections on campus
              </p>
            </motion.div>
            
            {/* Floating decorative elements */}
            <motion.div 
              className="absolute top-20 right-20 h-4 w-4 rounded-full bg-primary"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-32 left-20 h-6 w-6 rounded-full bg-accent"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute top-1/3 left-1/4 h-3 w-3 rounded-full bg-info"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Right Side - Auth Forms */}
        <div className="flex w-full lg:w-1/2 xl:w-2/5 items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Logo and Title */}
            <div className="mb-8 text-center lg:text-left">
              <div className="mb-4 flex justify-center lg:justify-start">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <GraduationCap className="h-8 w-8" />
                </div>
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                CampusHub
              </h1>
              <p className="mt-2 text-muted-foreground">
                Your all-in-one campus companion
              </p>
            </div>

            {/* Auth Card */}
            <Card className="shadow-elevated border-0 bg-card/80 backdrop-blur">
              <Tabs defaultValue="login" className="w-full">
                <CardContent className="pt-6">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-0">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@campus.edu"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      <Button type="submit" className="w-full h-11" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>

                    <div className="mt-6 rounded-lg bg-muted/50 p-4">
                      <p className="mb-2 text-sm font-medium text-foreground">Demo Accounts:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p><span className="font-medium">Student:</span> student@campus.edu</p>
                        <p><span className="font-medium">Teacher:</span> teacher@campus.edu</p>
                        <p><span className="font-medium">Club:</span> club@campus.edu</p>
                        <p><span className="font-medium">Admin:</span> admin@campus.edu</p>
                        <p className="mt-1"><span className="font-medium">Password:</span> password</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-0">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@campus.edu"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>I am a...</Label>
                        <RadioGroup
                          value={selectedRole}
                          onValueChange={(value) => setSelectedRole(value as UserRole)}
                          className="grid gap-3"
                        >
                          {roleOptions.map((role) => (
                            <Label
                              key={role.value}
                              htmlFor={role.value}
                              className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all ${
                                selectedRole === role.value
                                  ? 'border-primary bg-primary/5 shadow-sm'
                                  : 'border-border hover:bg-secondary/50'
                              }`}
                            >
                              <RadioGroupItem value={role.value} id={role.value} />
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                selectedRole === role.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                              }`}>
                                <role.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{role.label}</p>
                                <p className="text-sm text-muted-foreground">{role.description}</p>
                              </div>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>

                      <Button type="submit" className="w-full h-11" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
