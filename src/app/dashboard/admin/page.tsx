import { auth } from '@/auth';
import AdminDashboardClient from './admin-dashboard-client';

export default async function AdminDashboard() {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back! Here's your system overview.</p>
                </div>
            </div>

            <AdminDashboardClient />
        </div>
    );
}
