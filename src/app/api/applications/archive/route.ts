import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

const archiveFilePath = path.join(process.cwd(), 'data', 'archived_applications.json')

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.discord) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = session.discord.id === '770344107104010261'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await fs.readFile(archiveFilePath, 'utf8')
    const archivedApplications = JSON.parse(data)

    return NextResponse.json(archivedApplications)
  } catch (error) {
    console.error('Error fetching archived applications:', error)
    return NextResponse.json({ error: 'Failed to fetch archived applications' }, { status: 500 })
  }
}

