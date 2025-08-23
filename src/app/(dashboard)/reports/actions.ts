"use server";

import { generateShortageReports } from "@/ai/flows/generate-shortage-reports";
import type { GenerateShortageReportsInput } from "@/ai/flows/generate-shortage-reports";

const historicalData = {
  "last_3_months": [
    {"month": "April", "donations": 1200, "usage": 1150},
    {"month": "May", "donations": 1350, "usage": 1400},
    {"month": "June", "donations": 1300, "usage": 1320}
  ],
  "blood_type_demand": {
    "O-": "high",
    "O+": "medium",
    "A-": "high",
    "A+": "stable",
    "B-": "low",
    "B+": "stable",
    "AB-": "critical",
    "AB+": "stable"
  }
};

const currentTrends = {
  "upcoming_holidays": ["Labor Day"],
  "seasonal_illness_spike": "low",
  "recent_disasters": "none",
  "active_blood_drives": 15,
  "media_campaigns": "active"
};

export async function generateReportAction(values: { reportType: "weekly" | "monthly" }) {
    try {
        const input: GenerateShortageReportsInput = {
            reportType: values.reportType,
            historicalData: JSON.stringify(historicalData),
            currentTrends: JSON.stringify(currentTrends),
        };

        const result = await generateShortageReports(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error generating report:", error);
        return { success: false, error: "Failed to generate report. Please try again." };
    }
}
