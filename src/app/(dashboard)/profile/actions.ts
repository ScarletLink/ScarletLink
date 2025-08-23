
'use server';

import { alertsContainer, profilesContainer } from "@/lib/azure-cosmos";
import { revalidatePath } from "next/cache";
import type { Alert } from '@/app/(dashboard)/alerts/actions';


// Define the structure of the profile data
export interface ProfileData {
  id: string;
  userId: string;
  email: string;
  personalInfo?: {
    fullName?: string;
    bio?: string;
    profilePicture?: string;
  };
  contactInfo?: {
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    }
  };
  donorInfo?: {
    bloodType?: string;
    weight?: number;
    height?: number;
    allergies?: string;
    medicalCertificate?: string;
    isVerified?: boolean;
  };
  updatedAt: string;
}


// Server Action to get the user's profile
export async function getProfileAction(userId: string, userEmail: string): Promise<{ success: boolean; data?: ProfileData | null; error?: string; }> {
  if (!userId || !userEmail) {
    return { success: false, error: "User not authenticated." };
  }
  if (!profilesContainer) {
    return { success: false, error: "Database not configured." };
  }

  try {
    // The partition key is the user's email
    const { resource } = await profilesContainer.item(`profile_${userId}`, userEmail).read();
    return { success: true, data: resource as ProfileData };
  } catch (error: any) {
    if (error.code === 404) {
        return { success: true, data: null }; // Profile doesn't exist yet, which is not an error
    }
    console.error("Error fetching profile from Cosmos DB:", error);
    return { success: false, error: "Failed to fetch profile data." };
  }
}

// Server Action to save the user's profile
export async function saveProfileAction(userId: string, userEmail: string, formData: FormData): Promise<{ success: boolean, data?: ProfileData, error?: string }> {
  if (!userId || !userEmail) {
    return { success: false, error: "User not authenticated." };
  }
  if (!profilesContainer) {
    return { success: false, error: "Database not configured." };
  }
  
  try {
    const existingProfileResult = await getProfileAction(userId, userEmail);

    // In a real app, you would upload files to Azure Blob Storage here
    // and get back URLs. For now, we'll use placeholder text.
    const profilePictureFile = formData.get('profilePicture') as File;
    const medicalCertFile = formData.get('medicalCertificate') as File;
    
    let profilePictureUrl = existingProfileResult.data?.personalInfo?.profilePicture;
    if (profilePictureFile && profilePictureFile.size > 0) {
        profilePictureUrl = `/uploads/placeholder_profile_${userId}.png`; // Placeholder
    }

    let medicalCertificateUrl = existingProfileResult.data?.donorInfo?.medicalCertificate;
    if (medicalCertFile && medicalCertFile.size > 0) {
        medicalCertificateUrl = `/uploads/placeholder_cert_${userId}.pdf`; // Placeholder
    }

    const existingIsVerified = existingProfileResult.data?.donorInfo?.isVerified ?? false;

    const profileData: ProfileData = {
        id: `profile_${userId}`,
        userId: userId,
        email: userEmail, // Partition Key
        personalInfo: {
            fullName: formData.get('fullName') as string,
            bio: formData.get('bio') as string,
            profilePicture: profilePictureUrl
        },
        contactInfo: {
            phone: formData.get('phone') as string,
            address: {
                street: formData.get('street') as string,
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                zip: formData.get('zip') as string,
                country: formData.get('country') as string,
            }
        },
        donorInfo: {
            bloodType: formData.get('bloodType') as string,
            weight: parseInt(formData.get('weight') as string, 10),
            height: parseInt(formData.get('height') as string, 10),
            allergies: formData.get('allergies') as string,
            medicalCertificate: medicalCertificateUrl,
            isVerified: existingIsVerified,
        },
        updatedAt: new Date().toISOString()
    };
    
    const { resource: updatedProfile } = await profilesContainer.items.upsert(profileData);
    
    revalidatePath('/profile');
    
    return { success: true, data: updatedProfile as ProfileData };
  } catch (error) {
    console.error("Error saving profile to Cosmos DB:", error);
    return { success: false, error: "Failed to save profile." };
  }
}

// Server action to get all requests for a specific user
export async function getUserRequestsAction(userId: string): Promise<{ success: boolean; data?: Alert[]; error?: string; }> {
    if (!userId) {
        return { success: false, error: "User not authenticated." };
    }
    if (!alertsContainer) {
        return { success: false, error: "Database not configured." };
    }

    try {
        const querySpec = {
            query: "SELECT * FROM c WHERE c.patientId = @userId ORDER BY c.timestamp DESC",
            parameters: [
                { name: "@userId", value: userId }
            ]
        };

        const { resources } = await alertsContainer.items.query(querySpec).fetchAll();
        return { success: true, data: resources as Alert[] };
    } catch (error) {
        console.error("Error fetching user requests from Cosmos DB:", error);
        return { success: false, error: "Failed to fetch request history." };
    }
}
