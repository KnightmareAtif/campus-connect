import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { clubs, events, Club, Event, EventRegistration } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Search, Users, Calendar as CalendarIcon, MapPin, Clock, Heart, HeartOff, UserCheck, Edit, Eye, Send, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const ClubsPage = () => {
  const { user } = useAuth();
  const isClubRole = user?.role === 'club';
  
  const [clubsList, setClubsList] = useState<Club[]>(clubs);
  const [eventsList, setEventsList] = useState<Event[]>(events);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState<Date>();
  const [editTime, setEditTime] = useState('');
  const [editVenue, setEditVenue] = useState('');
  
  const { toast } = useToast();

  const filteredClubs = clubsList.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const followedClubsEvents = eventsList.filter(e => e.isFollowedClub);
  const otherEvents = eventsList.filter(e => !e.isFollowedClub);
  
  // For club role: show their own events
  const clubEvents = isClubRole ? eventsList.filter(e => e.clubId === '1') : []; // Mock: club ID 1

  const handleToggleFollow = (clubId: string) => {
    setClubsList(prev =>
      prev.map(club =>
        club.id === clubId ? { ...club, isFollowing: !club.isFollowing } : club
      )
    );

    const club = clubsList.find(c => c.id === clubId);
    toast({
      title: club?.isFollowing ? 'Unfollowed' : 'Following!',
      description: club?.isFollowing
        ? `You unfollowed ${club.name}`
        : `You're now following ${club?.name}`,
    });
  };

  const handleRegister = (eventId: string) => {
    setEventsList(prev =>
      prev.map(event => {
        if (event.id === eventId) {
          const newRegistration: EventRegistration = {
            id: Date.now().toString(),
            eventId,
            studentId: user?.id || '1',
            studentName: user?.name || 'Current User',
            studentEmail: user?.email || 'user@campus.edu',
            studentAvatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
            registeredAt: new Date(),
          };
          return {
            ...event,
            isRegistered: true,
            registeredStudents: [...(event.registeredStudents || []), newRegistration],
          };
        }
        return event;
      })
    );

    toast({
      title: 'Registered!',
      description: 'You have successfully registered for this event.',
    });
  };

  const handleUnregister = (eventId: string) => {
    setEventsList(prev =>
      prev.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            isRegistered: false,
            registeredStudents: event.registeredStudents?.filter(r => r.studentId !== (user?.id || '1')),
          };
        }
        return event;
      })
    );

    toast({
      title: 'Unregistered',
      description: 'You have been removed from this event.',
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditDescription(event.description);
    setEditDate(event.date);
    setEditTime(event.time);
    setEditVenue(event.venue);
  };

  const handleSaveEvent = () => {
    if (!editingEvent) return;
    
    setEventsList(prev =>
      prev.map(event =>
        event.id === editingEvent.id
          ? {
              ...event,
              title: editTitle,
              description: editDescription,
              date: editDate || event.date,
              time: editTime,
              venue: editVenue,
            }
          : event
      )
    );

    toast({
      title: 'Event Updated',
      description: 'Your event has been updated successfully.',
    });
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEventsList(prev => prev.filter(e => e.id !== eventId));
    toast({
      title: 'Event Deleted',
      description: 'The event has been removed.',
    });
  };

  const ClubCard = ({ club }: { club: Club }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 rounded-xl border-2 border-border">
              <AvatarImage src={club.avatar} alt={club.name} />
              <AvatarFallback className="rounded-xl">{club.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{club.name}</h3>
                  <Badge variant="secondary" className="mt-1">{club.category}</Badge>
                </div>
                <Button
                  size="sm"
                  variant={club.isFollowing ? 'secondary' : 'default'}
                  onClick={() => handleToggleFollow(club.id)}
                  className="shrink-0"
                >
                  {club.isFollowing ? (
                    <>
                      <HeartOff className="mr-1 h-4 w-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <Heart className="mr-1 h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">{club.description}</p>

          <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{club.memberCount} members</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const EventCard = ({ event, showActions = false }: { event: Event; showActions?: boolean }) => (
    <motion.div
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={event.isFollowedClub ? 'border-accent/30 bg-accent/5' : ''}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-accent">{event.clubName}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{event.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              {event.isFollowedClub && !showActions && (
                <Badge className="bg-accent text-accent-foreground">Following</Badge>
              )}
              {event.isRegistered && !showActions && (
                <Badge variant="outline" className="border-status-free text-status-free">
                  <UserCheck className="mr-1 h-3 w-3" />
                  Registered
                </Badge>
              )}
            </div>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>

          <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(event.date, 'EEE, MMM d')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.venue}</span>
            </div>
          </div>

          {/* Student actions */}
          {!showActions && user?.role === 'student' && (
            <div className="mt-4 flex gap-2">
              {event.isRegistered ? (
                <Button variant="outline" size="sm" onClick={() => handleUnregister(event.id)}>
                  Cancel Registration
                </Button>
              ) : (
                <Button size="sm" onClick={() => handleRegister(event.id)}>
                  <UserCheck className="mr-1 h-4 w-4" />
                  Register
                </Button>
              )}
            </div>
          )}

          {/* Club actions */}
          {showActions && (
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedEvent(event);
                  setShowRegistrations(true);
                }}
              >
                <Users className="mr-1 h-4 w-4" />
                {event.registeredStudents?.length || 0} Registered
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">
            {isClubRole ? 'Manage Events' : 'Clubs & Events'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isClubRole ? 'View and manage your club events' : 'Discover campus activities and stay updated'}
          </p>
        </div>

        <Tabs defaultValue={isClubRole ? 'my-events' : 'events'} className="space-y-6">
          <TabsList>
            {isClubRole && <TabsTrigger value="my-events">My Events</TabsTrigger>}
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            {!isClubRole && <TabsTrigger value="clubs">All Clubs</TabsTrigger>}
          </TabsList>

          {/* Club's own events */}
          {isClubRole && (
            <TabsContent value="my-events" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {clubEvents.map(event => (
                  <EventCard key={event.id} event={event} showActions />
                ))}
              </div>
              {clubEvents.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No events posted yet.</p>
                </div>
              )}
            </TabsContent>
          )}

          <TabsContent value="events" className="space-y-4">
            {followedClubsEvents.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
                  From Clubs You Follow
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {followedClubsEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {otherEvents.length > 0 && (
              <div>
                <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
                  Discover More
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {otherEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {!isClubRole && (
            <TabsContent value="clubs" className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search clubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Following */}
              {filteredClubs.filter(c => c.isFollowing).length > 0 && (
                <div>
                  <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
                    Following ({filteredClubs.filter(c => c.isFollowing).length})
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredClubs.filter(c => c.isFollowing).map(club => (
                      <ClubCard key={club.id} club={club} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Clubs */}
              <div>
                <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
                  All Clubs
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredClubs.filter(c => !c.isFollowing).map(club => (
                    <ClubCard key={club.id} club={club} />
                  ))}
                </div>
              </div>

              {filteredClubs.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No clubs found matching your search.</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        {/* Registered Students Dialog */}
        <Dialog open={showRegistrations} onOpenChange={setShowRegistrations}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registered Students</DialogTitle>
              <DialogDescription>
                {selectedEvent?.title} - {selectedEvent?.registeredStudents?.length || 0} registrations
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-3">
                {selectedEvent?.registeredStudents?.map(registration => (
                  <div key={registration.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={registration.studentAvatar} alt={registration.studentName} />
                      <AvatarFallback>{registration.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{registration.studentName}</p>
                      <p className="text-sm text-muted-foreground">{registration.studentEmail}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(registration.registeredAt, 'MMM d')}
                    </p>
                  </div>
                ))}
                {(!selectedEvent?.registeredStudents || selectedEvent.registeredStudents.length === 0) && (
                  <p className="py-8 text-center text-muted-foreground">No registrations yet.</p>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Name</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !editDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editDate ? format(editDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editDate}
                        onSelect={setEditDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-venue">Venue</Label>
                <Input
                  id="edit-venue"
                  value={editVenue}
                  onChange={(e) => setEditVenue(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setEditingEvent(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveEvent} className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default ClubsPage;
