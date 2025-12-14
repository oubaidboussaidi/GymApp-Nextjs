'use client';

import { getCoachAnalytics } from '@/actions/analytics.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Users, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export default function CoachOverviewClient({ userId }: { userId: string }) {
  const { data: analyticsResult, isLoading } = useQuery({
    queryKey: ['coach-analytics', userId],
    queryFn: async () => await getCoachAnalytics(userId),
  });

  const analytics = analyticsResult?.success ? analyticsResult.data : null;

  return (
    <>
      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : analytics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programmes</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalPrograms}</div>
              <p className="text-xs text-muted-foreground">
                Créés par vous
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">
                Sur tous les programmes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Étudiants Actifs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalActiveStudents}</div>
              <p className="text-xs text-muted-foreground">
                Actuellement inscrits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.avgRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Avis des étudiants
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/coach/programs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-emerald-600" />
                Mes Programmes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Créer et gérer vos programmes d'entraînement
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/coach/students">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Gérer les Étudiants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Voir et gérer les étudiants inscrits à vos programmes
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Top Programs */}
      {analytics && analytics.programs && analytics.programs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance de vos Programmes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.programs.slice(0, 5).map((program: any) => (
                <div key={program._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{program.title}</p>
                    <p className="text-sm text-muted-foreground">{program.level}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{program.totalEnrollments || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{program.averageRating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
