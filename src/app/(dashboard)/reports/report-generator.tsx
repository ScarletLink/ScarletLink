
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateReportAction } from './actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, AlertTriangle, BarChart2 } from 'lucide-react';
import type { GenerateShortageReportsOutput } from '@/ai/flows/generate-shortage-reports';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

const formSchema = z.object({
  reportType: z.enum(['weekly', 'monthly']),
});

export function ReportGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<GenerateShortageReportsOutput | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportType: 'weekly',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setReportData(null);

    const result = await generateReportAction(values);

    if (result.success && result.data) {
      setReportData(result.data);
    } else {
      toast({
        variant: "destructive",
        title: t("Report Generation Failed"),
        description: t(result.error || "An unknown error occurred."),
      });
    }

    setIsLoading(false);
  }

  const chartData = reportData?.dataCharts;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('AI Prediction Tool')}</CardTitle>
          <CardDescription>{t('Generate blood shortage reports using predictive analytics based on historical and current data.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-end gap-4">
              <FormField
                control={form.control}
                name="reportType"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-auto flex-grow">
                    <FormLabel>{t('Report Type')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('Select a report type')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">{t('Weekly Report')}</SelectItem>
                        <SelectItem value="monthly">{t('Monthly Report')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Generating...')}
                  </>
                ) : (
                  t('Generate Report')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {reportData && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText/>{t('Generated Report')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{t(reportData.report)}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>{t('Critical Shortage Alerts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t(reportData.alertSummary)}</p>
              </CardContent>
            </Card>

            {chartData && chartData.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BarChart2 />{t('Data Visualization')}</CardTitle>
                  <CardDescription>{t(chartData.title)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                      />
                      <Legend />
                      <Bar dataKey="predictedShortage" fill="hsl(var(--destructive))" name={t(chartData.dataKeys.predictedShortage)} />
                      <Bar dataKey="expectedDonations" fill="hsl(var(--primary))" name={t(chartData.dataKeys.expectedDonations)} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
