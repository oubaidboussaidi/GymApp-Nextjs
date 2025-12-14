'use client';

import { deleteProgram } from '@/actions/program.actions';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CoachProgramActions({ programId }: { programId: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        await deleteProgram(programId);
        router.refresh();
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
