import { auth } from '@/auth';
import AdminProgramsClient from './admin-programs-client';

export default async function ProgramsManagement() {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== 'admin') return null;

    return <AdminProgramsClient />;
}
