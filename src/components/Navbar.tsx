import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import { ThemeToggle } from './theme-toggle';

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span>GymCore</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <AuthModal>
                <Button variant="ghost">Login</Button>
              </AuthModal>
              <AuthModal>
                <Button>Register</Button>
              </AuthModal>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
