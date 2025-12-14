import { auth } from '@/auth';
import { getAdminAnalytics } from '@/actions/analytics.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Dumbbell, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminDashboard() {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'admin') return null;

    const analyticsResult = await getAdminAnalytics();
    const analytics = analyticsResult.success ? analyticsResult.data : null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back! Here's your system overview.</p>
                </div>
            </div>

            {/* System Metrics */}
            {analytics && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.overview.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                {analytics.overview.totalCoaches} coaches, {analytics.overview.totalClients} clients
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.overview.totalPrograms}</div>
                            <p className="text-xs text-muted-foreground">
                                Created by coaches
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.overview.activeEnrollments}</div>
                            <p className="text-xs text-muted-foreground">
                                Out of {analytics.overview.totalEnrollments} total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.overview.avgSystemRating.toFixed(1)}</div>
                            <p className="text-xs text-muted-foreground">
                                System-wide average
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/dashboard/admin/users">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                User Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                View, edit, and manage all users in the system
                            </p>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/dashboard/admin/analytics">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                                Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                View detailed charts and system analytics
                            </p>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/dashboard/admin/programs">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Dumbbell className="h-5 w-5 text-purple-600" />
                                Programs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Manage all training programs
                            </p>
                        </CardContent>
                    </Link>
                </Card>
            </div>

            {/* Recent Activity or other summary info could go here */}
            {analytics && analytics.recentUsers && analytics.recentUsers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent User Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {analytics.recentUsers.slice(0, 5).map((u: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        New {u.role} joined
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
