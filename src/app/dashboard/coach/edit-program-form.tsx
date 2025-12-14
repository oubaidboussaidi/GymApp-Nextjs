'use client';

import { useState } from 'react';
import { updateProgram } from '@/actions/program.actions';
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
import { Pencil, X, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

interface EditProgramFormProps {
  program: {
    _id: string;
    title: string;
    description?: string;
    level: string;
    image?: string;
    exercises?: { name: string; sets: number; reps: number }[];
    coachId?: string | { _id: string };
  };
}

export default function EditProgramForm({ program }: EditProgramFormProps) {
  const [open, setOpen] = useState(false);
  const [exercises, setExercises] = useState(program.exercises || []);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(program.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const coachId = typeof program.coachId === 'object' ? program.coachId._id : program.coachId;

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    let imageUrl: string | undefined = program.image;
    
    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        const uploadData = await res.json();
        if (uploadData.url) {
          imageUrl = uploadData.url;
        }
      } catch (err) {
        console.error('Échec upload', err);
        toast.error('Échec du téléchargement de l\'image');
        setLoading(false);
        return;
      }
    }
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      level: formData.get('level') as any,
      image: imageUrl,
      exercises: exercises,
    };

    try {
      const result = await updateProgram(program._id, data);
      if (result.success) {
        setOpen(false);
        setImageFile(null);
        toast.success('Programme mis à jour avec succès !');
        
        queryClient.invalidateQueries({ queryKey: ['coach-programs', coachId] });
        queryClient.invalidateQueries({ queryKey: ['programs'] });
        queryClient.invalidateQueries({ queryKey: ['all-programs'] });
        queryClient.invalidateQueries({ queryKey: ['coach-analytics'] });
      } else {
        toast.error('Échec de la mise à jour du programme');
      }
    } catch (error) {
      console.error(error);
      toast.error('Une erreur s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le Programme</DialogTitle>
          <DialogDescription>
            Mettez à jour les détails de votre programme d'entraînement.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Thumbnail Upload */}
          <div className="grid gap-2">
            <Label htmlFor="thumbnail">Image du Programme</Label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative h-40 rounded-lg overflow-hidden border">
                  <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Cliquez pour télécharger une image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" name="title" required defaultValue={program.title} />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={program.description || ''} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="level">Niveau</Label>
            <Select name="level" defaultValue={program.level}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Débutant</SelectItem>
                <SelectItem value="Intermediate">Intermédiaire</SelectItem>
                <SelectItem value="Advanced">Avancé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Exercices</Label>
              <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                Ajouter un Exercice
              </Button>
            </div>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div key={i} className="flex gap-2 items-end border p-2 rounded-md">
                  <div className="flex-1 grid gap-1">
                    <Label className="text-xs">Nom</Label>
                    <Input 
                      value={ex.name} 
                      onChange={(e) => updateExercise(i, 'name', e.target.value)}
                      placeholder="Nom de l'exercice"
                      required
                    />
                  </div>
                  <div className="w-20 grid gap-1">
                    <Label className="text-xs">Séries</Label>
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
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
