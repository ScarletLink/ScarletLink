
'use server';

import { alertsContainer } from '@/lib/azure-cosmos';
import { z } from 'zod';

const AlertSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  location: z.string(),
  bloodType: z.string(),
  urgency: z.string(),
  status: z.string(),
  patientId: z.string(),
});

export type Alert = z.infer<typeof AlertSchema>;

export async function getAlertsAction(): Promise<Alert[]> {
  if (!alertsContainer) {
    console.error('Azure Cosmos DB is not configured. Cannot fetch alerts.');
    // In a real app, you might want to throw an error or handle this differently.
    return [];
  }

  try {
    const { resources } = await alertsContainer.items.readAll().fetchAll();
    // Sort by timestamp in descending order (most recent first)
    const sortedAlerts = resources.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    // Validate the data against the schema
    return z.array(AlertSchema).parse(sortedAlerts);
  } catch (error) {
    console.error('Error fetching alerts from Cosmos DB:', error);
    if (error instanceof z.ZodError) {
        console.error("Data validation failed:", error.issues);
    }
    return []; // Return empty array on error
  }
}


export async function getLatestAlertAction(): Promise<{ success: boolean; data?: Alert | null; error?: string; }> {
  if (!alertsContainer) {
    return { success: false, error: "Database not configured." };
  }

  try {
    const querySpec = {
      query: "SELECT TOP 1 * FROM c WHERE c.status = 'active' ORDER BY c.timestamp DESC"
    };
    
    const { resources } = await alertsContainer.items.query(querySpec).fetchAll();
    
    if (resources.length > 0) {
      return { success: true, data: resources[0] as Alert };
    } else {
      return { success: true, data: null }; // No active alerts found
    }
  } catch (error) {
    console.error("Error fetching latest alert from Cosmos DB:", error);
    return { success: false, error: "Failed to fetch latest alert." };
  }
}
