'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import AuthButton from './auth-button'
import ProfileCard from './profile-card'
import { motion, AnimatePresence } from 'framer-motion'

const formSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  age: z.number().min(18, {
    message: 'You must be at least 18 years old.',
  }),
  steamId: z.string().regex(/^[0-9]{17}$/, {
    message: 'Invalid Steam ID. It should be a 17-digit number.',
  }),
  cfxAccount: z.string().url({
    message: 'Please enter a valid CFX account URL.',
  }),
  experience: z.string().min(50, {
    message: 'Please provide at least 50 characters about your RP experience.',
  }),
  character: z.string().min(100, {
    message: 'Please provide at least 100 characters about your character backstory.',
  }),
})

export default function WhitelistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      age: 18,
      steamId: '',
      cfxAccount: '',
      experience: '',
      character: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.discord) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in with Discord before submitting.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    
    const applicationData = {
      ...values,
      discord: session.discord,
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })

      if (response.ok) {
        toast({
          title: 'Application Submitted',
          description: 'Your whitelist application has been received. We will review it shortly.',
        })
        form.reset()
      } else {
        throw new Error('Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      toast({
        title: 'Submission Error',
        description: 'There was an error submitting your application. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <div className={`mb-8 ${session ? 'flex justify-end' : 'flex justify-center'}`}>
        <AuthButton />
      </div>
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {session?.discord ? (
            <>
              <div className="lg:col-span-1">
                <ProfileCard profile={session.discord} className="sticky top-4" />
              </div>
              <div className="lg:col-span-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 rounded-lg shadow-lg">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <h2 className="text-2xl font-bold mb-6">Whitelist Application</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Your in-game username" {...field} />
                              </FormControl>
                              <FormDescription>
                                This is the username you will use in the server.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
                                />
                              </FormControl>
                              <FormDescription>
                                You must be 18 or older to join the server.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <h3 className="text-xl font-semibold mb-4">Game Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="steamId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Steam ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Your 17-digit Steam ID" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your Steam ID is a 17-digit number. You can find it on your Steam profile.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cfxAccount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CFX Account</FormLabel>
                              <FormControl>
                                <Input placeholder="https://forum.cfx.re/u/yourusername" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your CFX forum account URL.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <h3 className="text-xl font-semibold mb-4">Roleplay Information</h3>
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Roleplay Experience</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about your previous roleplay experience..." 
                                  className="min-h-[100px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Briefly describe your previous roleplay experience, if any.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="character"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Character Backstory</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Provide a brief backstory for your character..." 
                                  className="min-h-[150px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Give us a brief backstory for the character you plan to roleplay as.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </form>
                </Form>
              </div>
            </>
          ) : (
            <div
              className="text-center text-muted-foreground col-span-2 lg:col-span-2"
            >
              Please sign in with Discord to access the whitelist application form.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

