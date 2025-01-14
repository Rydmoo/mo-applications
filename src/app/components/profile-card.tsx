'use client'

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export interface ProfileCardProps {
  profile?: {
    id: string
    username: string
    avatar: string
    banner: string
    accentColor: number | null
    verified: boolean
    email: string
    createdAt: string
  }
  className?: string
}

export default function ProfileCard({ profile, className }: ProfileCardProps) {
  const { data: session } = useSession()
  const userData = profile || session?.discord

  if (!userData) {
    return null
  }

  const { id, username, avatar, banner, accentColor, verified, email, createdAt } = userData
  const avatarUrl = avatar 
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` 
    : `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`
  const bannerUrl = banner 
    ? `https://cdn.discordapp.com/banners/${id}/${banner}.png?size=480` 
    : null

  return (
    <Card className={`w-full overflow-hidden ${className}`}>
      <CardHeader className="p-0">
        <div 
          className="h-24 bg-cover bg-center" 
          style={{ 
            backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none',
            backgroundColor: accentColor ? `#${accentColor.toString(16).padStart(6, '0')}` : 'hsl(var(--primary))'
          }}
        />
      </CardHeader>
      <CardContent className="pt-0 relative">
        <div className="absolute -top-10 left-4">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="pt-12 pb-4">
          <h2 className="text-2xl font-bold">{username}</h2>
          <p className="text-sm text-muted-foreground">User ID: {id}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p><strong>Email:</strong> {email || 'Not provided'}</p>
          <p><strong>Verified:</strong> {verified ? 'Yes' : 'No'}</p>
          <p><strong>Joined Discord:</strong> {new Date(createdAt).toLocaleDateString()}</p>
          <div>
            <strong>Badges:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {verified && <Badge variant="secondary">Verified</Badge>}
              <Badge variant="secondary">Discord User</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

