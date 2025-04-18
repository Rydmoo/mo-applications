'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import ProfileCard from '@/app/components/profile-card'
import { motion, AnimatePresence } from 'framer-motion'
import { isAdmin } from '@/lib/auth'

type DiscordUser = {
  id: string
  username: string
  avatar: string
  verified: boolean
  email: string
  createdAt: string
}

type Application = {
  id: string
  timestamp: string
  username: string
  age: number
  steamId: string
  cfxAccount: string
  experience: string
  character: string
  discord: DiscordUser
  status?: 'pending' | 'approved' | 'denied'
}

export default function AdminApplications() {
  const { data: session, status } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [reason, setReason] = useState('')
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.discord && !isAdmin(session.discord.id))) {
      router.push('/')
    } else if (status === 'authenticated' && isAdmin(session?.discord?.id)) {
      fetchApplications()
    }
  }, [status, session, router])

  async function fetchApplications() {
    try {
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      } else {
        throw new Error('Failed to fetch applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch applications. Please try again.',
        variant: 'destructive',
      })
    }
  }

  async function handleStatusUpdate(applicationId: string, newStatus: 'approved' | 'denied') {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, reason }),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update application status')
      }

      const data = await response.json()
      toast({
        title: 'Status Updated',
        description: data.message || `Application ${newStatus} successfully and archived.`,
      })
      fetchApplications() // Refresh the list
      setReason('') // Clear the reason input

      // Trigger confetti or X's
      if (newStatus === 'approved') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      } else {
        // Create X's effect
        const xCount = 20
        const xSize = 30
        for (let i = 0; i < xCount; i++) {
          const x = document.createElement('div')
          x.textContent = '❌'
          x.style.position = 'fixed'
          x.style.left = `${Math.random() * 100}vw`
          x.style.top = `${Math.random() * 100}vh`
          x.style.fontSize = `${xSize}px`
          x.style.opacity = '0'
          x.style.transition = 'opacity 1s, transform 1s'
          document.body.appendChild(x)
          setTimeout(() => {
            x.style.opacity = '1'
            x.style.transform = 'translateY(-50px) rotate(360deg)'
          }, 50)
          setTimeout(() => {
            x.style.opacity = '0'
            setTimeout(() => x.remove(), 1000)
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error)
      toast({
        title: 'Update Error',
        description: error instanceof Error ? error.message : 'There was an error updating the application status.',
        variant: 'destructive',
      })
    }
  }

  if (status === 'loading' || !session?.discord || !isAdmin(session.discord.id)) {
    return null
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Whitelist Applications</h1>
        <div>
          <Link href="/admin/archive">
            <Button variant="outline" className="mr-2">View Archive</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
      <AnimatePresence>
        {applications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden mb-4">
              <CardHeader>
                <CardTitle>{app.username}'s Application</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <ProfileCard profile={app.discord} />
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Application Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <p><strong>Age:</strong> {app.age}</p>
                        <p><strong>Steam ID:</strong> {app.steamId}</p>
                        <p className="col-span-2"><strong>CFX Account:</strong> {app.cfxAccount}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Experience</h3>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="whitespace-pre-wrap break-words">{app.experience}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Character Backstory</h3>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="whitespace-pre-wrap break-words">{app.character}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Input
                        placeholder="Reason (optional)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleStatusUpdate(app.id, 'approved')} 
                          className="bg-green-500 hover:bg-green-600 flex-1"
                        >
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleStatusUpdate(app.id, 'denied')} 
                          className="bg-red-500 hover:bg-red-600 flex-1"
                        >
                          Deny
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

