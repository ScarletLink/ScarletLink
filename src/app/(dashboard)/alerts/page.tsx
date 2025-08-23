
'use client';

import 'dotenv/config';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';
import { useEffect, useState } from 'react';
import type { Alert } from './actions';
import { getAlertsAction } from './actions';

const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active':
            return 'destructive';
        case 'in-progress':
            return 'secondary';
        case 'resolved':
            return 'default';
        default:
            return 'outline';
    }
};

const getUrgencyVariant = (urgency: string) => {
    switch (urgency.toLowerCase()) {
        case 'critical':
            return 'destructive';
        case 'high':
            return 'secondary';
        default:
            return 'outline';
    }
};


export default function AlertsPage() {
    const { t } = useTranslation();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAlerts() {
            setLoading(true);
            const fetchedAlerts = await getAlertsAction();
            setAlerts(fetchedAlerts);
            setLoading(false);
        }
        loadAlerts();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('Emergency Alert History')}</CardTitle>
                <CardDescription>
                    {t('A log of all emergency alerts sent through the system.')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('Timestamp')}</TableHead>
                            <TableHead>{t('Location/Hospital')}</TableHead>
                            <TableHead>{t('Blood Type')}</TableHead>
                            <TableHead>{t('Urgency')}</TableHead>
                            <TableHead>{t('Status')}</TableHead>
                            <TableHead>{t('Sender ID')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    {t('Loading alerts...')}
                                </TableCell>
                            </TableRow>
                        ) : alerts.length > 0 ? (
                            alerts.map((alert) => (
                                <TableRow key={alert.id}>
                                    <TableCell className="font-medium">
                                        {format(new Date(alert.timestamp), "yyyy-MM-dd hh:mm a")}
                                    </TableCell>
                                    <TableCell>{alert.location}</TableCell>
                                    <TableCell>
                                        <Badge variant="destructive">{alert.bloodType}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getUrgencyVariant(alert.urgency)}>{t(alert.urgency)}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(alert.status)}>{t(alert.status)}</Badge>
                                    </TableCell>
                                    <TableCell>{alert.patientId}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    {t('No alerts found.')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
