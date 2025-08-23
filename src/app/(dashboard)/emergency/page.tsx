
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { topDonors, emergencyUpdates, patientRequests } from '@/lib/data';
import { CheckCircle, Circle, MapPin, Send, Loader2, Banknote, Phone, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import React, { useRef, useState } from 'react';
import { sendEmergencyAlert } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { searchNearbyBloodBanks, type BloodBank } from '@/services/eraktkosh';


const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'outline';
    case 'In Progress':
      return 'secondary';
    case 'Pending':
      return 'destructive';
    default:
      return 'default';
  }
}

export default function EmergencyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [isFindingBanks, setIsFindingBanks] = useState(false);
  const [foundBanks, setFoundBanks] = useState<BloodBank[]>([]);
  const [searched, setSearched] = useState(false);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
        toast({
            variant: 'destructive',
            title: t('Authentication Error'),
            description: t('You must be logged in to send an alert.'),
        });
        return;
    }
    
    const formData = new FormData(event.currentTarget);
    const location = formData.get('location') as string;
    const bloodType = formData.get('bloodType') as string;
    const urgency = formData.get('urgency') as string;
    
    if (!location || !bloodType || !urgency) {
      toast({
        variant: 'destructive',
        title: t('Error'),
        description: t('Please fill out all fields.'),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendEmergencyAlert(formData, user.uid);
      if(response.success) {
        toast({
            title: t('Alert Sent!'),
            description: t(response.message),
        });
        formRef.current?.reset();
        // Automatically find blood banks on successful alert
        handleFindBanks(bloodType);
      } else {
        toast({
            variant: 'destructive',
            title: t('Error'),
            description: t(response.message),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('Error'),
        description: t('Failed to send alert. Please try again.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFindBanks = async (bloodType: string) => {
    setIsFindingBanks(true);
    setSearched(true);
    setFoundBanks([]);
    try {
        const response = await searchNearbyBloodBanks(17.43, 78.40, bloodType);
        if (response.payload.response) {
            const data = JSON.parse(response.payload.response);
            setFoundBanks(data.filter((item: any) => 'name' in item));
        } else {
            setFoundBanks([]);
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: t('API Error'),
            description: t('Failed to fetch blood bank data.'),
        });
    } finally {
        setIsFindingBanks(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col gap-6">
        {searched && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="text-green-600"/>
                        {t('Nearby Blood Banks (eRaktKosh)')}
                    </CardTitle>
                    <CardDescription>
                        {t('Live availability from verified blood banks in your area. This is simulated data.')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isFindingBanks ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-3 text-muted-foreground">{t('Searching for blood banks...')}</p>
                        </div>
                    ) : foundBanks.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {foundBanks.map((bank, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{t(bank.name)}</CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3"/> {bank.dis} km away
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground mb-1">{t('Available')}</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {bank.available.split(',').map(bt => bt && <Badge key={bt} variant="outline" className="bg-green-100 text-green-800 border-green-200">{bt}</Badge>)}
                                            </div>
                                        </div>
                                         <div>
                                            <h4 className="text-xs font-semibold text-muted-foreground mb-1">{t('Not Available')}</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {bank.not_available.split(',').map(bt => bt && <Badge key={bt} variant="destructive" className="bg-red-100 text-red-800 border-red-200">{bt}</Badge>)}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" asChild>
                                          <a href={`tel:${bank.ph}`}><Phone className="mr-2"/> {t('Call Now')}</a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center h-40 flex flex-col items-center justify-center">
                            <p className="text-muted-foreground">{t('No blood banks found matching your criteria.')}</p>
                            <p className="text-xs text-muted-foreground">{t('Please try a different blood type or check back later.')}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
        <Card>
            <CardHeader>
                <CardTitle>{t('Real-time Status Updates')}</CardTitle>
                <CardDescription>{t('Tracking emergency request #ER-2024-07-31-001')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative pl-6">
                    <div className="absolute left-[11px] top-0 h-full w-0.5 bg-border"></div>
                    {emergencyUpdates.map((update, index) => (
                        <div key={update.id} className="relative mb-8 flex items-start gap-4">
                            <div className={cn(
                                "z-10 flex h-6 w-6 items-center justify-center rounded-full",
                                update.status === 'completed' ? 'bg-primary' :
                                update.status === 'active' ? 'bg-primary ring-4 ring-primary/20' : 'bg-muted-foreground/30'
                            )}>
                                {update.status === 'completed' ? (
                                    <CheckCircle className="h-4 w-4 text-white" />
                                ) : (
                                    <Circle className="h-3 w-3 text-white" />
                                )}
                            </div>
                            <div className="flex-1 pt-0.5">
                                <p className="font-semibold">{t(update.title)} <span className="ml-2 text-xs font-normal text-muted-foreground">{update.time}</span></p>
                                <p className="text-sm text-muted-foreground">{t(update.description)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('New Emergency Request')}</CardTitle>
            <CardDescription>{t('Fill out the form to send an urgent alert and find blood banks.')}</CardDescription>
          </CardHeader>
          <CardContent>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                      <Label htmlFor="location">{t('Location / Hospital')}</Label>
                      <Input id="location" name="location" placeholder={t('e.g., City General Hospital')} />
                </div>
                <div className="space-y-2">
                     <Label htmlFor="bloodType">{t('Blood Type')}</Label>
                      <Select name="bloodType">
                          <SelectTrigger id="bloodType">
                            <SelectValue placeholder={t('Select blood type')} />
                          </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urgency">{t('Urgency')}</Label>
                      <Select name="urgency">
                          <SelectTrigger id="urgency">
                            <SelectValue placeholder={t('Select urgency level')} />
                          </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">{t('Critical')}</SelectItem>
                          <SelectItem value="high">{t('High')}</SelectItem>
                          <SelectItem value="medium">{t('Medium')}</SelectItem>
                        </SelectContent>
                      </Select>
                </div>
                <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {isSubmitting ? t('Sending...') : t('Send Alert & Find Banks')}
                </Button>
              </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('My Previous Requests')}</CardTitle>
            <CardDescription>{t('A history of your blood requests.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Date')}</TableHead>
                  <TableHead>{t('Location')}</TableHead>
                  <TableHead>{t('Blood Type')}</TableHead>
                  <TableHead>{t('Status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{t(request.date)}</TableCell>
                    <TableCell>{t(request.location)}</TableCell>
                    <TableCell><Badge variant="destructive">{request.bloodType}</Badge></TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(request.status)}>{t(request.status)}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
