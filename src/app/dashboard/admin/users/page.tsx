import { auth } from '@/auth';
import AdminUsersClient from './admin-users-client';

export default async function UsersManagement() {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'admin') return null;

    return <AdminUsersClient />;
}
