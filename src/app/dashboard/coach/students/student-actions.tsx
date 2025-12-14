'use client';

import { kickStudent } from '@/actions/enrollment.actions';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function StudentActions({ enrollmentId }: { enrollmentId: string }) {
    const router = useRouter();

    const handleKick = async () => {
        await kickStudent(enrollmentId);
        router.refresh();
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
