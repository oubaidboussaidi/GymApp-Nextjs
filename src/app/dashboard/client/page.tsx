import { auth } from '@/auth';
import { getStudentEnrollments } from '@/actions/enrollment.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Trophy, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import UpdateStatsForm from './update-profile-form';
import ProgramActions from './program-actions';

export default async function ClientDashboard() {
  const session = await auth();
  const user = session?.user;
  
  if (!user) return null;

  // Fetch enrollments
  const enrollments = await getStudentEnrollments(user.id);

  // Fetch fresh user data to get stats
  // We can't import User model directly in client component, but this is a server component.
  // We should fetch the user details.
  // Since we don't have a specific action for "getMe", let's assume we can use the session user id to fetch via a new action or just use what we have if we updated the session strategy.
  // But session strategy is JWT and only updates on re-login usually unless we trigger update.
  // Let's use a server action to get the current user details.
  // I'll import User model here since it's a server component.
  const dbUser = await import('@/models/User').then(mod => mod.default.findById(user.id).lean());
  const currentUser = JSON.parse(JSON.stringify(dbUser));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser.name}</h2>
            <p className="text-muted-foreground">Here's what's happening with your training.</p>
        </div>
        <UpdateStatsForm user={currentUser} />
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser.physicalStats?.weight || '--'} kg</div>
            <p className="text-xs text-muted-foreground">
              Latest measurement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Squat Max</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser.physicalStats?.squat || '--'} kg</div>
            <p className="text-xs text-muted-foreground">
              Personal Best
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bench Press</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser.physicalStats?.bench || '--'} kg</div>
            <p className="text-xs text-muted-foreground">
              Personal Best
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Programs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">My Programs</h3>
            <Button asChild variant="outline">
                <Link href="/dashboard/client/browse">Browse More</Link>
            </Button>
        </div>
        
        {enrollments.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
                <p>You haven't joined any programs yet.</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/client/browse">Find a Program</Link>
                </Button>
            </Card>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.filter((e: any) => e.programId != null).map((enrollment: any) => (
                    <Card key={enrollment._id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{enrollment.programId?.title || 'Unknown Program'}</CardTitle>
                            <p className="text-sm text-muted-foreground">by {enrollment.programId?.coachId?.name || 'Unknown Coach'}</p>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>Level</span>
                                    <span className="font-medium">{enrollment.programId?.level || '--'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Status</span>
                                    <span className="capitalize font-medium">{enrollment.status}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Joined {new Date(enrollment.joinedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Dumbbell className="h-4 w-4" />
                                        <span>{enrollment.programId?.exercises?.length || 0} Exercises</span>
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
