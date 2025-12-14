'use client';

import { getStudentEnrollments } from '@/actions/enrollment.actions';
import { getCurrentUser } from '@/actions/current-user.action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Trophy, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import UpdateStatsForm from './update-profile-form';
import ProgramActions from './program-actions';
import { useQuery } from '@tanstack/react-query';
import { ProgramCardSkeleton } from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientDashboardClient({ userId }: { userId: string }) {
  // Fetch current user data from database (includes physicalStats)
  const { data: userResult, isLoading: isLoadingUser } = useQuery({
    queryKey: ['current-user', userId],
    queryFn: async () => await getCurrentUser(),
  });

  const currentUser = userResult?.success ? userResult.data : null;
  
  // Fetch Enrollments
  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['my-enrollments', userId],
    queryFn: async () => await getStudentEnrollments(userId),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Bon retour{currentUser?.name ? `, ${currentUser.name}` : ''}</h2>
            <p className="text-muted-foreground">Voici le résumé de votre entraînement.</p>
        </div>
        {currentUser && <UpdateStatsForm user={{ ...currentUser, id: userId }} />}
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poids Actuel</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingUser ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{currentUser?.physicalStats?.weight || '--'} kg</div>
            )}
            <p className="text-xs text-muted-foreground">
              Dernière mesure
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Squat Max</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingUser ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{currentUser?.physicalStats?.squat || '--'} kg</div>
            )}
            <p className="text-xs text-muted-foreground">
              Record Personnel
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Développé Couché</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingUser ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{currentUser?.physicalStats?.bench || '--'} kg</div>
            )}
            <p className="text-xs text-muted-foreground">
              Record Personnel
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Programs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Mes Programmes</h3>
            <Button asChild variant="outline">
                <Link href="/dashboard/client/browse">Parcourir</Link>
            </Button>
        </div>
        
        {isLoadingEnrollments ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <ProgramCardSkeleton key={i} />
                ))}
            </div>
        ) : enrollments.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
                <p>Vous n'êtes inscrit à aucun programme.</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/client/browse">Trouver un Programme</Link>
                </Button>
            </Card>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.filter((e: any) => e.programId != null).map((enrollment: any) => (
                    <Card key={enrollment._id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{enrollment.programId?.title || 'Programme Inconnu'}</CardTitle>
                            <p className="text-sm text-muted-foreground">par {enrollment.programId?.coachId?.name || 'Coach Inconnu'}</p>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>Niveau</span>
                                    <span className="font-medium">{enrollment.programId?.level || '--'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Statut</span>
                                    <span className="capitalize font-medium">{enrollment.status === 'active' ? 'Actif' : enrollment.status}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Inscrit le {new Date(enrollment.joinedAt).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Dumbbell className="h-4 w-4" />
                                        <span>{enrollment.programId?.exercises?.length || 0} Exercices</span>
                                    </div>
                                </div>
                                <ProgramActions enrollmentId={enrollment._id} programId={enrollment.programId?._id} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
