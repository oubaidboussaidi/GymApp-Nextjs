'use client';

import { kickStudent } from '@/actions/enrollment.actions';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function StudentActions({ enrollmentId }: { enrollmentId: string }) {
    const queryClient = useQueryClient();

    const handleKick = async () => {
        const result = await kickStudent(enrollmentId);
        if (result.success) {
            toast.success('Étudiant retiré du programme');
            queryClient.invalidateQueries({ queryKey: ['program-students'] });
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            queryClient.invalidateQueries({ queryKey: ['coach-programs'] });
            queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
        } else {
            toast.error(result.error || 'Échec du retrait de l\'étudiant');
        }
    };

    return (
        <DeleteConfirmation 
            onDelete={handleKick}
            title="Retirer l'étudiant ?"
            description="Êtes-vous sûr de vouloir retirer cet étudiant du programme ?"
            actionLabel="Retirer"
            trigger={
                <Button variant="destructive" size="sm">
                    Retirer
                </Button>
            }
        />
    );
}
