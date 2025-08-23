
'use client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie } from "recharts";
import { analyticsData } from "@/lib/data";
import { Droplets, Users, HeartPulse, Siren, TrendingUp, ShieldCheck, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useEffect, useState } from "react";
import { searchNearbyBloodBanks, type BloodBank } from "@/services/eraktkosh";
import { cn } from "@/lib/utils";


const getBadgeVariant = (status: 'Stable' | 'Low' | 'Critical') => {
    switch(status) {
        case 'Stable': return 'success';
        case 'Low': return 'warning';
        case 'Critical': return 'destructive';
        default: return 'outline';
    }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {t('Month')}
            </span>
            <span className="font-bold text-muted-foreground">
              {t(label)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {t('Donations')}
            </span>
            <span className="font-bold">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

type InventoryStatus = {
  type: string;
  status: 'Stable' | 'Low' | 'Critical';
  banksAvailable: number;
  totalBanks: number;
};


export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState<InventoryStatus[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);


  const translatedAnalyticsData = {
    ...analyticsData,
    donationsOverTime: analyticsData.donationsOverTime.map(d => ({...d, month: t(d.month)}))
  }
  
  useEffect(() => {
    async function fetchInventory() {
      setIsLoadingInventory(true);
      try {
        const response = await searchNearbyBloodBanks(17.43, 78.40, 'all');
        if (response.payload.response) {
            const data: BloodBank[] = JSON.parse(response.payload.response);
            const totalBanks = data.find(item => 'TOTAL' in item)?.TOTAL ?? data.length - 1;
            const bloodBanks = data.filter(item => 'name' in item);

            const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
            
            const statusSummary = allBloodTypes.map(bloodType => {
              const banksWithStock = bloodBanks.filter(bank => bank.available.includes(bloodType)).length;
              const percentage = (banksWithStock / totalBanks) * 100;
              let status: 'Stable' | 'Low' | 'Critical' = 'Stable';
              if (percentage < 30) {
                status = 'Critical';
              } else if (percentage < 60) {
                status = 'Low';
              }
              return {
                type: bloodType,
                status: status,
                banksAvailable: banksWithStock,
                totalBanks: totalBanks
              };
            });
            setInventory(statusSummary);
        }
      } catch (error) {
        console.error("Failed to fetch inventory data", error);
        // Here you could set a default/fallback inventory
      } finally {
        setIsLoadingInventory(false);
      }
    }
    fetchInventory();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('Total Donors')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,234</div>
            <p className="text-xs text-muted-foreground">{t('+20.1% from last month')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('Units Collected (Today)')}</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+250</div>
            <p className="text-xs text-muted-foreground">{t('City General Drive')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('Active Emergencies')}</CardTitle>
            <Siren className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">{t('2 resolved today')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('Volunteer Hours')}</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,200</div>
            <p className="text-xs text-muted-foreground">{t('+12 since last week')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp/>{t('Donations Over Time')}</CardTitle>
            <CardDescription>{t('Total units collected per month this year.')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={translatedAnalyticsData.donationsOverTime}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Droplets/>{t('Blood Type Distribution')}</CardTitle>
            <CardDescription>{t('Distribution of available blood units.')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                 <Tooltip cursor={{ fill: "hsl(var(--muted))" }}/>
                 <Legend layout="vertical" verticalAlign="middle" align="right" iconSize={8} />
                 <Pie data={analyticsData.bloodTypeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
                            {`${(percent * 100).toFixed(0)}%`}
                        </text>
                    );
                 }}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('Live Inventory Status')}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            {t('Inventory levels across Hyderabad blood banks.')}
            <Badge variant="outline" className="text-xs">
                <ShieldCheck className="h-3 w-3 mr-1 text-green-600"/>
                {t('Data Source: eRaktKosh (Simulated)')}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoadingInventory ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-3 text-muted-foreground">{t('Fetching live inventory...')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {inventory.map((bloodType) => (
                    <div key={bloodType.type} className="flex items-start gap-4 p-4 rounded-lg border bg-card flex-1 min-w-[150px]">
                        <span className="font-headline text-2xl font-bold text-primary">{bloodType.type}</span>
                        <div className="flex-1">
                          <Badge variant={getBadgeVariant(bloodType.status)} className={cn("text-xs", {
                            'bg-green-100 text-green-800 border-green-200': bloodType.status === 'Stable',
                            'bg-yellow-100 text-yellow-800 border-yellow-200': bloodType.status === 'Low',
                            'bg-red-100 text-red-800 border-red-200': bloodType.status === 'Critical'
                          })}>{t(bloodType.status)}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{t('{count} of {total} banks').replace('{count}', bloodType.banksAvailable.toString()).replace('{total}', bloodType.totalBanks.toString())}</p>
                        </div>
                    </div>
                ))}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
