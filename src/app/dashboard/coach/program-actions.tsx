'use client';

import { deleteProgram } from '@/actions/program.actions';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function CoachProgramActions({ programId }: { programId: string }) {
    const queryClient = useQueryClient();

    const handleDelete = async () => {
        const result = await deleteProgram(programId);
        if (result.success) {
            toast.success('Programme supprimé avec succès');
            queryClient.invalidateQueries({ queryKey: ['coach-programs'] });
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            queryClient.invalidateQueries({ queryKey: ['all-programs'] });
        } else {
            toast.error(result.error || 'Échec de la suppression du programme');
        }
    };

    return (
        <DeleteConfirmation 
            onDelete={handleDelete}
            title="Supprimer le programme ?"
            description="Cela supprimera définitivement le programme et retirera tous les étudiants inscrits. Cette action est irréversible."
            actionLabel="Supprimer"
            trigger={
                <Button variant="destructive" size="icon">
                    <Trash2 className="w-4 h-4" />
                </Button>
            }
        />
    );
}
