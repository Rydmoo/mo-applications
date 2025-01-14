import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'applications.json')

export async function POST(req: Request) {
  try {
    const application = await req.json()
    
    // Read existing data
    let applications = []
    try {
      const data = await fs.readFile(dataFilePath, 'utf8')
      applications = JSON.parse(data)
    } catch (error) {
      // File doesn't exist or is empty, start with an empty array
    }

    // Add new application with a unique ID and timestamp
    const newApplication = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...application
    }
    applications.push(newApplication)

    // Write updated data back to file
    await fs.writeFile(dataFilePath, JSON.stringify(applications, null, 2))

    return NextResponse.json({ message: 'Application submitted successfully' })
  } catch (error) {
    console.error('Error saving application:', error)
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8')
    const applications = JSON.parse(data)
    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error reading applications:', error)
    return NextResponse.json({ error: 'Failed to read applications' }, { status: 500 })
  }
}

