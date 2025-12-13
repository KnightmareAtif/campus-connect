import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Loader2, User, BookOpen, Users } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary px-4 pb-20 pt-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-96 w-96 rounded-full bg-primary-foreground blur-3xl" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container relative mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur">
              <GraduationCap className="h-9 w-9 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Welcome to CampusHub
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Your all-in-one campus companion. Connect with friends, manage your schedule, 
            discover clubs, and stay updated with campus life.
          </p>
        </motion.div>
      </div>

      {/* Auth Card */}
      <div className="container relative z-10 mx-auto -mt-12 max-w-md px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-elevated">
            <Tabs defaultValue="login" className="w-full">
              <CardHeader className="pb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
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
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
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

                  <div className="mt-6 rounded-lg bg-muted p-4">
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
                            className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                              selectedRole === role.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:bg-secondary'
                            }`}
                          >
                            <RadioGroupItem value={role.value} id={role.value} />
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <role.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{role.label}</p>
                              <p className="text-sm text-muted-foreground">{role.description}</p>
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
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
  );
};

export default AuthPage;
