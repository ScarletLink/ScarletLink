
'use server';

import { notificationsContainer } from "@/lib/azure-cosmos";
import { User } from "firebase/auth";

// Define the structure of a notification
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  recipientId: string;
}

export async function getNotificationsAction(userId: string): Promise<Notification[]> {
  if (!userId) {
    console.log("No authenticated user ID provided. Cannot fetch notifications.");
    return [];
  }

  if (!notificationsContainer) {
    console.error("Azure Cosmos DB is not configured. Cannot fetch notifications.");
    return [];
  }

  try {
    console.log(`Querying notifications for user: ${userId}`);
    const { resources } = await notificationsContainer.items
      .query({
        query: `SELECT * FROM c WHERE c.recipientId = @userId ORDER BY c.timestamp DESC`,
        parameters: [{ name: "@userId", value: userId }],
      })
      .fetchAll();
    
    console.log(`Found ${resources.length} notifications.`);
    return resources as Notification[];
  } catch (error) {
    console.error("Error fetching notifications from Cosmos DB:", error);
    return [];
  }
}
