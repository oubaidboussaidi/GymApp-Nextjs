'use client';

import { getProgramStudents } from '@/actions/enrollment.actions';
import { getCoachPrograms } from '@/actions/program.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StudentActions from './student-actions';
import { useQuery } from '@tanstack/react-query';
import { DashboardSkeleton } from '@/components/skeletons';
import { useSearchParams } from 'next/navigation';

export default function CoachStudentsClient({ userId }: { userId: string }) {
  const searchParams = useSearchParams();
  const programIdParam = searchParams.get('programId');

  // Fetch Coach Programs
  const { data: programs = [], isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['coach-programs', userId],
    queryFn: async () => await getCoachPrograms(userId),
  });

  const selectedProgramId = programIdParam || (programs.length > 0 ? programs[0]._id : null);

  // Fetch Students for selected program
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['program-students', selectedProgramId],
    queryFn: async () => {
        if (!selectedProgramId) return [];
        return await getProgramStudents(selectedProgramId);
    },
    enabled: !!selectedProgramId,
  });

  const isLoading = isLoadingPrograms || (!!selectedProgramId && isLoadingStudents);

  if (isLoadingPrograms) {
      return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gérer les Étudiants</h2>
        <p className="text-muted-foreground">Voir et gérer les étudiants inscrits à vos programmes.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {programs.map((program: any) => (
            <Button 
                key={program._id} 
                variant={selectedProgramId === program._id ? 'default' : 'outline'}
                asChild
            >
                <Link href={`?programId=${program._id}`}>
                    {program.title}
                </Link>
            </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Étudiants Inscrits</CardTitle>
        </CardHeader>
        <CardContent>
            {isLoadingStudents ? (
                 <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted/50 animate-pulse rounded-md" />
                    ))}
                 </div>
            ) : students.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun étudiant inscrit à ce programme pour le moment.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Étudiant</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Date d'inscription</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((enrollment: any) => (
                            <TableRow key={enrollment._id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={enrollment.studentId.image} />
                                        <AvatarFallback>{enrollment.studentId.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{enrollment.studentId.name}</span>
                                </TableCell>
                                <TableCell>{enrollment.studentId.email}</TableCell>
                                <TableCell>{new Date(enrollment.joinedAt).toLocaleDateString('fr-FR')}</TableCell>
                                <TableCell className="text-right">
                                    <StudentActions enrollmentId={enrollment._id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
