import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { sendDirectMessage } from '@/lib/discord-bot'
import { isAdmin } from '@/lib/auth'

const dataFilePath = path.join(process.cwd(), 'data', 'applications.json')
const archiveFilePath = path.join(process.cwd(), 'data', 'archived_applications.json')

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.discord) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdmin(session.discord.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params
    const { status, reason } = await req.json()

    // Read existing data
    const data = await fs.readFile(dataFilePath, 'utf8')
    let applications = JSON.parse(data)

    // Find and update the application
    const applicationIndex = applications.findIndex((app: any) => app.id === id)
    if (applicationIndex === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const updatedApplication = {
      ...applications[applicationIndex],
      status,
      statusReason: reason,
      updatedAt: new Date().toISOString()
    }

    // Remove the application from the active list
    applications.splice(applicationIndex, 1)

    // Write updated active applications back to file
    await fs.writeFile(dataFilePath, JSON.stringify(applications, null, 2))

    // Archive the application
    let archivedApplications = []
    try {
      const archivedData = await fs.readFile(archiveFilePath, 'utf8')
      archivedApplications = JSON.parse(archivedData)
    } catch (error) {
      console.log('No existing archive file, creating a new one')
    }
    archivedApplications.push(updatedApplication)
    await fs.writeFile(archiveFilePath, JSON.stringify(archivedApplications, null, 2))

    // Send Discord DM to the applicant
    try {
      await sendDirectMessage(updatedApplication.discord.id, status as 'approved' | 'denied', reason)
      console.log(`Discord message sent to user ${updatedApplication.discord.id}`)
    } catch (error) {
      console.error('Failed to send Discord message:', error)
      // Don't throw an error here, just log it
    }

    return NextResponse.json({ message: 'Application status updated and archived successfully' })
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}

