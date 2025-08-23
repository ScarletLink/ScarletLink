
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload, Loader2, CheckCircle, Circle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';
import { getProfileAction, saveProfileAction, getUserRequestsAction } from './actions';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { ProfileData } from './actions';
import type { Alert } from '../alerts/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { emergencyUpdates } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';


const profileFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  bio: z.string().max(160).optional(),
});

const contactInfoFormSchema = z.object({
    phone: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
});

const donorInfoFormSchema = z.object({
    bloodType: z.string().min(2, "Required"),
    weight: z.coerce.number().positive("Must be positive"),
    height: z.coerce.number().positive("Must be positive"),
    allergies: z.string().optional(),
});

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'resolved':
      return 'outline';
    case 'in-progress':
      return 'secondary';
    case 'active':
      return 'destructive';
    default:
      return 'default';
  }
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userRequests, setUserRequests] = useState<Alert[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  const profilePictureRef = useRef<HTMLInputElement>(null);
  const medicalCertRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.displayName ?? '',
      email: user?.email ?? '',
      bio: '',
    },
  });

  const contactInfoForm = useForm<z.infer<typeof contactInfoFormSchema>>({
    resolver: zodResolver(contactInfoFormSchema),
    defaultValues: {
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    }
  });

  const donorInfoForm = useForm<z.infer<typeof donorInfoFormSchema>>({
    resolver: zodResolver(donorInfoFormSchema),
    defaultValues: {
        bloodType: "A+",
        weight: 0,
        height: 0,
        allergies: ""
    }
  });

  const loadData = useCallback(async () => {
    if (!user?.uid || !user?.email) return;
    
    setIsLoading(true);
    setIsLoadingRequests(true);

    // Fetch profile
    try {
        const profileResult = await getProfileAction(user.uid, user.email);
        if (profileResult.success && profileResult.data) {
          setProfileData(profileResult.data);
          profileForm.reset({
            fullName: profileResult.data.personalInfo?.fullName || user.displayName || '',
            email: user.email || '',
            bio: profileResult.data.personalInfo?.bio || '',
          });
          contactInfoForm.reset({
            phone: profileResult.data.contactInfo?.phone || "",
            street: profileResult.data.contactInfo?.address?.street || "",
            city: profileResult.data.contactInfo?.address?.city || "",
            state: profileResult.data.contactInfo?.address?.state || "",
            zip: profileResult.data.contactInfo?.address?.zip || "",
            country: profileResult.data.contactInfo?.address?.country || ""
          })
          donorInfoForm.reset({
            bloodType: profileResult.data.donorInfo?.bloodType || "A+",
            weight: profileResult.data.donorInfo?.weight || 0,
            height: profileResult.data.donorInfo?.height || 0,
            allergies: profileResult.data.donorInfo?.allergies || "",
          });
        } else if (profileResult.error) {
          toast({
            variant: 'destructive',
            title: t('Failed to load profile'),
            description: t(profileResult.error),
          });
        }
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: t('Error loading profile') });
    } finally {
        setIsLoading(false);
    }
    

    // Fetch user requests
    try {
        const requestsResult = await getUserRequestsAction(user.uid);
        if (requestsResult.success && requestsResult.data) {
            setUserRequests(requestsResult.data);
        } else {
             toast({
                variant: 'destructive',
                title: t('Failed to load requests'),
                description: t(requestsResult.error || "Could not fetch your request history."),
            });
        }
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: t('Error loading requests') });
    } finally {
        setIsLoadingRequests(false);
    }

  }, [user, toast, t, profileForm, donorInfoForm, contactInfoForm]);

  useEffect(() => {
    if(user) {
        loadData();
    }
  }, [user, loadData]);

  async function handleSave(
    profileValues: z.infer<typeof profileFormSchema>,
    contactValues: z.infer<typeof contactInfoFormSchema>,
    donorValues: z.infer<typeof donorInfoFormSchema>
  ) {
    if (!user || !user.email) return;

    setIsSaving(true);
    
    const profilePictureFile = profilePictureRef.current?.files?.[0];
    const medicalCertFile = medicalCertRef.current?.files?.[0];

    const formData = new FormData();
    // Personal Info
    formData.append('fullName', profileValues.fullName);
    formData.append('bio', profileValues.bio || '');
    if (profilePictureFile) {
        formData.append('profilePicture', profilePictureFile);
    }
     // Contact Info
    formData.append('phone', contactValues.phone || '');
    formData.append('street', contactValues.street || '');
    formData.append('city', contactValues.city || '');
    formData.append('state', contactValues.state || '');
    formData.append('zip', contactValues.zip || '');
    formData.append('country', contactValues.country || '');
    // Donor Info
    formData.append('bloodType', donorValues.bloodType);
    formData.append('weight', String(donorValues.weight));
    formData.append('height', String(donorValues.height));
    formData.append('allergies', donorValues.allergies || '');
    if (medicalCertFile) {
        formData.append('medicalCertificate', medicalCertFile);
    }

    const result = await saveProfileAction(user.uid, user.email, formData);

    if (result.success && result.data) {
      toast({ title: t('Profile updated successfully!') });
      setProfileData(result.data);
    } else {
       toast({
          variant: 'destructive',
          title: t('Failed to save profile'),
          description: t(result.error || "An unknown error occurred."),
        });
    }
    setIsSaving(false);
  }

  const onCombinedSubmit = () => {
    const profileValues = profileForm.getValues();
    const contactValues = contactInfoForm.getValues();
    const donorValues = donorInfoForm.getValues();
    handleSave(profileValues, contactValues, donorValues);
  }
  
  const getAvatarFallback = () => {
    if (user?.displayName) return user.displayName.substring(0, 2).toUpperCase();
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return <User />;
  }

  const profilePictureUrl = profileData?.personalInfo?.profilePicture || user?.photoURL;
  const activeRequest = userRequests.find(r => r.status === 'active' || r.status === 'in-progress');


  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <CardHeader className="items-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={profilePictureUrl ?? ''} alt={user?.displayName ?? ''} data-ai-hint="person avatar"/>
                        <AvatarFallback>
                            {getAvatarFallback()}
                        </AvatarFallback>
                    </Avatar>
                     <input type="file" ref={profilePictureRef} className="hidden" id="profile-picture-upload" accept="image/*" />
                    <Button variant="outline" onClick={() => profilePictureRef.current?.click()}><Upload className="mr-2"/> {t('Upload Picture')}</Button>
                </CardHeader>
                <CardContent className="text-center">
                    <CardTitle className="text-2xl">{profileForm.watch('fullName')}</CardTitle>
                    <CardDescription>{user?.email}</CardDescription>
                </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('My Requests')}</CardTitle>
                <CardDescription>{t('A history of your emergency blood requests.')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('Date')}</TableHead>
                      <TableHead>{t('Status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingRequests ? (
                        <TableRow><TableCell colSpan={2} className="text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></TableCell></TableRow>
                    ) : userRequests.length > 0 ? (
                        userRequests.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell>{format(new Date(request.timestamp), "yyyy-MM-dd")}</TableCell>
                            <TableCell><Badge variant={getStatusBadgeVariant(request.status)}>{t(request.status)}</Badge></TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow><TableCell colSpan={2} className="text-center">{t('No requests found.')}</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {activeRequest && (
            <Card>
              <CardHeader>
                  <CardTitle>{t('Active Request Status')}</CardTitle>
                  <CardDescription>{t('Tracking your latest emergency request')}</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="relative pl-6">
                      <div className="absolute left-[11px] top-0 h-full w-0.5 bg-border"></div>
                      {/* This part still uses mock data, needs to be adapted to real alert structure */}
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
          )}
        </div>
      <div className="lg:col-span-2 flex flex-col gap-6">
       {isLoading ? (
        <Card>
          <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
          <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
        </Card>
       ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('Personal Information')}</CardTitle>
            <CardDescription>
              {t('Update your personal details here.')}
            </CardDescription>
          </CardHeader>
          <Form {...profileForm}>
            <form onSubmit={(e) => { e.preventDefault(); onCombinedSubmit(); }}>
              <CardContent className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Full Name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('Your full name')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Email')}</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} disabled/>
                      </FormControl>
                      <FormDescription>
                        {t("You can't change your email address.")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Bio')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('Tell us a little bit about yourself')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              {/* No separate submit for this card */}
            </form>
          </Form>
        </Card>
       )}

      {isLoading ? (
        <Card>
            <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      ) : (
        <Card>
            <CardHeader>
                <CardTitle>{t('Contact Information')}</CardTitle>
                <CardDescription>{t('Provide your contact and address details.')}</CardDescription>
            </CardHeader>
            <Form {...contactInfoForm}>
                <form onSubmit={(e) => { e.preventDefault(); onCombinedSubmit(); }}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={contactInfoForm.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Phone Number')}</FormLabel>
                                    <FormControl><Input placeholder={t('Your phone number')} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={contactInfoForm.control}
                            name="street"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('Street Address')}</FormLabel>
                                    <FormControl><Input placeholder={t('123 Main St')} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                           <FormField
                                control={contactInfoForm.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('City')}</FormLabel>
                                        <FormControl><Input placeholder={t('New York')} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={contactInfoForm.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('State / Province')}</FormLabel>
                                        <FormControl><Input placeholder={t('NY')} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                           <FormField
                                control={contactInfoForm.control}
                                name="zip"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('ZIP / Postal Code')}</FormLabel>
                                        <FormControl><Input placeholder={t('10001')} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={contactInfoForm.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('Country')}</FormLabel>
                                        <FormControl><Input placeholder={t('USA')} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
      )}
        
       {isLoading ? (
        <Card>
          <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
          <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
        </Card>
       ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('Donor Information')}</CardTitle>
            <CardDescription>
              {t('This information is crucial for matching you with patients.')}
            </CardDescription>
          </CardHeader>
          <Form {...donorInfoForm}>
            <form onSubmit={(e) => { e.preventDefault(); onCombinedSubmit(); }}>
              <CardContent className="space-y-4">
                <FormField
                  control={donorInfoForm.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Blood Type')}</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('Select your blood type')} />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={donorInfoForm.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Weight (kg)')}</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="70" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={donorInfoForm.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Height (cm)')}</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="175" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                 <FormField
                  control={donorInfoForm.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Allergies')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('List any known allergies...')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                    <FormLabel>{t('Medical Certificate')}</FormLabel>
                    <FormControl>
                        <Input type="file" ref={medicalCertRef} />
                    </FormControl>
                    <FormDescription>{t('Upload a certificate to verify your blood type.')}</FormDescription>
                </FormItem>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {t('Save All Changes')}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
       )}
      </div>
    </div>
  );
}
