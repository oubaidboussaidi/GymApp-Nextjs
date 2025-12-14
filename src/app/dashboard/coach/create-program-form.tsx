'use client';

import { useState } from 'react';
import { createProgram } from '@/actions/program.actions';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

export default function CreateProgramForm({ coachId }: { coachId: string }) {
  const [open, setOpen] = useState(false);
  const [exercises, setExercises] = useState<{ name: string; sets: number; reps: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10 }]);
  };

  const updateExercise = (index: number, field: string, value: string | number) => {
    const newExercises = [...exercises];
    (newExercises[index] as any)[field] = value;
    setExercises(newExercises);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        level: formData.get('level') as any,
        coachId: coachId as any, // Cast to any to avoid type check on ObjectId vs string
        exercises: exercises,
    };

    try {
        const result = await createProgram(data);
        if (result.success) {
            setOpen(false);
            setExercises([]);
            (e.target as HTMLFormElement).reset();
        } else {
            alert('Failed to create program');
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
        <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Program
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Program</DialogTitle>
          <DialogDescription>
            Design a new training program for your students.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required placeholder="e.g. Hypertrophy 101" />
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Describe the goal of this program..." />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="level">Level</Label>
                <Select name="level" defaultValue="Beginner">
                    <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Exercises</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                        Add Exercise
                    </Button>
                </div>
                <div className="space-y-2">
                    {exercises.map((ex, i) => (
                        <div key={i} className="flex gap-2 items-end border p-2 rounded-md">
                            <div className="flex-1 grid gap-1">
                                <Label className="text-xs">Name</Label>
                                <Input 
                                    value={ex.name} 
                                    onChange={(e) => updateExercise(i, 'name', e.target.value)}
                                    placeholder="Exercise name"
                                    required
                                />
                            </div>
                            <div className="w-20 grid gap-1">
                                <Label className="text-xs">Sets</Label>
                                <Input 
                                    type="number" 
                                    value={ex.sets} 
                                    onChange={(e) => updateExercise(i, 'sets', parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="w-20 grid gap-1">
                                <Label className="text-xs">Reps</Label>
                                <Input 
                                    type="number" 
                                    value={ex.reps} 
                                    onChange={(e) => updateExercise(i, 'reps', parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeExercise(i)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Program'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
