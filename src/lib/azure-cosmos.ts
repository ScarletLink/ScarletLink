import 'dotenv/config';
import { CosmosClient } from "@azure/cosmos";

// Environment variables are optional now, to allow the app to build before secrets are set.
const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
const key = process.env.AZURE_COSMOS_KEY;
const databaseId = process.env.AZURE_COSMOS_DATABASE_ID || "BloodDonationPlatform";

// Conditionally create Cosmos client only if credentials are provided
let cosmosClient: CosmosClient | null = null;
if (endpoint && key) {
  try {
    cosmosClient = new CosmosClient({ endpoint, key });
  } catch (error) {
    console.error("❌ Error creating Cosmos client, likely due to invalid URL format in environment variables:", error);
  }
} else {
  console.warn("⚠️ Azure Cosmos DB credentials are not set. Emergency features will be disabled.");
}

// Export the database and containers, which will be null if the client is not initialized.
// The server action will need to handle this case.
export const database = cosmosClient ? cosmosClient.database(databaseId) : null;
export const alertsContainer = database ? database.container("alerts") : null;
export const notificationsContainer = database ? database.container("notifications") : null;
export const profilesContainer = database ? database.container("profiles") : null;


// Helper function to test connection
export async function testCosmosConnection() {
  if (!database) {
    console.error("❌ Cannot test Cosmos DB connection, client not initialized.");
    return false;
  }
  try {
    const { resource } = await database.read();
    console.log("✅ Connected to Azure Cosmos DB:", resource?.id);
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to Azure Cosmos DB:", error);
    return false;
  }
}
