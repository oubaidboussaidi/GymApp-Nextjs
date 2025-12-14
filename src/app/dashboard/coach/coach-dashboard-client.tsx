'use client';

import { getCoachPrograms } from '@/actions/program.actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CoachProgramActions from './program-actions';
import { ProgramCard } from '@/components/ProgramCard';
import { useQuery } from '@tanstack/react-query';
import { ProgramCardSkeleton } from '@/components/skeletons';

export default function CoachDashboardClient({ userId }: { userId: string }) {
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['coach-programs', userId],
    queryFn: async () => await getCoachPrograms(userId),
  });

  return (
    <>
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <ProgramCardSkeleton key={i} />
          ))}
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium">No programs created yet</h3>
          <p className="text-muted-foreground mb-4">Create your first program to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program: any) => (
            <ProgramCard key={program._id} program={program}>
              <div className="flex gap-2 w-full">
                <Button asChild variant="secondary" className="flex-1">
                  <Link href={`/dashboard/coach/students?programId=${program._id}`}>
                    Manage Students
                  </Link>
                </Button>
                <CoachProgramActions programId={program._id} />
              </div>
            </ProgramCard>
          ))}
        </div>
      )}
    </>
  );
}
