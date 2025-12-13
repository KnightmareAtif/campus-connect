import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LogOut, 
  Home, 
  Calendar, 
  Users, 
  UsersRound, 
  GraduationCap, 
  PartyPopper,
  Clock,
  PlusCircle,
  Eye,
  History,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
}

const studentLinks = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/timetable', label: 'Timetable', icon: Calendar },
  { to: '/friends', label: 'Friends', icon: Users },
  { to: '/groups', label: 'Groups', icon: UsersRound },
  { to: '/teachers', label: 'Teachers', icon: GraduationCap },
  { to: '/clubs', label: 'Clubs & Events', icon: PartyPopper },
];

const teacherLinks = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/timetable', label: 'My Timetable', icon: Calendar },
  { to: '/office-hours', label: 'Office Hours', icon: Clock },
];

const clubLinks = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/post-event', label: 'Post Event', icon: PlusCircle },
  { to: '/followers', label: 'Followers', icon: Users },
  { to: '/past-events', label: 'Past Events', icon: History },
];

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/admin/users', label: 'Manage Users', icon: Shield },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinks = () => {
    switch (user?.role) {
      case 'student': return studentLinks;
      case 'teacher': return teacherLinks;
      case 'club': return clubLinks;
      case 'admin': return adminLinks;
      default: return [];
    }
  };

  const links = getLinks();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'student': return 'Student';
      case 'teacher': return 'Faculty';
      case 'club': return 'Club';
      case 'admin': return 'Administrator';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden font-display text-xl font-semibold text-foreground sm:inline-block">
                CampusHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === link.to
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden items-center gap-3 md:flex">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
              </div>
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hidden text-muted-foreground hover:text-foreground md:flex"
            >
              <LogOut className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-card md:hidden"
            >
              <div className="container px-4 py-4">
                {/* User Info Mobile */}
                <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  {links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        location.pathname === link.to
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
};
