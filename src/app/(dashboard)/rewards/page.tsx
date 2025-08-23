
'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { badges, leaderboard, rewards } from '@/lib/data';
import { Award, Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-translation';

export default function RewardsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Award /> {t('Badge Collection')}</CardTitle>
          <CardDescription>{t('Celebrate your milestones and achievements.')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {badges.map((badge) => (
            <div key={badge.name} className={cn("flex flex-col items-center gap-2", !badge.achieved && "opacity-40")}>
              <div className={cn("p-4 rounded-full", badge.achieved ? "bg-primary/10" : "bg-muted")}>
                <badge.icon className={cn("h-8 w-8", badge.achieved ? "text-primary" : "text-muted-foreground")} />
              </div>
              <p className="font-semibold text-sm">{t(badge.name)}</p>
              <p className="text-xs text-muted-foreground">{t(badge.description)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="donors">
            <div className="flex justify-between items-center mb-4">
                <CardTitle className="flex items-center gap-2"><Trophy /> {t('Leaderboards')}</CardTitle>
                <TabsList>
                    <TabsTrigger value="donors">{t('Top Donors')}</TabsTrigger>
                    <TabsTrigger value="volunteers">{t('Top Volunteers')}</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="donors">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('Rank')}</TableHead>
                      <TableHead>{t('User')}</TableHead>
                      <TableHead className="text-right">{t('Score')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((user) => (
                      <TableRow key={user.rank}>
                        <TableCell className="font-bold text-lg">{user.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name.charAt(0)}`} data-ai-hint="person avatar"/>
                              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{t(user.name)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{t('{score} pts').replace('{score}', user.score.toLocaleString())}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            <TabsContent value="volunteers">
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  {t('Volunteer leaderboards coming soon!')}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('Next Goal')}</CardTitle>
                    <CardDescription>{t("You're close to your next achievement!")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{t('Ten Timer Badge')}</span>
                            <span className="text-sm text-muted-foreground">{t('{x_of_y_donations}').replace('{x_of_y_donations}', '4 / 10')}</span>
                        </div>
                        <Progress value={40} />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{t('Next Reward Tier')}</span>
                            <span className="text-sm text-muted-foreground">{t('{x_of_y_points}').replace('{x_of_y_points}', '1,250 / 2,500')}</span>
                        </div>
                        <Progress value={50} />
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Star /> {t('Rewards Catalog')}</CardTitle>
          <CardDescription>{t('Redeem your hard-earned points for exclusive rewards.')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {rewards.map((reward) => (
            <Card key={reward.title}>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                   <Image src={`https://placehold.co/300x150.png`} width={300} height={150} alt={reward.title} data-ai-hint={reward.image} className="rounded-t-lg"/>
                </div>
              </CardContent>
              <div className="p-4">
                 <h3 className="font-semibold">{t(reward.title)}</h3>
                 <p className="text-sm text-muted-foreground">{t('{points} Points').replace('{points}', reward.points.toLocaleString())}</p>
              </div>
              <CardFooter>
                <Button variant="outline" className="w-full">{t('Redeem')}</Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
