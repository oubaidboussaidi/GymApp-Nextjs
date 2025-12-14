import { auth } from '@/auth';
import AdminAnalyticsClient from './admin-analytics-client';

export default async function AdminAnalytics() {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'admin') return null;

    return <AdminAnalyticsClient />;
}
