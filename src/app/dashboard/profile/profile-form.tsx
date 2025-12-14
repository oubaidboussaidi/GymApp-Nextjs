'use client';

import { useState } from 'react';
import { updateUser, deleteOwnAccount } from '@/actions/user.actions';
import { getUserProfile } from '@/actions/profile.actions';
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
import { Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { signOut, useSession } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileForm({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const { update: updateSession } = useSession();
  
  // Fetch user profile from database for accurate data
  const { data: profileResult, isLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => await getUserProfile(userId),
  });

  const user = profileResult?.success ? profileResult.data : null;
  
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (data.url) {
          const result = await updateUser(userId, { image: data.url });
          if (result.success) {
            toast.success('Photo de profil mise à jour');
            queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            await updateSession();
          } else {
            toast.error('Échec de la mise à jour');
            setPreviewUrl(null);
          }
        }
      } catch (error) {
        console.error('Erreur upload:', error);
        toast.error('Échec du téléchargement');
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string;
    const weight = formData.get('weight') as string;
    const squat = formData.get('squat') as string;
    const bench = formData.get('bench') as string;

    const updateData: any = { name };

    // Build physicalStats object
    const physicalStats: any = {};
    if (weight && !isNaN(parseFloat(weight))) {
      physicalStats.weight = parseFloat(weight);
    }
    if (squat && !isNaN(parseFloat(squat))) {
      physicalStats.squat = parseFloat(squat);
    }
    if (bench && !isNaN(parseFloat(bench))) {
      physicalStats.bench = parseFloat(bench);
    }

    if (Object.keys(physicalStats).length > 0) {
      updateData.physicalStats = physicalStats;
    }

    try {
      const result = await updateUser(userId, updateData);
      if (result.success) {
        toast.success('Profil mis à jour avec succès');
        queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
        queryClient.invalidateQueries({ queryKey: ['current-user'] });
        queryClient.invalidateQueries({ queryKey: ['all-users'] });
        await updateSession();
      } else {
        toast.error(result.error || 'Échec de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Échec de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const result = await deleteOwnAccount(userId);
      if (result.success) {
        toast.success('Compte supprimé avec succès');
        await signOut({ redirectTo: '/' });
      } else {
        toast.error(result.error || 'Échec de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Échec de la suppression');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-96 rounded-xl" />
        </div>
        <div>
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Column - Identity */}
      <div className="lg:col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identité</CardTitle>
          <CardDescription>Mettez à jour vos informations personnelles.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
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
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" defaultValue={user.name || ''} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" defaultValue={user.email || ''} disabled />
                <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié.</p>
              </div>
            </div>

            {/* Physical Stats */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Statistiques Physiques</h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    defaultValue={user.physicalStats?.weight || ''}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="squat">Squat Max (kg)</Label>
                  <Input
                    id="squat"
                    name="squat"
                    type="number"
                    step="2.5"
                    placeholder="100"
                    defaultValue={user.physicalStats?.squat || ''}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bench">Développé Couché (kg)</Label>
                  <Input
                    id="bench"
                    name="bench"
                    type="number"
                    step="2.5"
                    placeholder="80"
                    defaultValue={user.physicalStats?.bench || ''}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>

      {/* Sidebar Column */}
      <div className="space-y-6">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
          <CardDescription>Personnalisez vos préférences visuelles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Thème</p>
              <p className="text-sm text-muted-foreground">Basculer entre mode clair et sombre.</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {user.role !== 'admin' && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Zone Dangereuse</CardTitle>
            <CardDescription>Actions irréversibles pour votre compte.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Supprimer le Compte</p>
                <p className="text-sm text-muted-foreground">Supprime définitivement votre compte.</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deleteLoading}>
                    {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Cela supprimera définitivement votre compte
                      et toutes vos données de nos serveurs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Supprimer le Compte
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
