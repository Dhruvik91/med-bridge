'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Stethoscope, Mail, Lock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function SignInPage() {
  const router = useRouter()
  const { signIn, signInWithGoogle, loading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await signIn(formData.email, formData.password)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message || 'Failed to sign in')
    }
  }

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('Magic link sign-in is not supported. Please use password sign-in instead.')
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google')
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-primary/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">MedBridge</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a magic link to {formData.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Click the link in your email to sign in. The link will expire in 1 hour.
            </p>
            <Button
              variant="outline"
              onClick={() => setMagicLinkSent(false)}
              className="w-full"
            >
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">MedBridge</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your healthcare professional account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password" className="space-y-4">
              <form onSubmit={handlePasswordSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="magic-link" className="space-y-4">
              <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="magic-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="magic-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We'll send you a secure link to sign in without a password.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending Link...' : 'Send Magic Link'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
