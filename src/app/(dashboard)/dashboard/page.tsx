
'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { donationHistory, upcomingDrives } from "@/lib/data";
import { Droplets, CalendarCheck, MapPin, PlusCircle, Search, Gift, HeartPulse, Siren, Check, X, Loader2, Phone, User, Globe } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useEffect, useState } from "react";
import type { Alert } from "../alerts/actions";
import { getLatestAlertAction } from "../alerts/actions";
import { useAuth } from "@/hooks/use-auth";
import { addDays, format, differenceInDays } from 'date-fns';
import { searchNearbyBloodBanks, type BloodBank } from "@/services/eraktkosh";
import Link from "next/link";


// Helper function to calculate initial days remaining
const calculateInitialDays = () => {
    const eligibleDate = new Date('2024-08-15');
    const today = new Date();
    return differenceInDays(eligibleDate, today) > 0 ? differenceInDays(eligibleDate, today) : 0;
};


export default function DonorDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [latestAlert, setLatestAlert] = useState<Alert | null>(null);
  const [isLoadingAlert, setIsLoadingAlert] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [nextEligibleDate, setNextEligibleDate] = useState(new Date('2024-08-15'));
  const [daysRemaining, setDaysRemaining] = useState(calculateInitialDays());

  const [isFindingDrives, setIsFindingDrives] = useState(false);
  const [foundDrives, setFoundDrives] = useState<BloodBank[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);


  useEffect(() => {
    async function fetchAlert() {
      setIsLoadingAlert(true);
      const result = await getLatestAlertAction();
      if (result.success && result.data) {
        setLatestAlert(result.data);
      }
      setIsLoadingAlert(false);
    }
    fetchAlert();
  }, []);

  const handleAcceptDonation = async () => {
    if (!latestAlert) return;

    setIsAccepting(true);
    setShowContact(true);

    const today = new Date();
    const newEligibleDate = addDays(today, 7);
    setNextEligibleDate(newEligibleDate);
    setDaysRemaining(7);

    setIsAccepting(false);
  };
  
  const handleFindDrives = async () => {
    setIsFindingDrives(true);
    setFoundDrives([]);
    try {
      const response = await searchNearbyBloodBanks(17.43, 78.40, 'all');
      if (response.payload.response) {
        const data: BloodBank[] = JSON.parse(response.payload.response);
        // The first item is the TOTAL count, filter it out for the list
        setFoundDrives(data.filter(item => 'name' in item));
      }
    } catch (e) {
        console.error("Failed to find blood drives", e);
    } finally {
        setIsFindingDrives(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('Blood Type')}</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">O+</div>
            <p className="text-xs text-muted-foreground">{t('Universal Donor')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('Total Donations')}</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">{t('+1 since last year')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('Reward Points')}</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">{t('Keep it up!')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('Next Eligible On')}</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(nextEligibleDate, 'MMM d, yyyy')}</div>
            <p className="text-xs text-muted-foreground">{t('{0} days remaining').replace('{0}', String(daysRemaining))}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('Donation History')}</CardTitle>
            <CardDescription>{t('A record of your life-saving contributions.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Date')}</TableHead>
                  <TableHead>{t('Location')}</TableHead>
                  <TableHead className="text-right">{t('Status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donationHistory.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{t(donation.date)}</TableCell>
                    <TableCell>{t(donation.location)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">{t(donation.status)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-6">
            {isLoadingAlert ? (
                 <Card>
                    <CardContent className="p-6 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <p className="ml-2 text-muted-foreground">{t('Checking for alerts...')}</p>
                    </CardContent>
                </Card>
            ) : latestAlert ? (
                <Card className="bg-destructive/10 border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive"><Siren/>{t('Emergency Alert')}</CardTitle>
                        <CardDescription className="text-destructive/80">
                             {t('Someone near you needs {bloodType} blood urgently. Can you help?').replace('{bloodType}', latestAlert.bloodType)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {showContact ? (
                             <div className="space-y-3">
                                <h3 className="font-semibold">{t('Patient Contact Information')}</h3>
                                <div className="flex items-center gap-4 p-3 bg-background rounded-lg">
                                    <User className="h-5 w-5 text-primary" />
                                    <div className="flex-1">
                                        <p className="font-medium">{t('Patient in Need')}</p>
                                    </div>
                                     <div className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-primary" />
                                        <p>9876543210</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="destructive" className="flex-1" onClick={handleAcceptDonation} disabled={isAccepting}>
                                    {isAccepting ? <Loader2 className="mr-2 animate-spin" /> : <Check className="mr-2"/>}
                                    {t('Yes, I\'ll donate')}
                                </Button>
                                <Button variant="outline" className="flex-1">
                                   <X className="mr-2"/> {t('Not available')}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : null}

            <Card>
                <CardHeader>
                    <CardTitle>{t('Quick Actions')}</CardTitle>
                    <CardDescription>{t('What would you like to do today?')}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="h-auto py-4" onClick={handleFindDrives}>
                                <Search className="mr-2"/>
                                {t('Find a Blood Drive')}
                            </Button>
                        </DialogTrigger>
                         <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>{t('Nearby Blood Banks & Drives')}</DialogTitle>
                                <DialogDescription>{t('Official list of donation centers from eRaktKosh (simulated).')}</DialogDescription>
                            </DialogHeader>
                            {isFindingDrives ? (
                                <div className="flex items-center justify-center h-48">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <p className="ml-4 text-muted-foreground">{t('Searching for blood banks...')}</p>
                                </div>
                            ) : foundDrives.length > 0 ? (
                                <div className="max-h-[60vh] overflow-y-auto">
                                    <ul className="space-y-4">
                                        {foundDrives.map((drive, index) => (
                                            <li key={index} className="p-4 border rounded-lg flex items-start gap-4">
                                                <div className="bg-primary/10 text-primary p-3 rounded-lg mt-1">
                                                    <CalendarCheck className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold">{t(drive.name)}</p>
                                                    <p className="text-sm text-muted-foreground flex items-center"><MapPin className="h-3 w-3 mr-1"/>{t(drive.add)}</p>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        <Badge variant="outline">Available: {t(drive.available)}</Badge>
                                                    </div>
                                                </div>
                                                <Button variant="outline" asChild>
                                                    <a href={`tel:${drive.ph}`}>
                                                        <Phone className="mr-2 h-4 w-4" /> {t('Call')}
                                                    </a>
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                 <div className="text-center h-48 flex flex-col items-center justify-center">
                                    <p className="text-muted-foreground">{t('No blood banks found.')}</p>
                                    <p className="text-xs text-muted-foreground">{t('Please try again later.')}</p>
                                 </div>
                            )}
                        </DialogContent>
                    </Dialog>
                    <Button size="lg" variant="secondary" className="h-auto py-4">
                        <PlusCircle className="mr-2"/>
                        {t('Schedule Donation')}
                    </Button>
                </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>{t('Upcoming Blood Drives')}</CardTitle>
                <CardDescription>{t('Opportunities to make a difference near you.')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                {upcomingDrives.map((drive) => (
                    <li key={drive.id} className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                        <CalendarCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold">{t(drive.title)}</p>
                        <p className="text-sm text-muted-foreground">{t(drive.date)}</p>
                        <p className="text-sm text-muted-foreground flex items-center"><MapPin className="h-3 w-3 mr-1"/>{t(drive.location)}</p>
                    </div>
                    </li>
                ))}
                </ul>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
