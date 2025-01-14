'use client'

import { useSession } from "next-auth/react"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { isAdmin } from '@/lib/auth'

export default function AdminButton() {
  const { data: session } = useSession()

  if (!session?.discord || !isAdmin(session.discord.id)) {
    return null
  }

  return (
    <div className="flex justify-end mb-4">
      <Link href="/admin/applications" passHref>
        <Button asChild>
          <span>Admin Panel</span>
        </Button>
      </Link>
    </div>
  )
}

