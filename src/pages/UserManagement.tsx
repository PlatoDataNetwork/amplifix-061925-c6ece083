import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, UserCog, User, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Get all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Build a map of user_id to roles
      const userRolesMap: Record<string, string[]> = {};
      rolesData?.forEach(({ user_id, role }) => {
        if (!userRolesMap[user_id]) {
          userRolesMap[user_id] = [];
        }
        userRolesMap[user_id].push(role);
      });

      // Get all users from auth (via edge function or admin API)
      // Since we can't directly query auth.users, we'll use the users we have roles for
      // and get their email from the metadata
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        console.error('Error fetching users:', authError);
        // Fallback: just show users we have roles for
        const usersWithRoles = Object.entries(userRolesMap).map(([userId, roles]) => ({
          id: userId,
          email: 'Email not available',
          created_at: new Date().toISOString(),
          last_sign_in_at: null,
          roles,
        }));
        setUsers(usersWithRoles);
      } else {
        // Combine auth users with their roles
        const allUsers: UserWithRole[] = authUsers.map(user => ({
          id: user.id,
          email: user.email || 'No email',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at || null,
          roles: userRolesMap[user.id] || [],
        }));
        setUsers(allUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    setProcessingUser(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });

      if (error) throw error;

      toast.success(`Role "${role}" assigned successfully`);
      await loadUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    } finally {
      setProcessingUser(null);
    }
  };

  const removeRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    setProcessingUser(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast.success(`Role "${role}" removed successfully`);
      await loadUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    } finally {
      setProcessingUser(null);
    }
  };

  const confirmDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    setProcessingUser(userToDelete);
    try {
      // Delete user via admin API
      const { error } = await supabase.auth.admin.deleteUser(userToDelete);

      if (error) throw error;

      toast.success('User deleted successfully');
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setProcessingUser(null);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'moderator':
        return <UserCog className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      <div className="pt-24 container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage users, assign roles, and control permissions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {users.filter(u => u.roles.includes('admin')).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Moderators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {users.filter(u => u.roles.includes('moderator')).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Regular Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {users.filter(u => u.roles.includes('user')).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Sign In</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 flex-wrap">
                            {user.roles.length > 0 ? (
                              user.roles.map((role) => (
                                <Badge
                                key={role}
                                  variant={getRoleBadgeVariant(role)}
                                  className="flex items-center gap-1 cursor-pointer hover:opacity-80"
                                  onClick={() => removeRole(user.id, role as 'admin' | 'moderator' | 'user')}
                                  title="Click to remove"
                                >
                                  {getRoleIcon(role)}
                                  {role}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">No roles</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.last_sign_in_at
                            ? new Date(user.last_sign_in_at).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Select
                              disabled={processingUser === user.id}
                              onValueChange={(value: 'admin' | 'moderator' | 'user') => assignRole(user.id, value)}
                            >
                              <SelectTrigger className="w-[140px] h-8">
                                <SelectValue placeholder="Add role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => confirmDeleteUser(user.id)}
                              disabled={processingUser === user.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Role Permissions:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-destructive" />
                <strong>Admin:</strong> Full access to all features including user management and article imports
              </li>
              <li className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <strong>Moderator:</strong> Can import articles but cannot manage users
              </li>
              <li className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <strong>User:</strong> Basic access to view content
              </li>
            </ul>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUser} className="bg-destructive text-destructive-foreground">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default UserManagement;
