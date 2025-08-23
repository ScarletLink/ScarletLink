
"use server";

import { alertsContainer, notificationsContainer } from "@/lib/azure-cosmos";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { revalidatePath } from "next/cache";

interface User {
  id: string;
  // other user properties
}

export async function sendEmergencyAlert(formData: FormData, userId: string) {
  if (!userId) {
    return {
      success: false,
      message: "User not authenticated. Could not send alert."
    };
  }
  
  try {
    if (!alertsContainer || !notificationsContainer) {
        console.error("❌ Azure Cosmos DB is not configured. Cannot send alert.");
        return {
            success: false,
            message: "Emergency alert system is not configured. Please contact support."
        };
    }
    
    const bloodType = formData.get("bloodType") as string;
    const location = formData.get("location") as string;
    const urgency = formData.get("urgency") as string;

    if (!bloodType || !location || !urgency) {
      return {
        success: false,
        message: "All fields are required"
      };
    }

    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const alertData = {
      id: alertId,
      patientId: userId, 
      bloodType: bloodType,
      location: location,
      urgency: urgency,
      status: "active",
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      unitsNeeded: 1,
      contactInfo: {
        phone: "To be added from user profile",
        emergencyContact: "To be added from user profile"
      }
    };

    console.log("🔄 Saving alert to Azure Cosmos DB...", alertId);

    const { resource: createdAlert } = await alertsContainer.items.create(alertData);
    
    if (!createdAlert) {
      throw new Error("Failed to create alert resource.");
    }
    
    console.log("✅ Alert successfully saved to Azure Cosmos DB:", createdAlert.id);

    // Trigger notification creation for matching users
    await createNotificationsForAlert(createdAlert);
    
    revalidatePath("/emergency");
    revalidatePath("/alerts");
    revalidatePath("/profile");

    return { 
      success: true, 
      message: "Emergency alert sent successfully! Help is on the way.",
      alertId: createdAlert.id,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("❌ Error saving alert to Azure Cosmos DB:", error);
    
    return { 
      success: false, 
      message: "Failed to send emergency alert. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Finds matching users and creates a notification for each of them.
 * @param alert The alert object created in Cosmos DB.
 */
async function createNotificationsForAlert(alert: any) {
  if (!notificationsContainer) {
    console.error("❌ Notifications container is not configured. Cannot create notifications.");
    return;
  }
  
  console.log(`🔍 Finding matching donors for blood type: ${alert.bloodType}`);

  // In a real application, you would query your user database (e.g., Firestore)
  // to find all users who are donors and match the blood type.
  // For now, we will simulate finding one user to create a notification for.
  
  // Example of how you *would* query Firestore if you had a 'users' collection with 'bloodType' and 'role' fields:
  // const usersRef = collection(db, "users");
  // const q = query(usersRef, where("bloodType", "==", alert.bloodType), where("role", "==", "Donor"));
  // const querySnapshot = await getDocs(q);
  // const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // For this demo, we'll create a notification for a test user.
  // In a real scenario, you'd loop through the 'users' array from the query above.
  const testRecipientId = "donor_test_123"; // This should be a real user ID from your user base.

  const notificationData = {
    id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipientId: testRecipientId, // This is the partition key
    alertId: alert.id,
    title: `🚨 Urgent Need: ${alert.bloodType} Blood`,
    message: `An urgent request for ${alert.bloodType} blood at ${alert.location}.`,
    timestamp: new Date().toISOString(),
    read: false,
    bloodType: alert.bloodType,
    location: alert.location,
    urgency: alert.urgency,
  };

  try {
    console.log(`🔄 Creating notification for user: ${testRecipientId}`);
    const { resource: createdNotification } = await notificationsContainer.items.create(notificationData);
    console.log("✅ Notification successfully created:", createdNotification?.id);
  } catch (error) {
    console.error(`❌ Error creating notification for user ${testRecipientId}:`, error);
  }
}
