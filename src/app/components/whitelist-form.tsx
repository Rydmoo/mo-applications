'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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
  discordId: z.string().min(3, {
    message: 'Discord ID must be at least 3 characters.',
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
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      age: undefined,
      steamId: '',
      discordId: '',
      cfxAccount: '',
      experience: '',
      character: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const webhookUrl = ''
    
    const formattedData = `
**New Whitelist Application**
👤 **Username:** ${values.username}
🎂 **Age:** ${values.age}
🎮 **Steam ID:** ${values.steamId}
🔊 **Discord ID:** ${values.discordId}
🌐 **CFX Account:** ${values.cfxAccount}
🎭 **Roleplay Experience:**
${values.experience}
📖 **Character Backstory:**
${values.character}
    `.trim()

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: formattedData }),
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
              </FormControl>
              <FormDescription>
                You must be 18 or older to join the server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="discordId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discord ID</FormLabel>
              <FormControl>
                <Input placeholder="Your Discord username" {...field} />
              </FormControl>
              <FormDescription>
                Your Discord username (e.g., username).
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
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roleplay Experience</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your previous roleplay experience..." 
                  className="resize-none" 
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
                  className="resize-none" 
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  )
}

