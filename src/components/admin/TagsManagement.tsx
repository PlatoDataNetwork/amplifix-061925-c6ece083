import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tags, Plus, Trash2, Search, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const TagsManagementInline = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTag, setNewTag] = useState({ name: '', slug: '' });

  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags-management', search],
    queryFn: async () => {
      let query = supabase.from('tags').select('*').order('name');
      if (search) query = query.ilike('name', `%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const addTag = useMutation({
    mutationFn: async () => {
      const slug = newTag.slug || newTag.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { error } = await supabase.from('tags').insert({ name: newTag.name, slug });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags-management'] });
      toast.success('Tag created');
      setIsAddOpen(false);
      setNewTag({ name: '', slug: '' });
    },
    onError: (err) => toast.error(`Failed: ${err.message}`),
  });

  const deleteTag = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tags').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags-management'] });
      toast.success('Tag deleted');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tags</h2>
          <p className="text-muted-foreground">{tags?.length || 0} tags</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> New Tag</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Tag</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newTag.name} onChange={(e) => setNewTag({ ...newTag, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Slug (auto-generated if empty)</Label>
                <Input value={newTag.slug} onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })} placeholder={newTag.name.toLowerCase().replace(/\s+/g, '-')} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => addTag.mutate()} disabled={!newTag.name || addTag.isPending}>
                {addTag.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search tags..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <div className="divide-y">
              {tags?.map((tag) => (
                <div key={tag.id} className="flex items-center gap-3 p-3">
                  <Tags className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium flex-1">{tag.name}</span>
                  <Badge variant="outline">{tag.slug}</Badge>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                        <AlertDialogDescription>Delete "{tag.name}"? Article associations will be removed.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTag.mutate(tag.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
              {!tags?.length && (
                <div className="p-8 text-center text-muted-foreground">
                  <Tags className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No tags found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TagsManagementInline;
