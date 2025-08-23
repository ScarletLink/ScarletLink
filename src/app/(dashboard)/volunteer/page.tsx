
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { emergencyRequests, communicationLog, volunteerStats } from '@/lib/data';
import { Phone, MessageSquare, MapPin, PlayCircle, CheckCircle, Hourglass } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function VolunteerPage() {
  const { t } = useTranslation();
  const activeRequest = emergencyRequests.find(req => req.status === 'In Progress');

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('Live Emergency Feed')}</CardTitle>
            <CardDescription>{t('Real-time blood requests from patients in your area.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Patient')}</TableHead>
                  <TableHead>{t('Location')}</TableHead>
                  <TableHead>{t('Blood Type')}</TableHead>
                  <TableHead>{t('Urgency')}</TableHead>
                  <TableHead>{t('Action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emergencyRequests.map((req) => (
                  <TableRow key={req.id} className={req.status === 'In Progress' ? 'bg-primary/5' : ''}>
                    <TableCell className="font-medium">{t(req.patientName)}</TableCell>
                    <TableCell>{t(req.location)}</TableCell>
                    <TableCell><Badge variant="destructive">{req.bloodType}</Badge></TableCell>
                    <TableCell><Badge variant={req.urgency === 'Critical' ? 'destructive' : 'secondary'}>{t(req.urgency)}</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant={req.status === 'In Progress' ? 'secondary' : 'default'} disabled={!!activeRequest}>
                        {t(req.status === 'In Progress' ? 'Assigned' : 'Accept')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {activeRequest && (
            <Card>
                <CardHeader>
                    <CardTitle>{t('Active Coordination: #{id}').replace('{id}', activeRequest.id)}</CardTitle>
                    <CardDescription>{t('You are managing the request for {patientName}.').replace('{patientName}', t(activeRequest.patientName))}</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2">{t('Patient Details')}</h4>
                        <p className="text-sm"><strong>{t('Location')}:</strong> {t(activeRequest.location)}</p>
                        <p className="text-sm"><strong>{t('Blood Type')}:</strong> {activeRequest.bloodType}</p>
                        <p className="text-sm"><strong>{t('Urgency')}:</strong> {t(activeRequest.urgency)}</p>
                        <h4 className="font-semibold mt-4 mb-2">{t('Matched Donor')}</h4>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar"/>
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{t('Jane Doe')}</p>
                                <p className="text-xs text-muted-foreground">{t('2.1 miles away')}</p>
                            </div>
                            <div className="flex gap-1 ml-auto">
                                <Button size="icon" variant="outline"><Phone className="h-4 w-4"/></Button>
                                <Button size="icon" variant="outline"><MessageSquare className="h-4 w-4"/></Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">{t('Logistics Map')}</h4>
                        <div className="aspect-square w-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
                           <p className="text-white font-semibold">{t('Maps for navigation')}</p>
                        </div>
                    </div>
                </CardContent>
                 <CardFooter className="border-t pt-4">
                    <Button className="w-full" size="lg">{t('Mark as Completed')}</Button>
                </CardFooter>
            </Card>
        )}
      </div>

      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card>
            <CardHeader>
                <CardTitle>{t('Performance Metrics')}</CardTitle>
                <CardDescription>{t('Your impact as a volunteer.')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
                {volunteerStats.map(stat => (
                    <div key={stat.label} className="bg-muted p-4 rounded-lg">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{t(stat.label)}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('Communication Log')}</CardTitle>
            <CardDescription>{activeRequest ? t('Updates for request #{id}').replace('{id}', activeRequest.id) : ''}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {communicationLog.map((log) => (
                <li key={log.id} className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    {log.type === 'call' && <Phone className="h-4 w-4" />}
                    {log.type === 'message' && <MessageSquare className="h-4 w-4" />}
                    {log.type === 'status' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t(log.title)}</p>
                    <p className="text-xs text-muted-foreground">{t(log.description)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
