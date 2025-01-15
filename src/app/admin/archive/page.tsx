'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'
import { motion } from 'framer-motion'

type ArchivedApplication = {
  id: string
  timestamp: string
  username: string
  age: number
  steamId: string
  cfxAccount: string
  experience: string
  character: string
  discord: {
    id: string
    username: string
    avatar: string
    verified: boolean
    email: string
    createdAt: string
  }
  status: 'approved' | 'denied'
  statusReason?: string
  updatedAt: string
}

export default function ArchivedApplications() {
  const { data: session, status } = useSession()
  const [archivedApplications, setArchivedApplications] = useState<ArchivedApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.discord && !isAdmin(session.discord.id))) {
      router.push('/')
    } else if (status === 'authenticated' && isAdmin(session?.discord?.id)) {
      fetchArchivedApplications()
    }
  }, [status, session, router])

  async function fetchArchivedApplications() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/applications/archive')
      if (!response.ok) {
        throw new Error('Failed to fetch archived applications')
      }
      const data = await response.json()
      setArchivedApplications(data)
    } catch (error) {
      console.error('Error fetching archived applications:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch archived applications. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading...
      </div>
    )
  }

  if (!session?.discord?.id || !isAdmin(session.discord.id)) {
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
        <h1 className="text-2xl font-bold">Archived Applications</h1>
        <div>
          <Link href="/admin/applications">
            <Button variant="outline" className="mr-2">View Active Applications</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>

      {archivedApplications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No archived applications found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {archivedApplications.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{app.username}'s Application</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <section>
                        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                        <div className="space-y-2">
                          <p><strong>Age:</strong> {app.age}</p>
                          <p><strong>Discord:</strong> {app.discord.username}</p>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-lg font-semibold mb-2">Game Information</h3>
                        <div className="space-y-2">
                          <p><strong>Steam ID:</strong> {app.steamId}</p>
                          <p className="break-all"><strong>CFX Account:</strong> {app.cfxAccount}</p>
                        </div>
                      </section>
                    </div>

                    <section>
                      <h3 className="text-lg font-semibold mb-2">Experience</h3>
                      <div className="bg-muted/50 rounded-lg p-3 break-words whitespace-pre-wrap">
                        {app.experience}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold mb-2">Character Backstory</h3>
                      <div className="bg-muted/50 rounded-lg p-3 break-words whitespace-pre-wrap">
                        {app.character}
                      </div>
                    </section>

                    <section className="border-t pt-4">
                      <div className="space-y-2">
                        <p>
                          <strong>Status: </strong>
                          <span className={app.status === 'approved' ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                            {app.status.toUpperCase()}
                          </span>
                        </p>
                        {app.statusReason && (
                          <p><strong>Reason: </strong>{app.statusReason}</p>
                        )}
                        <p>
                          <strong>Updated At: </strong>
                          {new Date(app.updatedAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            timeZoneName: 'short'
                          })}
                        </p>
                      </div>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

