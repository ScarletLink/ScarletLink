
'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Award,
  FileText,
  Home,
  User,
  Siren,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

const allLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/alerts', label: 'Alerts', icon: Siren },
  { href: '/users', label: 'User Directory', icon: Users },
  { href: '/rewards', label: 'Rewards', icon: Award },
  { href: '/reports', label: 'AI Reports', icon: FileText },
  { href: '/profile', label: 'Profile', icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isRoleSpecificPage =
    pathname.startsWith('/emergency') ||
    pathname.startsWith('/volunteer') ||
    pathname.startsWith('/doctor');

  const links = isRoleSpecificPage
    ? allLinks.filter(
        (link) => link.href !== '/dashboard' && link.href !== '/analytics'
      )
    : allLinks;

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <Link href={link.href} className="w-full">
            <SidebarMenuButton
              isActive={pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/')}
              tooltip={t(link.label)}
            >
              <link.icon />
              <span>{t(link.label)}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
