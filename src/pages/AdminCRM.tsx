import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Search, Mail, Building2, Phone, Briefcase, 
  Calendar, MessageSquare, Plus, X, ChevronLeft, Trash2
} from "lucide-react";
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  company: string | null;
  phone: string | null;
  job_title: string | null;
  created_at: string;
  updated_at: string;
}

interface CRMNote {
  id: string;
  profile_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
}

const AdminCRM = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState<CRMNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      fetchNotes(selectedProfile.id);
    }
  }, [selectedProfile]);

  const fetchProfiles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive",
      });
    } else {
      setProfiles(data || []);
    }
    setIsLoading(false);
  };

  const fetchNotes = async (profileId: string) => {
    const { data, error } = await supabase
      .from('crm_notes')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data || []);
    }
  };

  const addNote = async () => {
    if (!selectedProfile || !newNote.trim()) return;

    setIsAddingNote(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('crm_notes')
      .insert({
        profile_id: selectedProfile.id,
        note: newNote.trim(),
        created_by: user?.id || null,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Note added successfully",
      });
      setNewNote('');
      fetchNotes(selectedProfile.id);
    }
    setIsAddingNote(false);
  };

  const deleteNote = async (noteId: string) => {
    const { error } = await supabase
      .from('crm_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Note deleted",
      });
      if (selectedProfile) {
        fetchNotes(selectedProfile.id);
      }
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const query = searchQuery.toLowerCase();
    return (
      (profile.full_name?.toLowerCase().includes(query) || false) ||
      profile.email.toLowerCase().includes(query) ||
      (profile.company?.toLowerCase().includes(query) || false)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-8 w-8 text-highlight-blue" />
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <Badge variant="secondary" className="ml-2">
            {profiles.length} Users
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Users</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : filteredProfiles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No users found' : 'No users yet'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredProfiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => setSelectedProfile(profile)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedProfile?.id === profile.id
                            ? 'bg-highlight-blue/20 border border-highlight-blue'
                            : 'bg-muted/50 hover:bg-muted border border-transparent'
                        }`}
                      >
                        <div className="font-medium truncate">
                          {profile.full_name || 'No Name'}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {profile.email}
                        </div>
                        {profile.company && (
                          <div className="text-xs text-muted-foreground mt-1 truncate">
                            {profile.company}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* User Details & Notes */}
          <div className="lg:col-span-2">
            {selectedProfile ? (
              <div className="space-y-6">
                {/* Profile Details */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-lg">User Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProfile(null)}
                      className="lg:hidden"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-highlight-blue/20 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-highlight-blue" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Email</div>
                          <div className="font-medium">{selectedProfile.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-highlight-blue/20 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-highlight-blue" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Company</div>
                          <div className="font-medium">{selectedProfile.company || '-'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-highlight-blue/20 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-highlight-blue" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Phone</div>
                          <div className="font-medium">{selectedProfile.phone || '-'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-highlight-blue/20 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-highlight-blue" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Job Title</div>
                          <div className="font-medium">{selectedProfile.job_title || '-'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-highlight-blue/20 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-highlight-blue" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Joined</div>
                          <div className="font-medium">
                            {format(new Date(selectedProfile.created_at), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Add Note Form */}
                    <div className="mb-4">
                      <Textarea
                        placeholder="Add a note about this user..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="mb-2"
                        rows={3}
                      />
                      <Button
                        onClick={addNote}
                        disabled={isAddingNote || !newNote.trim()}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {isAddingNote ? 'Adding...' : 'Add Note'}
                      </Button>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-3">
                      {notes.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No notes yet
                        </div>
                      ) : (
                        notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-3 bg-muted/50 rounded-lg border"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <p className="text-sm flex-1">{note.note}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteNote(note.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select a user to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCRM;