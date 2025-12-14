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
            toast.success('Student removed from program');
            // Invalidate all relevant queries
            queryClient.invalidateQueries({ queryKey: ['program-students'] });
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            queryClient.invalidateQueries({ queryKey: ['coach-programs'] });
            queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
        } else {
            toast.error(result.error || 'Failed to remove student');
        }
    };

    return (
        <DeleteConfirmation 
            onDelete={handleKick}
            title="Kick Student?"
            description="Are you sure you want to remove this student from the program?"
            trigger={
                <Button variant="destructive" size="sm">
                    Kick
                </Button>
            }
        />
    );
}
