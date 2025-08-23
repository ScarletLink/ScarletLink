
'use client';

import 'dotenv/config';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bell,
  Search,
  PanelLeft,
  Settings,
  LogOut,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useRequireAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { formatDistanceToNow } from 'date-fns';
import { getNotificationsAction } from './notifications/actions';
import { useTranslation } from '@/hooks/use-translation';


interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRequireAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true);
  const { t } = useTranslation();


  useEffect(() => {
    async function fetchNotifications() {
        if (user) {
            setIsNotificationsLoading(true);
            try {
              // Pass the user ID to the server action
              const fetchedNotifications = await getNotificationsAction(user.uid);
              setNotifications(fetchedNotifications);
            } catch (error) {
              console.error("Failed to fetch notifications:", error);
              setNotifications([]);
            } finally {
              setIsNotificationsLoading(false);
            }
        }
    }
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: t("Logged out successfully.") });
      router.push('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("Logout failed"),
        description: t("An error occurred while logging out."),
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-primary"><rect width="256" height="256" fill="none"></rect><path d="M168,168.00018,128,208.00037,88,168.00018" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><path d="M128,48v99.99963" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><path d="M199.70422,125.75056A72,72,0,1,0,128,200.00037" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                <span className="">{t('Scarlet Link')}</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <SidebarNav />
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">{t('Toggle navigation menu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-primary"><rect width="256" height="256" fill="none"></rect><path d="M168,168.00018,128,208.00037,88,168.00018" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><path d="M128,48v99.99963" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><path d="M199.70422,125.75056A72,72,0,1,0,128,200.00037" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                      <span className="font-headline">{t('Scarlet Link')}</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium pt-4">
                  <SidebarNav />
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t('Search...')}
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Bell className="h-5 w-5" />
                   {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                  <span className="sr-only">{t('Toggle notifications')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t('Notifications')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isNotificationsLoading ? (
                  <DropdownMenuItem disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Loading...')}
                  </DropdownMenuItem>
                ) : notifications.length > 0 ? (
                  notifications.map((n) => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 whitespace-normal">
                      <p className="font-semibold">{t(n.title)}</p>
                      <p className="text-xs text-muted-foreground">{t(n.message)}</p>
                      <p className="text-xs text-muted-foreground self-end">{formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}</p>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>{t('No new notifications')}</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={user.photoURL ?? `https://placehold.co/40x40.png?text=${user.displayName?.charAt(0)}`} alt={user.displayName ?? 'user'} data-ai-hint="person avatar" />
                    <AvatarFallback>{user.displayName?.substring(0, 2).toUpperCase() || user.email?.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">{t('Toggle user menu')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('My Account')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile"><User className="mr-2 h-4 w-4" />{t('Profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />{t('Settings')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />{t('Logout')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
              {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
