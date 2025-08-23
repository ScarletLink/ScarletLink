
import type { ChartConfig } from "@/components/ui/chart";
import { BarChart, Droplets, HeartHandshake, Users } from "lucide-react";

export const donationHistory = [
  { id: 'DH751', date: '2024-06-15', location: 'City General Hospital', amount: '450ml', status: 'Completed' },
  { id: 'DH882', date: '2024-01-20', location: 'Community Blood Center', amount: '450ml', status: 'Completed' },
  { id: 'DH923', date: '2023-08-10', location: 'Red Cross Mobile Unit', amount: '450ml', status: 'Completed' },
  { id: 'DH954', date: '2023-03-05', location: 'Community Blood Center', amount: '450ml', status: 'Completed' },
];

export const upcomingDrives = [
  {
    id: 'DRV001',
    title: 'Summer Blood Drive',
    date: '2024-08-01',
    location: 'Central Park',
    organizer: 'Red Cross',
  },
  {
    id: 'DRV002',
    title: 'University Campus Drive',
    date: '2024-09-10',
    location: 'State University Hall',
    organizer: 'Student Volunteers',
  },
];

export const analyticsData = {
  donationsOverTime: [
    { month: 'Jan', total: Math.floor(Math.random() * 500) + 100 },
    { month: 'Feb', total: Math.floor(Math.random() * 500) + 100 },
    { month: 'Mar', total: Math.floor(Math.random() * 500) + 100 },
    { month: 'Apr', total: Math.floor(Math.random() * 500) + 100 },
    { month: 'May', total: Math.floor(Math.random() * 500) + 100 },
    { month: 'Jun', total: Math.floor(Math.random() * 500) + 100 },
  ],
  bloodTypeDistribution: [
    { name: 'A+', value: 400, fill: 'var(--color-a-positive)' },
    { name: 'O+', value: 300, fill: 'var(--color-o-positive)' },
    { name: 'B+', value: 300, fill: 'var(--color-b-positive)' },
    { name: 'AB+', value: 200, fill: 'var(--color-ab-positive)' },
    { name: 'A-', value: 150, fill: 'var(--color-a-negative)' },
    { name: 'O-', value: 100, fill: 'var(--color-o-negative)' },
  ],
};

export const chartConfig = {
  total: { label: 'Total Donations' },
  'a-positive': { label: 'A+', color: 'hsl(var(--chart-1))' },
  'o-positive': { label: 'O+', color: 'hsl(var(--chart-2))' },
  'b-positive': { label: 'B+', color: 'hsl(var(--chart-3))' },
  'ab-positive': { label: 'AB+', color: 'hsl(var(--chart-4))' },
  'a-negative': { label: 'A-', color: 'hsl(var(--chart-5))' },
  'o-negative': { label: 'O-', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig;


export const emergencyUpdates = [
    {
        id: '1',
        time: '10:42 AM',
        title: 'Request Received',
        description: 'Emergency request for O- blood at City General Hospital.',
        status: 'completed',
    },
    {
        id: '2',
        time: '10:45 AM',
        title: 'Donors Notified',
        description: 'Alerts sent to 15 matching donors within a 5-mile radius.',
        status: 'completed',
    },
    {
        id: '3',
        time: '10:51 AM',
        title: 'Match Found',
        description: 'Donor Jane Doe is en route. ETA: 15 minutes.',
        status: 'active',
    },
    {
        id: '4',
        time: '11:05 AM',
        title: 'Donation in Progress',
        description: 'Jane Doe has arrived and the donation process has started.',
        status: 'pending',
    },
];

export const topDonors = [
    { name: 'Jane Doe', bloodType: 'O-', distance: '2.1 miles', avatar: '/avatars/01.png' },
    { name: 'John Smith', bloodType: 'O-', distance: '3.5 miles', avatar: '/avatars/02.png' },
    { name: 'Emily Jones', bloodType: 'O-', distance: '4.8 miles', avatar: '/avatars/03.png' },
];


export const users = [
    { id: 'USR001', name: 'Alex Johnson', role: 'Donor', location: 'New York, NY', bloodType: 'A+', avatar: '/avatars/01.png' },
    { id: 'USR002', name: 'Maria Garcia', role: 'Volunteer', location: 'Los Angeles, CA', bloodType: 'N/A', avatar: '/avatars/02.png' },
    { id: 'USR003', name: 'Dr. Chen Wei', role: 'Doctor', location: 'Chicago, IL', bloodType: 'N/A', avatar: '/avatars/03.png' },
    { id: 'USR004', name: 'Priya Patel', role: 'Donor', location: 'Houston, TX', bloodType: 'O+', avatar: '/avatars/04.png' },
    { id: 'USR005', name: 'David Miller', role: 'Patient', location: 'Phoenix, AZ', bloodType: 'B-', avatar: '/avatars/05.png' },
    { id: 'USR006', name: 'Sarah Wilson', role: 'Donor', location: 'Philadelphia, PA', bloodType: 'AB+', avatar: '/avatars/06.png' },
];

export const badges = [
    { name: 'First Donation', icon: HeartHandshake, achieved: true, description: 'Completed your first blood donation.' },
    { name: 'Five Timer', icon: HeartHandshake, achieved: true, description: 'Donated blood five times.' },
    { name: 'Ten Timer', icon: HeartHandshake, achieved: false, description: 'Donated blood ten times.' },
    { name: 'Recruiter', icon: Users, achieved: true, description: 'Referred a new donor.' },
    { name: 'Emergency Hero', icon: Droplets, achieved: false, description: 'Responded to an emergency request.' },
    { name: 'Community Leader', icon: BarChart, achieved: false, description: 'Organized a blood drive.' },
];

export const leaderboard = [
    { rank: 1, name: 'Alex Johnson', score: 1250, avatar: '/avatars/01.png' },
    { rank: 2, name: 'Priya Patel', score: 1100, avatar: '/avatars/04.png' },
    { rank: 3, name: 'Sarah Wilson', score: 950, avatar: '/avatars/06.png' },
    { rank: 4, name: 'John Smith', score: 800, avatar: '/avatars/02.png' },
    { rank: 5, name: 'Emily Jones', score: 720, avatar: '/avatars/03.png' },
];

export const rewards = [
    { title: 'Coffee Voucher', points: 500, image: 'coffee cup' },
    { title: 'Movie Ticket', points: 1000, image: 'movie ticket' },
    { title: 'Gift Card', points: 2500, image: 'gift card' },
    { title: 'Scarlet Link T-Shirt', points: 5000, image: 't-shirt' },
];

export const emergencyRequests = [
    { id: 'ER001', patientName: 'John Doe', location: 'City General Hospital', bloodType: 'B+', urgency: 'Critical', status: 'In Progress' },
    { id: 'ER002', patientName: 'Jane Smith', location: 'Downtown Medical Center', bloodType: 'O-', urgency: 'High', status: 'Pending' },
    { id: 'ER003', patientName: 'Peter Jones', location: 'Suburban Clinic', bloodType: 'A+', urgency: 'Medium', status: 'Pending' },
];

export const patientRequests = [
    { id: 'PR001', date: '2024-07-31', location: 'City General Hospital', bloodType: 'O-', status: 'In Progress' },
    { id: 'PR002', date: '2024-05-12', location: 'City General Hospital', bloodType: 'O-', status: 'Completed' },
    { id: 'PR003', date: '2024-02-03', location: 'Metro Health Clinic', bloodType: 'A+', status: 'Completed' },
];


export const communicationLog = [
    { id: 'C001', type: 'call', time: '11:58 AM', title: 'Call to Donor', description: 'Confirmed availability with Jane Doe.' },
    { id: 'C002', type: 'message', time: '12:02 PM', title: 'Message to Patient', description: 'Informed family that a donor has been found.' },
    { id: 'C003', type: 'status', time: '12:05 PM', title: 'Status Update', description: 'Donor is en-route to the hospital.' },
    { id: 'C004', type: 'status', time: '12:25 PM', title: 'Status Update', description: 'Blood collection has started.' },
];

export const volunteerStats = [
    { label: 'Lives Saved', value: 12 },
    { label: 'Success Rate', value: '92%' },
    { label: 'Avg. Response Time', value: '18 min' },
    { label: 'Total Hours', value: 140 },
];

export const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'mr', name: 'मराठी' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
];
