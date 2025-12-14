'use client';

import { useState } from 'react';
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
import { Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UpdateStatsForm({ user }: { user: any }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
        physicalStats: {
            weight: parseFloat(formData.get('weight') as string),
            squat: parseFloat(formData.get('squat') as string),
            bench: parseFloat(formData.get('bench') as string),
        }
    };

    try {
        const result = await updateUser(user.id, data);
        if (result.success) {
            setOpen(false);
            router.refresh();
        } else {
            alert('Failed to update stats');
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Quick Update Stats
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Physical Stats</DialogTitle>
          <DialogDescription>
            Quickly update your lifting stats. For name and profile picture changes, visit your Profile page.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" name="weight" type="number" step="0.1" defaultValue={user.physicalStats?.weight} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="squat">Squat (kg)</Label>
                    <Input id="squat" name="squat" type="number" step="2.5" defaultValue={user.physicalStats?.squat} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="bench">Bench (kg)</Label>
                    <Input id="bench" name="bench" type="number" step="2.5" defaultValue={user.physicalStats?.bench} required />
                </div>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Stats'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
