import { Metadata } from 'next';
import { OfflineContainer } from '@/components/features/offline/OfflineContainer';

export const metadata: Metadata = {
  title: "You're Offline | Med-Bridge",
  description: "It looks like you've lost your internet connection.",
};

export default function OfflinePage() {
  return <OfflineContainer />;
}
