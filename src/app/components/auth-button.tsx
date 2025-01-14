'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex justify-center">
        <Button disabled>
          <User className="mr-2 h-4 w-4" />
          Loading...
        </Button>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => signOut()}>
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
            <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          Signed in as {session.user?.name}
          <LogOut className="ml-2 h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <Button onClick={() => signIn('discord')}>
        <User className="mr-2 h-4 w-4" />
        Sign in with Discord
      </Button>
    </div>
  )
}

