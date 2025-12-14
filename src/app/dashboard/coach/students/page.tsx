import { auth } from '@/auth';
import { getProgramStudents, kickStudent } from '@/actions/enrollment.actions';
import { getCoachPrograms as fetchCoachPrograms } from '@/actions/program.actions'; // Rename to avoid conflict
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
import { Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import StudentActions from './student-actions';

export default async function ManageStudentsPage({
  searchParams,
}: {
  searchParams: { programId?: string };
}) {
  const session = await auth();
  const user = session?.user;
  
  if (!user) return null;

  const programs = await fetchCoachPrograms(user.id);
  const selectedProgramId = searchParams.programId || (programs.length > 0 ? programs[0]._id : null);
  
  let students: any[] = [];
  if (selectedProgramId) {
    students = await getProgramStudents(selectedProgramId);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manage Students</h2>
        <p className="text-muted-foreground">View and manage students enrolled in your programs.</p>
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
            <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
            {students.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No students enrolled in this program yet.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined</TableHead>
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
                                <TableCell>{new Date(enrollment.joinedAt).toLocaleDateString()}</TableCell>
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
