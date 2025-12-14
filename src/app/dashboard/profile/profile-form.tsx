'use client';

import { useState } from 'react';
import { updateUser, deleteOwnAccount } from '@/actions/user.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { signOut, useSession } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileForm({ userId }: { userId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, update: updateSession } = useSession();
  const user = session?.user;
  
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview immediately
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Upload immediately
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (data.url) {
          // Update user with new image URL
          const result = await updateUser(userId, { image: data.url });
          if (result.success) {
            toast.success('Profile image updated');
            await updateSession();
          } else {
            toast.error('Failed to update profile image');
            setPreviewUrl(null);
          }
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updateData: any = {
      name: formData.get('name') as string,
    };

    // Only update physicalStats if provided
    const weight = formData.get('weight');
    const squat = formData.get('squat');
    const bench = formData.get('bench');

    if (weight || squat || bench) {
      updateData.physicalStats = {
        weight: weight ? parseFloat(weight as string) : undefined,
        squat: squat ? parseFloat(squat as string) : undefined,
        bench: bench ? parseFloat(bench as string) : undefined,
      };
    }

    try {
      const result = await updateUser(userId, updateData);
      if (result.success) {
        toast.success('Profile updated successfully');
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
        queryClient.invalidateQueries({ queryKey: ['current-user'] });
        queryClient.invalidateQueries({ queryKey: ['all-users'] });
        await updateSession();
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const result = await deleteOwnAccount(userId);
      if (result.success) {
        toast.success('Account deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
        queryClient.invalidateQueries({ queryKey: ['current-user'] });
        queryClient.invalidateQueries({ queryKey: ['all-users'] });
        await signOut({ redirectTo: '/' });
      } else {
        toast.error(result.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Column - Identity */}
      <div className="lg:col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar with clickable upload overlay */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewUrl || user.image || ''} />
                  <AvatarFallback className="text-2xl">{user.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Camera className="h-6 w-6 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={user.name || ''} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" defaultValue={user.email || ''} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
            </div>

            {/* Physical Stats Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Physical Stats</h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="70"
                    defaultValue={(user as any).physicalStats?.weight || ''}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="squat">Squat Max (kg)</Label>
                  <Input
                    id="squat"
                    name="squat"
                    type="number"
                    placeholder="100"
                    defaultValue={(user as any).physicalStats?.squat || ''}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bench">Bench Max (kg)</Label>
                  <Input
                    id="bench"
                    name="bench"
                    type="number"
                    placeholder="80"
                    defaultValue={(user as any).physicalStats?.bench || ''}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>

      {/* Sidebar Column - Settings & Danger Zone */}
      <div className="space-y-6">
      {/* Appearance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize your visual preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone - Only visible to non-admin users */}
      {user.role !== 'admin' && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently remove your account and all data.</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deleteLoading}>
                    {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
