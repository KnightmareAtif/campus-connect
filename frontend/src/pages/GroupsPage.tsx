import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { groups, groupMessages, friends, Group, Message } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Plus, Users, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const GroupsPage = () => {
  const [groupsList, setGroupsList] = useState<Group[]>(groups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>(groupMessages);
  const [newMessage, setNewMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState<'study' | 'project'>('study');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      type: newGroupType,
      members: [friends[0], friends[1]],
      membersOnline: 2,
    };

    setGroupsList([...groupsList, newGroup]);
    setNewGroupName('');
    setIsCreateDialogOpen(false);
    toast({
      title: 'Group created!',
      description: `${newGroupName} has been created successfully.`,
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

  const getGroupMessages = (groupId: string) => {
    return messages.filter(m => m.groupId === groupId);
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
                {group.members.slice(0, 3).map((member, idx) => (
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
            <DialogContent>
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5" />
                {selectedGroup?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex h-[400px] flex-col">
              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
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
              </div>

              {/* Input */}
              <div className="flex gap-2 border-t border-border p-4">
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
      </motion.div>
    </DashboardLayout>
  );
};

export default GroupsPage;
