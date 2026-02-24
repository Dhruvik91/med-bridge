'use client'

import { WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6 py-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-muted p-6">
            <WifiOff className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
        
        <p className="text-muted-foreground mb-8">
          It looks like you've lost your internet connection. Some features may not be available until you're back online.
        </p>

        <div className="space-y-4">
          <Button onClick={handleRetry} className="w-full">
            Try Again
          </Button>
          
          <p className="text-sm text-muted-foreground">
            You can still browse previously visited pages while offline.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <h2 className="font-semibold mb-3">Available Offline:</h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Previously viewed job listings</li>
            <li>• Your saved jobs</li>
            <li>• Profile information</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
