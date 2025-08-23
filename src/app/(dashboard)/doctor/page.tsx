
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { users } from '@/lib/data';
import { Stethoscope, UserPlus, Video, MessageSquare, BriefcaseMedical, Beaker, BookOpen, Lightbulb } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const specialists = [
    { name: 'Dr. Emily Carter', specialty: 'Hematology', location: 'New York' },
    { name: 'Dr. Ben Hanson', specialty: 'Pediatric Thalassemia', location: 'London' },
    { name: 'Dr. Sofia Rossi', specialty: 'Gene Therapy', location: 'Rome' },
];

export default function DoctorPage() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('Medical Network')}</CardTitle>
                    <CardDescription>{t('Connect with specialists for consultations and case discussions.')}</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                   {specialists.map(specialist => (
                     <Card key={specialist.name}>
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-16 h-16 mb-2">
                                <AvatarImage src={`https://placehold.co/64x64.png?text=${specialist.name.charAt(0)}`} data-ai-hint="person avatar" />
                                <AvatarFallback>{specialist.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-base">{t(specialist.name)}</CardTitle>
                            <CardDescription>{t(specialist.specialty)}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex-col gap-2">
                            <Button variant="outline" size="sm" className="w-full"><Video className="mr-2"/> {t('Video Call')}</Button>
                            <Button variant="secondary" size="sm" className="w-full"><MessageSquare className="mr-2"/> {t('Message')}</Button>
                        </CardFooter>
                    </Card>
                   ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Beaker /> {t('Blood Component Therapy')}</CardTitle>
                    <CardDescription>{t('Quick reference on the usage of different blood products.')}</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold">{t('Packed Red Blood Cells (PRBCs)')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{t('Used for treating anemia and improving oxygen-carrying capacity.')}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold">{t('Fresh Frozen Plasma (FFP)')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{t('Replaces clotting factors in patients with coagulation deficiencies.')}</p>
                    </div>
                     <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold">{t('Platelets')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{t('For treating thrombocytopenia and preventing bleeding.')}</p>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen /> {t('Recent Research & Case Studies')}</CardTitle>
                    <CardDescription>{t('Stay updated with the latest in hematology and transfusion medicine.')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                        <Lightbulb className="h-5 w-5 mt-1 text-primary"/>
                        <div>
                            <h4 className="font-semibold">{t('Case Study: AI in Blood Matching')}</h4>
                            <p className="text-sm text-muted-foreground">{t('A recent study shows a 15% improvement in compatibility matching using a new AI algorithm.')}</p>
                            <Button variant="link" className="p-0 h-auto mt-1">{t('Read More')}</Button>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Lightbulb className="h-5 w-5 mt-1 text-primary"/>
                        <div>
                            <h4 className="font-semibold">{t('Research on Synthetic Blood Substitutes')}</h4>
                            <p className="text-sm text-muted-foreground">{t('Promising phase II trial results for a new oxygen-carrying therapeutic.')}</p>
                             <Button variant="link" className="p-0 h-auto mt-1">{t('View Abstract')}</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('Quick Actions')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button size="lg"><UserPlus className="mr-2"/> {t('Add New Patient')}</Button>
                    <Button size="lg" variant="secondary"><Stethoscope className="mr-2"/> {t('Start Consultation')}</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{t('Hospital Integration')}</CardTitle>
                    <CardDescription>{t('Manage hospital resources and staff.')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                            <p className="font-semibold">{t('Blood Bank Inventory')}</p>
                            <p className="text-sm text-muted-foreground">{t('O- levels are critical')}</p>
                        </div>
                        <Button variant="outline" size="sm">{t('Manage')}</Button>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                            <p className="font-semibold">{t('Staff Coordination')}</p>
                            <p className="text-sm text-muted-foreground">{t('3 nurses on-duty')}</p>
                        </div>
                        <Button variant="outline" size="sm">{t('Assign')}</Button>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                            <p className="font-semibold">{t('Treatment Planning')}</p>
                             <p className="text-sm text-muted-foreground">{t('5 transfusions scheduled')}</p>
                        </div>
                        <Button variant="outline" size="sm">{t('Schedule')}</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
