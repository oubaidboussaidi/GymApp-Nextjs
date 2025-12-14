'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: `/dashboard`,
      roles: ['admin', 'coach', 'client'],
    },
    {
      label: 'Browse Programs',
      icon: Dumbbell,
      href: `/dashboard/client/browse`,
      roles: ['client'],
    },
    {
      label: 'My Programs',
      icon: Dumbbell,
      href: `/dashboard/coach`,
      roles: ['coach'],
    },
    {
      label: 'Manage Students',
      icon: Users,
      href: `/dashboard/coach/students`,
      roles: ['coach'],
    },
    {
      label: 'User Management',
      icon: Users,
      href: `/dashboard/admin`,
      roles: ['admin'],
    },
    {
      label: 'Profile',
      icon: Settings,
      href: `/dashboard/profile`,
      roles: ['admin', 'coach', 'client'],
    },
  ];

  const filteredRoutes = routes.filter((route) => route.roles.includes(role));

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen border-r bg-background transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b h-16">
        {!collapsed && (
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <Dumbbell className="h-6 w-6 text-primary" />
                <span>GymCore</span>
            </Link>
        )}
        {collapsed && (
             <Dumbbell className="h-6 w-6 text-primary mx-auto" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("absolute -right-3 top-5 h-6 w-6 rounded-full border bg-background shadow-md z-50 hidden md:flex")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {filteredRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === route.href ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <route.icon className="h-5 w-5" />
              {!collapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button
            variant="ghost"
            className={cn(
                "w-full justify-start text-muted-foreground hover:text-destructive",
                collapsed && "justify-center px-0"
            )}
            onClick={() => signOut({ redirectTo: '/' })}
        >
            <LogOut className="h-5 w-5 mr-2" />
            {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
