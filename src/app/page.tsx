import { Metadata } from 'next';
import { HomePage } from '@/components/features/home/HomePage';

export const metadata: Metadata = {
  title: 'MedBridges - Healthcare Job Marketplace',
  description: 'Connect with top healthcare professionals and find your dream medical job. MedBridges is the premier platform for doctors, nurses, and healthcare facilities.',
  keywords: ['healthcare jobs', 'medical careers', 'doctor recruitment', 'hospital staffing', 'locum tenens'],
};

export default function Page() {
  return <HomePage />;
}
