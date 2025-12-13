import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminUsers, AdminUser } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Search, Shield, Ban, Trash2, MoreHorizontal, CheckCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionType, setActionType] = useState<'block' | 'delete' | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleBlockUser = () => {
    if (!selectedUser) return;

    setUsers(prev =>
      prev.map(user =>
        user.id === selectedUser.id
          ? { ...user, status: user.status === 'blocked' ? 'active' : 'blocked' }
          : user
      )
    );

    toast({
      title: selectedUser.status === 'blocked' ? 'User unblocked' : 'User blocked',
      description: `${selectedUser.name} has been ${selectedUser.status === 'blocked' ? 'unblocked' : 'blocked'}.`,
    });

    setSelectedUser(null);
    setActionType(null);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));

    toast({
      title: 'User deleted',
      description: `${selectedUser.name} has been removed from the platform.`,
    });

    setSelectedUser(null);
    setActionType(null);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'teacher': return 'secondary';
      case 'student': return 'outline';
      case 'club': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">Manage Users</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all platform users
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="club">Clubs</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.status === 'active' ? 'bg-status-free' : 'bg-destructive'
                            }`}
                          />
                          <span className="capitalize text-sm">{user.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(user.joinedDate, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.role !== 'admin' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionType('block');
                                }}
                              >
                                {user.status === 'blocked' ? (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Unblock User
                                  </>
                                ) : (
                                  <>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Block User
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionType('delete');
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No users found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'block'
                  ? selectedUser?.status === 'blocked'
                    ? 'Unblock User'
                    : 'Block User'
                  : 'Delete User'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'block'
                  ? selectedUser?.status === 'blocked'
                    ? `Are you sure you want to unblock ${selectedUser?.name}? They will regain access to the platform.`
                    : `Are you sure you want to block ${selectedUser?.name}? They will not be able to access the platform.`
                  : `Are you sure you want to permanently delete ${selectedUser?.name}? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionType(null)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'delete' ? 'destructive' : 'default'}
                onClick={actionType === 'block' ? handleBlockUser : handleDeleteUser}
              >
                {actionType === 'block'
                  ? selectedUser?.status === 'blocked'
                    ? 'Unblock'
                    : 'Block'
                  : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
