import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { groups, groupMessages, friends, Group, Message, Friend } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Plus, Users, Send, MessageSquare, UserPlus, UserMinus, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const POLL_INTERVAL = 5000; // Poll for new messages every 5 seconds

const GroupsPage = () => {
  const [groupsList, setGroupsList] = useState<Group[]>(groups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>(groupMessages);
  const [newMessage, setNewMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState<'study' | 'project'>('study');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedGroup]);

  // Simulate polling for new messages
  useEffect(() => {
    if (!selectedGroup) return;

    const interval = setInterval(() => {
      // In real implementation, this would fetch from API
      // For demo, we'll just keep existing messages
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedGroup]);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    const selectedMembers = friends.filter(f => selectedFriends.includes(f.id));
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      type: newGroupType,
      members: [...selectedMembers, friends[0]], // Include "me" as first member
      membersOnline: selectedMembers.filter(m => m.status !== 'offline').length + 1,
    };

    setGroupsList([...groupsList, newGroup]);
    setNewGroupName('');
    setSelectedFriends([]);
    setIsCreateDialogOpen(false);
    toast({
      title: 'Group created!',
      description: `${newGroupName} has been created with ${selectedMembers.length + 1} members.`,
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const message: Message = {
      id: Date.now().toString(),
      groupId: selectedGroup.id,
      senderId: 'me',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleAddMember = (friendId: string) => {
    if (!selectedGroup) return;
    
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    setGroupsList(prev => prev.map(g => {
      if (g.id === selectedGroup.id && !g.members.find(m => m.id === friendId)) {
        return { ...g, members: [...g.members, friend] };
      }
      return g;
    }));

    setSelectedGroup(prev => prev ? {
      ...prev,
      members: prev.members.find(m => m.id === friendId) ? prev.members : [...prev.members, friend]
    } : null);

    toast({
      title: 'Member added',
      description: `${friend.name} has been added to the group.`,
    });
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedGroup) return;

    const member = selectedGroup.members.find(m => m.id === memberId);
    
    setGroupsList(prev => prev.map(g => {
      if (g.id === selectedGroup.id) {
        return { ...g, members: g.members.filter(m => m.id !== memberId) };
      }
      return g;
    }));

    setSelectedGroup(prev => prev ? {
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    } : null);

    toast({
      title: 'Member removed',
      description: `${member?.name} has been removed from the group.`,
    });
  };

  const getGroupMessages = (groupId: string) => {
    return messages.filter(m => m.groupId === groupId);
  };

  const getNonMembers = () => {
    if (!selectedGroup) return friends;
    const memberIds = selectedGroup.members.map(m => m.id);
    return friends.filter(f => !memberIds.includes(f.id));
  };

  const GroupCard = ({ group }: { group: Group }) => {
    const freeMembers = group.members.filter(m => m.status === 'free').length;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => setSelectedGroup(group)}
        >
          <CardContent className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  group.type === 'study' ? 'bg-info/10 text-info' : 'bg-accent/20 text-accent'
                }`}>
                  {group.type === 'study' ? 'Study Group' : 'Project Team'}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{group.name}</h3>
              </div>
              <div className="flex -space-x-2">
                {group.members.slice(0, 3).map((member) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-card">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {group.members.length > 3 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
                    +{group.members.length - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{group.members.length} members</span>
              </div>
              <span className="font-medium text-status-free">{freeMembers} free now</span>
            </div>

            {group.lastMessage && (
              <div className="mt-3 rounded-lg bg-muted/50 p-2">
                <p className="truncate text-sm text-muted-foreground">
                  <span className="font-medium">{group.lastMessage.sender}:</span> {group.lastMessage.content}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Groups</h1>
            <p className="mt-1 text-muted-foreground">
              Collaborate with your study and project teams
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="e.g., Math Study Group"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Group Type</Label>
                  <Select value={newGroupType} onValueChange={(v: 'study' | 'project') => setNewGroupType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">Study Group</SelectItem>
                      <SelectItem value="project">Project Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Add Friends</Label>
                  <ScrollArea className="h-48 rounded-md border p-3">
                    {friends.map(friend => (
                      <div key={friend.id} className="flex items-center gap-3 py-2">
                        <Checkbox
                          id={`friend-${friend.id}`}
                          checked={selectedFriends.includes(friend.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedFriends([...selectedFriends, friend.id]);
                            } else {
                              setSelectedFriends(selectedFriends.filter(id => id !== friend.id));
                            }
                          }}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{friend.name}</p>
                          <p className={`text-xs ${
                            friend.status === 'free' ? 'text-status-free' :
                            friend.status === 'busy' ? 'text-status-busy' : 'text-muted-foreground'
                          }`}>
                            {friend.status === 'free' ? 'Available' : friend.status === 'busy' ? 'Busy' : 'Offline'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  <p className="text-xs text-muted-foreground">
                    {selectedFriends.length} friend(s) selected
                  </p>
                </div>
                <Button className="w-full" onClick={handleCreateGroup}>
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Groups Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groupsList.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>

        {/* Group Chat Dialog */}
        <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
          <DialogContent className="max-w-2xl h-[600px] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5" />
                  {selectedGroup?.name}
                </DialogTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsManageMembersOpen(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Members
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-1">
                  {selectedGroup?.members.slice(0, 5).map(member => (
                    <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {selectedGroup?.members.length} members
                </span>
              </div>
            </DialogHeader>

            <div className="flex-1 flex flex-col min-h-0">
              {/* Messages */}
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 py-4">
                  {selectedGroup && getGroupMessages(selectedGroup.id).map(message => (
                    <div
                      key={message.id}
                      className={`flex flex-col ${message.senderId === 'me' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.senderId === 'me'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.senderId !== 'me' && (
                          <p className="mb-1 text-xs font-medium opacity-70">{message.senderName}</p>
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="mt-1 text-xs text-muted-foreground">
                        {format(message.timestamp, 'h:mm a')}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex-shrink-0 flex gap-2 border-t border-border p-4">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Members Dialog */}
        <Dialog open={isManageMembersOpen} onOpenChange={setIsManageMembersOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Members</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="current" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">Current ({selectedGroup?.members.length})</TabsTrigger>
                <TabsTrigger value="add">Add New</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="mt-4">
                <ScrollArea className="h-64">
                  {selectedGroup?.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className={`text-xs ${
                            member.status === 'free' ? 'text-status-free' :
                            member.status === 'busy' ? 'text-status-busy' : 'text-muted-foreground'
                          }`}>
                            {member.status}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="add" className="mt-4">
                <ScrollArea className="h-64">
                  {getNonMembers().length > 0 ? (
                    getNonMembers().map(friend => (
                      <div key={friend.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{friend.name}</p>
                            <p className={`text-xs ${
                              friend.status === 'free' ? 'text-status-free' :
                              friend.status === 'busy' ? 'text-status-busy' : 'text-muted-foreground'
                            }`}>
                              {friend.status}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary"
                          onClick={() => handleAddMember(friend.id)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      All your friends are already in this group
                    </p>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default GroupsPage;
