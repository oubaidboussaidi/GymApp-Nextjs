'use client';

import { deleteProgram } from '@/actions/program.actions';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function CoachProgramActions({ programId }: { programId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleDelete = async () => {
        const result = await deleteProgram(programId);
        if (result.success) {
            toast.success('Program deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['coach-programs'] });
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            queryClient.invalidateQueries({ queryKey: ['all-programs'] });
        } else {
            toast.error(result.error || 'Failed to delete program');
        }
    };

    return (
        <DeleteConfirmation 
            onDelete={handleDelete}
            title="Delete Program?"
            description="This will permanently delete the program and remove all enrolled students. This action cannot be undone."
            trigger={
                <Button variant="destructive" size="icon">
                    <Trash2 className="w-4 h-4" />
                </Button>
            }
        />
    );
}
