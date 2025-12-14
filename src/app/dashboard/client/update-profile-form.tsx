'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateUser } from '@/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export default function UpdateStatsForm({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { update: updateSession } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const weight = formData.get('weight') as string;
    const squat = formData.get('squat') as string;
    const bench = formData.get('bench') as string;
    
    const physicalStats: { weight?: number; squat?: number; bench?: number } = {};
    
    if (weight && !isNaN(parseFloat(weight))) {
      physicalStats.weight = parseFloat(weight);
    }
    if (squat && !isNaN(parseFloat(squat))) {
      physicalStats.squat = parseFloat(squat);
    }
    if (bench && !isNaN(parseFloat(bench))) {
      physicalStats.bench = parseFloat(bench);
    }

    if (Object.keys(physicalStats).length === 0) {
      toast.error('Veuillez remplir au moins un champ');
      setLoading(false);
      return;
    }

    const userId = user.id || user._id;
    
    if (!userId) {
      toast.error('ID utilisateur manquant');
      setLoading(false);
      return;
    }

    try {
        const result = await updateUser(userId, { physicalStats });
        if (result.success) {
            setOpen(false);
            toast.success('Statistiques mises à jour !');
            // Invalidate all user-related queries
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            // Update session to sync with new data
            await updateSession();
        } else {
            toast.error(result.error || 'Échec de la mise à jour');
        }
    } catch (error) {
        console.error('Update stats error:', error);
        toast.error('Une erreur s\'est produite');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Mise à Jour Rapide
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mettre à Jour les Stats</DialogTitle>
          <DialogDescription>
            Mettez rapidement à jour vos performances. Pour le nom et la photo, rendez-vous sur la page Profil.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input 
                      id="weight" 
                      name="weight" 
                      type="number" 
                      step="0.1" 
                      defaultValue={user.physicalStats?.weight || ''} 
                      placeholder="70"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="squat">Squat (kg)</Label>
                    <Input 
                      id="squat" 
                      name="squat" 
                      type="number" 
                      step="2.5" 
                      defaultValue={user.physicalStats?.squat || ''} 
                      placeholder="100"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="bench">Développé (kg)</Label>
                    <Input 
                      id="bench" 
                      name="bench" 
                      type="number" 
                      step="2.5" 
                      defaultValue={user.physicalStats?.bench || ''} 
                      placeholder="80"
                    />
                </div>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
