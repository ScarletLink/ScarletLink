
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartHandshake, Stethoscope, Users, Siren, Heart } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';

export default function Home() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  const roles = [
    {
      icon: <HeartHandshake className="h-10 w-10 text-primary" />,
      title: t('Donor'),
      description: t('Save Lives by Donating Blood'),
      href: '/dashboard',
    },
    {
      icon: <Heart className="h-10 w-10 text-primary" />,
      title: t('Patient'),
      description: t('Get Emergency Blood Support'),
      href: 'emergency',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: t('Volunteer'),
      description: t('Coordinate Blood Donations'),
      href: 'volunteer',
    },
    {
      icon: <Stethoscope className="h-10 w-10 text-primary" />,
      title: t('Doctor'),
      description: t('Medical Network & Consultation'),
      href: 'doctor',
    },
  ];

  const getWelcomeMessage = () => {
    if (loading) return '';
    if (user) {
      return t('Welcome, {name}!').replace('{name}', user.displayName || user.email || '');
    }
    return t('Welcome!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
           <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
            {t('Scarlet Link')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {getWelcomeMessage()}
          </p>
        </header>

        <main className="flex flex-col items-center gap-8">
            <div className="text-center">
                <p className="text-xl font-semibold">{t('47 lives saved today across the platform')}</p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {roles.map((role) => (
              <Link href={role.href} key={role.title} className="transform transition-transform duration-300 hover:-translate-y-2">
                <Card className="h-full text-center hover:shadow-xl hover:border-primary/50 transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-center mb-4">{role.icon}</div>
                    <CardTitle className="font-headline text-2xl">{role.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{role.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">{t('In case of a critical emergency, press the button below.')}</p>
            <Button
              size="lg"
              variant="destructive"
              className="h-16 px-12 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 animate-pulse"
            >
              <Siren className="mr-3 h-8 w-8" />
              {t('SOS Emergency')}
            </Button>
          </div>
        </main>
      </div>
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        {t('Scarlet Link. Saving lives, together.')}
      </footer>
    </div>
  );
}
