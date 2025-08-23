
/**
 * @fileOverview This file contains a mock service for the eRaktKosh API.
 * It simulates fetching nearby blood bank data to be used for demonstration
 * purposes within the Scarlet Link application.
 */

export interface BloodBank {
  // This interface defines the structure for a single blood bank entry.
  // The 'TOTAL' property is only present on the first object of the response array.
  TOTAL?: number; 
  name?: string;
  add?: string;
  ph?: string;
  type?: 'Private' | 'Govt.';
  email?: string;
  h_code?: string;
  dis?: string; // distance in km
  lat?: string;
  long?: string;
  available?: string; // Comma-separated blood types
  not_available?: string; // Comma-separated blood types
  lastUpdate?: string; // YYYY-MM-DD HH:MM:SS
}

export interface ERaktKoshResponse {
  // This interface defines the overall structure of the API response.
  rs: 'S' | 'F'; // Status: Success or Failure
  rc: string; // Response Code
  rd: string; // Response Description
  payload: {
    // The payload contains a stringified JSON array of blood bank data.
    response: string;
  };
}

// Mock data for Hyderabad-area blood banks.
const mockBloodBankData: BloodBank[] = [
    { TOTAL: 6 },
    {
      name: "Apollo Blood Bank, Jubilee Hills",
      add: "Apollo Hospitals, Rd No 72, Jubilee Hills, Hyderabad, Telangana",
      ph: "04023607777",
      type: "Private",
      email: "bloodbank.hyd@apollohospitals.com",
      h_code: "APH001",
      dis: "2.5",
      lat: "17.4202",
      long: "78.4013",
      available: "A+,B+,O+,AB+",
      not_available: "A-,B-,O-,AB-",
      lastUpdate: "2024-08-25 10:15:00",
    },
    {
      name: "KIMS Blood Bank, Secunderabad",
      add: "Krishna Institute of Medical Sciences, Minister Rd, Secunderabad",
      ph: "04044885000",
      type: "Private",
      email: "info@kimshospitals.com",
      h_code: "KIM001",
      dis: "4.8",
      lat: "17.4435",
      long: "78.4936",
      available: "A+,O+,A-,O-",
      not_available: "B+,B-,AB+,AB-",
      lastUpdate: "2024-08-25 09:45:00",
    },
    {
      name: "Govt. Blood Bank, Gandhi Hospital",
      add: "Gandhi Hospital Campus, Musheerabad, Secunderabad, Hyderabad",
      ph: "04027505566",
      type: "Govt.",
      email: "gandhi.bb@telangana.gov.in",
      h_code: "GOV001",
      dis: "5.2",
      lat: "17.4399",
      long: "78.4983",
      available: "O+,A+,B+,AB+",
      not_available: "A-,B-,O-,AB-",
      lastUpdate: "2024-08-25 11:00:00",
    },
    {
      name: "Red Cross Blood Bank, Vidyanagar",
      add: "Indian Red Cross Society, Vidyanagar, Hyderabad, Telangana",
      ph: "04027633646",
      type: "Govt.",
      email: "ircs.hyd@redcross.org",
      h_code: "RC001",
      dis: "8.1",
      lat: "17.4121",
      long: "78.5208",
      available: "A+,B+,O+,O-",
      not_available: "A-,B-,AB+,AB-",
      lastUpdate: "2024-08-25 08:30:00",
    },
    {
      name: "Care Blood Bank, Banjara Hills",
      add: "Care Hospitals, Rd No 1, Banjara Hills, Hyderabad, Telangana",
      ph: "04030418888",
      type: "Private",
      email: "contact@carehospitals.com",
      h_code: "CARE01",
      dis: "3.5",
      lat: "17.4151",
      long: "78.4452",
      available: "B-,O-,A-",
      not_available: "A+,B+,O+,AB+,AB-",
      lastUpdate: "2024-08-24 19:20:00",
    },
    {
      name: "Osmania General Hospital Blood Bank",
      add: "Afzal Gunj, Hyderabad, Telangana",
      ph: "04024600124",
      type: "Govt.",
      email: "osmania.hosp@gov.in",
      h_code: "GOV002",
      dis: "12.7",
      lat: "17.3713",
      long: "78.4752",
      available: "A+,B+,O+,AB+,A-,B-,O-",
      not_available: "AB-",
      lastUpdate: "2024-08-25 10:55:00",
    }
  ];
  
/**
 * Simulates calling the eRaktKosh API to find nearby blood banks.
 * @param latitude - The user's latitude.
 * @param longitude - The user's longitude.
 * @param bloodGroup - The requested blood group (e.g., 'A+', 'O-', or 'all').
 * @returns A promise that resolves to an ERaktKoshResponse object.
 */
export async function searchNearbyBloodBanks(
  latitude: number,
  longitude: number,
  bloodGroup: string
): Promise<ERaktKoshResponse> {
    console.log(`Simulating eRaktKosh API call for blood group: ${bloodGroup} at ${latitude}, ${longitude}`);
    
    // Simulate a 2-second network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Filter the mock data based on the requested blood group.
    let filteredBanks = mockBloodBankData.slice(1); // Exclude the TOTAL object for filtering
    if (bloodGroup !== 'all') {
        filteredBanks = filteredBanks.filter(bank => bank.available?.includes(bloodGroup));
    }
    
    // Re-add the TOTAL count object at the beginning of the array.
    const responseArray = [{ TOTAL: filteredBanks.length }, ...filteredBanks];
    
    // Construct the final API response object.
    const response: ERaktKoshResponse = {
        rs: 'S',
        rc: 'ER0000',
        rd: 'Success',
        payload: {
            response: JSON.stringify(responseArray),
        },
    };

    return response;
}
