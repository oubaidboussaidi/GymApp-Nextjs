'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const routes = [
    {
      label: 'Overview',
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
      href: `/dashboard/coach/programs`,
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
      href: `/dashboard/admin/users`,
      roles: ['admin'],
    },
    {
      label: 'Programs',
      icon: Dumbbell,
      href: `/dashboard/admin/programs`,
      roles: ['admin'],
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      href: `/dashboard/admin/analytics`,
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
        "relative flex flex-col h-screen border-r border-border bg-card transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border h-16">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Dumbbell className="h-6 w-6 text-emerald-600" />
            <span>GymCore</span>
          </Link>
        )}
        {collapsed && (
          <Dumbbell className="h-6 w-6 text-emerald-600 mx-auto" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-3 top-5 h-6 w-6 rounded-full border border-border bg-background shadow-md z-50 hidden md:flex items-center justify-center"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {filteredRoutes.map((route) => {
            // Determine if route is active
            // For Dashboard: match root and role-specific dashboards
            // For specific routes: exact match only to prevent overlap (e.g., /coach vs /coach/students)
            let isActive = false;
            
            if (route.href === '/dashboard') {
              // Dashboard matches root or role-specific main pages
              isActive = pathname === '/dashboard' || 
                         pathname === '/dashboard/client' || 
                         pathname === '/dashboard/coach' || 
                         pathname === '/dashboard/admin';
            } else {
              // For all other routes, use exact match only
              isActive = pathname === route.href;
            }
            
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-emerald-500/10 hover:text-emerald-600",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 font-semibold border-r-2 border-emerald-600"
                    : "text-muted-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <route.icon className={cn("h-5 w-5", isActive && "text-emerald-600")} />
                {!collapsed && <span>{route.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="mt-auto border-t border-border">
        {session?.user && (
          <div className={cn(
            "flex items-center gap-3 p-4",
            collapsed && "justify-center"
          )}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={session.user.image || ''} />
              <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-semibold">
                {session.user.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{role}</p>
              </div>
            )}
          </div>
        )}
        <div className={cn("px-2 pb-4", collapsed && "px-1")}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-colors",
              collapsed && "justify-center px-0"
            )}
            onClick={() => signOut({ redirectTo: '/' })}
          >
            <LogOut className={cn("h-5 w-5", !collapsed && "mr-2")} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
