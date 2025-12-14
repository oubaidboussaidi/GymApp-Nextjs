'use client';

import { kickStudent, getProgramStudents } from '@/actions/enrollment.actions';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { Button } from '@/components/ui/button';
import { Users, LogOut } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function ProgramActions({ enrollmentId, programId }: { enrollmentId: string, programId?: string }) {
    const [openParticipants, setOpenParticipants] = useState(false);
    const [participants, setParticipants] = useState<any[]>([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const queryClient = useQueryClient();

    const handleLeave = async () => {
        const result = await kickStudent(enrollmentId);
        if (result.success) {
            toast.success('Left program successfully');
            queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            queryClient.invalidateQueries({ queryKey: ['programs'] });
        } else {
            toast.error(result.error || 'Failed to leave program');
        }
    };

    const handleViewParticipants = async () => {
        setLoadingParticipants(true);
        try {
            if (!programId) return;
            const data = await getProgramStudents(programId);
            setParticipants(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load participants');
        } finally {
            setLoadingParticipants(false);
        }
    };

    return (
        <div className="flex items-center gap-2 mt-4">
            <Dialog open={openParticipants} onOpenChange={setOpenParticipants}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleViewParticipants}>
                        <Users className="h-4 w-4 mr-2" />
                        Classmates
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Classmates</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {loadingParticipants ? (
                            <p>Loading...</p>
                        ) : participants.length === 0 ? (
                            <p>No other students enrolled.</p>
                        ) : (
                            participants.map((p) => (
                                <div key={p._id} className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={p.studentId.image} />
                                        <AvatarFallback>{p.studentId.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{p.studentId.name}</p>
                                        <p className="text-xs text-muted-foreground">Joined {new Date(p.joinedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <DeleteConfirmation 
                onDelete={handleLeave}
                title="Leave Program?"
                description="Are you sure you want to leave this program? Your progress will be lost."
                trigger={
                    <Button variant="destructive" size="sm">
                        <LogOut className="h-4 w-4 mr-2" />
                        Leave
                    </Button>
                }
            />
        </div>
    );
}
