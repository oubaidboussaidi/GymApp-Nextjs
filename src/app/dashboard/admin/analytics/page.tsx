import { auth } from '@/auth';
import { getAdminAnalytics } from '@/actions/analytics.actions';
import PieChart from '@/components/charts/PieChart';
import BarChart from '@/components/charts/BarChart';

export default async function AdminAnalytics() {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'admin') return null;

    const analyticsResult = await getAdminAnalytics();
    const analytics = analyticsResult.success ? analyticsResult.data : null;

    if (!analytics) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">Unable to load analytics data.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">System Analytics</h2>
                <p className="text-muted-foreground">Detailed insights and visualizations.</p>
            </div>

            {/* Analytics Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <PieChart
                    title="Users by Role"
                    data={[
                        { name: 'Coaches', value: analytics.usersByRole.coach },
                        { name: 'Clients', value: analytics.usersByRole.client },
                        { name: 'Admins', value: analytics.usersByRole.admin },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    colors={['#3b82f6', '#10b981', '#8b5cf6']}
                />

                <BarChart
                    title="Top Programs by Enrollment"
                    data={analytics.topPrograms.map((p: any) => ({
                        name: p.title.substring(0, 15) + (p.title.length > 15 ? '...' : ''),
                        enrollments: p.totalEnrollments,
                    }))}
                    dataKey="enrollments"
                    xAxisKey="name"
                    yAxisLabel="Enrollments"
                    color="#10b981"
                />
            </div>

            {/* Coaches Performance */}
            {analytics.coachPrograms.length > 0 && (
                <BarChart
                    title="Programs per Coach"
                    data={analytics.coachPrograms.map((c: any) => ({
                        name: c.name,
                        programs: c.programCount,
                    }))}
                    dataKey="programs"
                    xAxisKey="name"
                    yAxisLabel="Programs"
                    color="#3b82f6"
                />
            )}
        </div>
    );
}
