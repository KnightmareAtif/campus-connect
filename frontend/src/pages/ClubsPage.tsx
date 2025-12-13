import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { clubs, events, Club, Event } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Search, Users, Calendar, MapPin, Clock, Heart, HeartOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ClubsPage = () => {
  const [clubsList, setClubsList] = useState<Club[]>(clubs);
  const [eventsList] = useState<Event[]>(events);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredClubs = clubsList.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const followedClubsEvents = eventsList.filter(e => e.isFollowedClub);
  const otherEvents = eventsList.filter(e => !e.isFollowedClub);
  const sortedEvents = [...followedClubsEvents, ...otherEvents];

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

  const EventCard = ({ event }: { event: Event }) => (
    <motion.div
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={event.isFollowedClub ? 'border-accent/30 bg-accent/5' : ''}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-accent">{event.clubName}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{event.title}</h3>
            </div>
            {event.isFollowedClub && (
              <Badge className="bg-accent text-accent-foreground">Following</Badge>
            )}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>

          <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
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
          <h1 className="font-display text-3xl font-bold text-foreground">Clubs & Events</h1>
          <p className="mt-1 text-muted-foreground">
            Discover campus activities and stay updated
          </p>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="clubs">All Clubs</TabsTrigger>
          </TabsList>

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
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default ClubsPage;
