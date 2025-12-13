import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, UsersRound, GraduationCap, PartyPopper, Clock, PlusCircle, Eye, History, Shield, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { friends, events } from '@/data/mockData';

const StudentDashboard = () => {
  const { user } = useAuth();
  const currentHour = new Date().getHours();
  const isInClass = currentHour >= 9 && currentHour < 17 && currentHour !== 13; // Mock logic
  const freeFriends = friends.filter(f => f.status === 'free').length;
  const upcomingEvents = events.filter(e => e.isFollowedClub).slice(0, 2);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <StatusBadge status={isInClass ? 'busy' : 'free'} size="lg" />
            <p className="text-lg text-muted-foreground">
              {isInClass ? "You're currently in class" : "You're free right now"}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-status-free/20 bg-status-free/5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-free/20">
                <Users className="h-6 w-6 text-status-free" />
              </div>
              <div>
                <p className="text-2xl font-bold text-status-free">{freeFriends}</p>
                <p className="text-sm text-muted-foreground">Friends free now</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Classes today</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                <PartyPopper className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingEvents.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming events</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="My Timetable"
            description="View and manage your weekly schedule"
            icon={Calendar}
            to="/timetable"
            variant="accent"
          />
          <DashboardCard
            title="Friends"
            description="See who's available right now"
            icon={Users}
            to="/friends"
            badge={freeFriends}
          />
          <DashboardCard
            title="Groups"
            description="Your study and project groups"
            icon={UsersRound}
            to="/groups"
          />
          <DashboardCard
            title="Teachers"
            description="Find faculty contact & office hours"
            icon={GraduationCap}
            to="/teachers"
          />
          <DashboardCard
            title="Clubs & Events"
            description="Discover campus activities"
            icon={PartyPopper}
            to="/clubs"
            badge={upcomingEvents.length}
          />
        </div>

        {/* Upcoming Events Preview */}
        {upcomingEvents.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Upcoming Events</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="h-2 bg-accent" />
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-accent">{event.clubName}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{event.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {event.time}
                    </p>
                    <p className="text-sm text-muted-foreground">{event.venue}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Welcome, {user?.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your teaching schedule and office hours
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="My Timetable"
          description="View your teaching schedule"
          icon={Calendar}
          to="/timetable"
          variant="accent"
        />
        <DashboardCard
          title="Office Hours"
          description="Manage when students can visit"
          icon={Clock}
          to="/office-hours"
        />
        <DashboardCard
          title="Student View"
          description="See how students view the platform"
          icon={Eye}
          to="/student-view"
        />
      </div>
    </motion.div>
  );
};

const ClubDashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          {user?.name} Dashboard
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your club events and connect with followers
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Post Event"
          description="Create a new event for your followers"
          icon={PlusCircle}
          to="/post-event"
          variant="accent"
        />
        <DashboardCard
          title="Followers"
          description="View and manage your followers"
          icon={Users}
          to="/followers"
          badge={156}
        />
        <DashboardCard
          title="Past Events"
          description="View your event history"
          icon={History}
          to="/past-events"
        />
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage users and platform settings
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardCard
          title="Manage Users"
          description="View, block, or delete user accounts"
          icon={Shield}
          to="/admin/users"
          variant="accent"
        />
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'club':
        return <ClubDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
};

export default Dashboard;
