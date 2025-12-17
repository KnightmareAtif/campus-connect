import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { friends, Friend, periodTimes } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Search, UserPlus, Check, X, Clock, Calendar, Mail, Phone, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const FriendsPage = () => {
  const { user } = useAuth();
  const [friendsList, setFriendsList] = useState<Friend[]>(friends);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [pendingRequests] = useState([
    { id: 'p1', name: 'Sarah Connor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 'p2', name: 'John Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  ]);
  
  // User's own contact details
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [myPhone, setMyPhone] = useState('+1 (555) 100-0001');
  const [myEmail, setMyEmail] = useState(user?.email || 'alex.j@campus.edu');
  
  const { toast } = useToast();

  const filteredFriends = friendsList.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const freeFriends = filteredFriends.filter(f => f.status === 'free');
  const busyFriends = filteredFriends.filter(f => f.status === 'busy');
  const offlineFriends = filteredFriends.filter(f => f.status === 'offline');

  const handleAcceptRequest = (requestId: string) => {
    toast({
      title: 'Friend request accepted',
      description: 'You are now connected!',
    });
  };

  const handleRejectRequest = (requestId: string) => {
    toast({
      title: 'Request declined',
    });
  };

  const handleSaveContact = () => {
    toast({
      title: 'Contact Details Updated',
      description: 'Your contact information has been saved.',
    });
    setIsEditingContact(false);
  };

  const FriendCard = ({ friend }: { friend: Friend }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => setSelectedFriend(friend)}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarImage src={friend.avatar} alt={friend.name} />
              <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card ${
                friend.status === 'free' ? 'bg-status-free' :
                friend.status === 'busy' ? 'bg-status-busy' : 'bg-status-offline'
              }`}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{friend.name}</h3>
            {friend.currentActivity && (
              <p className="text-sm text-muted-foreground">{friend.currentActivity}</p>
            )}
          </div>
          <StatusBadge status={friend.status} showLabel />
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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Friends</h1>
            <p className="mt-1 text-muted-foreground">
              {freeFriends.length} friends available now
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Friend
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({friendsList.length})</TabsTrigger>
            <TabsTrigger value="free">Free ({freeFriends.length})</TabsTrigger>
            <TabsTrigger value="requests">Requests ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="my-contact">My Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {/* Free Friends */}
            {freeFriends.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 font-medium text-status-free">
                  <span className="h-2 w-2 rounded-full bg-status-free animate-pulse-soft" />
                  Available Now
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {freeFriends.map(friend => (
                    <FriendCard key={friend.id} friend={friend} />
                  ))}
                </div>
              </div>
            )}

            {/* Busy Friends */}
            {busyFriends.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 font-medium text-status-busy">
                  <span className="h-2 w-2 rounded-full bg-status-busy" />
                  In Class
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {busyFriends.map(friend => (
                    <FriendCard key={friend.id} friend={friend} />
                  ))}
                </div>
              </div>
            )}

            {/* Offline Friends */}
            {offlineFriends.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 font-medium text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-status-offline" />
                  Offline
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {offlineFriends.map(friend => (
                    <FriendCard key={friend.id} friend={friend} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="free">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {freeFriends.map(friend => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <div className="grid gap-3 sm:grid-cols-2">
              {pendingRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.avatar} alt={request.name} />
                      <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{request.name}</h3>
                      <p className="text-sm text-muted-foreground">Wants to connect</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 text-status-free hover:bg-status-free/10"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 text-destructive hover:bg-destructive/10"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Contact Details Tab */}
          <TabsContent value="my-contact">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-display text-xl">{user?.name}</span>
                    <p className="text-sm font-normal text-muted-foreground">Your contact details</p>
                  </div>
                </CardTitle>
                <Button
                  variant={isEditingContact ? 'default' : 'outline'}
                  onClick={() => isEditingContact ? handleSaveContact() : setIsEditingContact(true)}
                >
                  {isEditingContact ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  These details are only visible to your friends and teachers.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="my-phone">Phone Number</Label>
                    {isEditingContact ? (
                      <Input
                        id="my-phone"
                        value={myPhone}
                        onChange={(e) => setMyPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{myPhone || 'Not set'}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="my-email">Contact Email</Label>
                    {isEditingContact ? (
                      <Input
                        id="my-email"
                        type="email"
                        value={myEmail}
                        onChange={(e) => setMyEmail(e.target.value)}
                        placeholder="your.email@campus.edu"
                      />
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{myEmail || 'Not set'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Friend Details Dialog */}
        <Dialog open={!!selectedFriend} onOpenChange={() => setSelectedFriend(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedFriend?.avatar} alt={selectedFriend?.name} />
                  <AvatarFallback>{selectedFriend?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-display">{selectedFriend?.name}</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedFriend?.status || 'offline'} showLabel />
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {selectedFriend?.currentActivity && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Currently at</p>
                  <p className="font-medium text-foreground">{selectedFriend.currentActivity}</p>
                </div>
              )}

              {/* Contact Details - Visible to friends */}
              {(selectedFriend?.phone || selectedFriend?.email) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedFriend?.email && (
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a href={`mailto:${selectedFriend.email}`} className="text-sm font-medium text-primary hover:underline">
                          {selectedFriend.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedFriend?.phone && (
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{selectedFriend.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h4 className="mb-2 flex items-center gap-2 font-medium text-foreground">
                  <Clock className="h-4 w-4" />
                  Next Available
                </h4>
                <p className="text-muted-foreground">{selectedFriend?.nextFreeTime || 'Unknown'}</p>
              </div>

              <div>
                <h4 className="mb-2 flex items-center gap-2 font-medium text-foreground">
                  <Calendar className="h-4 w-4" />
                  Free Periods Today
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFriend?.freePeriodsToday.map(period => (
                    <span
                      key={period}
                      className="rounded-full bg-status-free/10 px-3 py-1 text-sm font-medium text-status-free"
                    >
                      Period {period}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default FriendsPage;
