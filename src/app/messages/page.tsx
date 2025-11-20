import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { MessagesClient } from '@/components/messages/messages-client'

export const metadata: Metadata = {
  title: 'Messages | MedBridge',
  description: 'Communicate directly with hospitals and healthcare professionals.',
  alternates: {
    canonical: '/messages'
  }
}

export default function MessagesPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 h-screen bg-background">
        <MessagesClient />
      </main>
    </>
  )
}
