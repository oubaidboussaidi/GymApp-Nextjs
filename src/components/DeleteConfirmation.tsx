'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteConfirmationProps {
  onDelete: () => Promise<void> | void;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  actionLabel?: string;
}

export default function DeleteConfirmation({
  onDelete,
  title = "Êtes-vous absolument sûr ?",
  description = "Cette action est irréversible. Cela supprimera définitivement cet élément.",
  trigger,
  actionLabel = "Supprimer"
}: DeleteConfirmationProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
      setOpen(false);
    } catch (error) {
      console.error('Erreur suppression:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
            <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
            </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <Button 
            onClick={handleDelete} 
            disabled={loading}
            variant="destructive"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {actionLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
