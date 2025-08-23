
'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/data';
import { Search, UserPlus, Mail, Phone, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';

export default function UsersPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('User Directory')}</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-4">
            <div className="flex gap-2 flex-1 w-full md:w-auto">
              <div className="relative w-full md:w-auto md:flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('Search users...')} className="pl-8 w-full" />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('Filter by role')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('All Roles')}</SelectItem>
                  <SelectItem value="donor">{t('Donor')}</SelectItem>
                  <SelectItem value="patient">{t('Patient')}</SelectItem>
                  <SelectItem value="volunteer">{t('Volunteer')}</SelectItem>
                  <SelectItem value="doctor">{t('Doctor')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="gradient-primary w-full md:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              {t('Add New User')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-background ring-2 ring-primary">
                    <AvatarImage src={`https://placehold.co/96x96.png?text=${user.name.charAt(0)}`} data-ai-hint="person portrait" />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="font-headline text-xl">{t(user.name)}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="capitalize">{t(user.role)}</Badge>
                    {user.bloodType !== 'N/A' && <Badge variant="secondary">{t('Blood Type: {bloodType}').replace('{bloodType}', user.bloodType)}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4"/>
                        <span>{t(user.location)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4"/>
                        <span>{user.name.split(' ').join('.').toLowerCase()}@email.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4"/>
                        <span>(555) 123-4567</span>
                    </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">{t('View Profile')}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
