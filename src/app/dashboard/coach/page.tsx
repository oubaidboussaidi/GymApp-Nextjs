import { auth } from '@/auth';
import { getCoachPrograms, createProgram, deleteProgram } from '@/actions/program.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Need to add textarea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CreateProgramForm from './create-program-form';
import CoachProgramActions from './program-actions';

export default async function CoachDashboard() {
  const session = await auth();
  const user = session?.user;
  
  if (!user) return null;

  const programs = await getCoachPrograms(user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Coach Dashboard</h2>
            <p className="text-muted-foreground">Manage your training programs and students.</p>
        </div>
        <CreateProgramForm coachId={user.id} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program: any) => (
            <Card key={program._id} className="flex flex-col">
                <CardHeader>
                    <CardTitle>{program.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{program.level}</p>
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {program.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" />
                        <span>-- Students</span> {/* We could fetch count if needed */}
                    </div>
                </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button asChild variant="secondary" className="flex-1">
                            <Link href={`/dashboard/coach/students?programId=${program._id}`}>
                                Manage Students
                            </Link>
                        </Button>
                        <CoachProgramActions programId={program._id} />
                    </CardFooter>
            </Card>
        ))}
      </div>
      
      {programs.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium">No programs created yet</h3>
            <p className="text-muted-foreground mb-4">Create your first program to get started.</p>
        </div>
      )}
    </div>
  );
}
