import type { IncomingMessage, ServerResponse } from 'node:http'

export interface StickyNoteRecord {
  id: string
  name: string
  message: string
  color: 'yellow' | 'pink' | 'blue' | 'mint' | 'lavender'
  createdAt: string
  moderationStatus: 'approved' | 'pending' | 'rejected'
  pinned?: boolean
}

// In-memory store for serverless environment initialized with verified seed notes
const IN_MEMORY_NOTES: StickyNoteRecord[] = [
  {
    id: 'note-1793986254025-e07f27',
    name: 'Anonymous',
    message: 'I never seen this kind of portfolio before ,  what a creativity',
    color: 'yellow',
    createdAt: '2026-11-06T17:30:54.025Z',
    moderationStatus: 'approved',
  },
  {
    id: 'note-1793985109526-1265ac',
    name: 'Tester',
    message: 'Hello Ravi! Testing the public sticky note wall.',
    color: 'mint',
    createdAt: '2026-11-06T17:11:49.529Z',
    moderationStatus: 'approved',
  },
  {
    id: 'note-seed-1',
    name: 'Aarav (SIH Team)',
    message: 'Loved building UrbanPlus.AI with you! Winning 1st place at FutureHacks was unforgettable. Keep coding, Ravi!',
    color: 'yellow',
    createdAt: '2026-11-04T14:20:00.000Z',
    moderationStatus: 'approved',
    pinned: true,
  },
  {
    id: 'note-seed-2',
    name: 'Priya Sharma',
    message: 'The interactive particle hologram on this portfolio is unbelievable! Truly feels like a futuristic OS. 🌟',
    color: 'pink',
    createdAt: '2026-11-05T09:15:00.000Z',
    moderationStatus: 'approved',
  },
  {
    id: 'note-seed-3',
    name: 'Karan M. (RR Weddings)',
    message: 'Thanks for delivering our wedding filmers platform with such speed and polish. The couple stories look stunning!',
    color: 'mint',
    createdAt: '2026-11-05T18:40:00.000Z',
    moderationStatus: 'approved',
  },
  {
    id: 'note-seed-4',
    name: 'Dev Collaborator',
    message: 'Saw your Drishti AI and RAG projects on GitHub — very clean architecture and solid documentation. Cheers!',
    color: 'blue',
    createdAt: '2026-11-06T11:30:00.000Z',
    moderationStatus: 'approved',
  },
  {
    id: 'note-seed-5',
    name: 'Anonymous',
    message: 'Found your portfolio from LinkedIn. The macOS desktop vibe + Three.js wallpapers is pure art. Inspiring work!',
    color: 'lavender',
    createdAt: '2026-11-06T16:05:00.000Z',
    moderationStatus: 'approved',
  },
]

function sanitize(text: string): string {
  return text.replace(/[<>]/g, '').trim()
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method === 'GET') {
    const approved = IN_MEMORY_NOTES.filter((n) => n.moderationStatus === 'approved')
    approved.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ success: true, count: approved.length, data: approved }))
    return
  }

  if (req.method === 'POST') {
    try {
      let body: any = req.body
      if (typeof body === 'string') {
        body = JSON.parse(body)
      } else if (!body) {
        const buffers = []
        for await (const chunk of req) {
          buffers.push(chunk)
        }
        body = JSON.parse(Buffer.concat(buffers).toString('utf-8'))
      }

      const { name, message, color } = body
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: false, error: 'Message is required.' }))
        return
      }

      const cleanMessage = sanitize(message)
      const cleanName = name ? sanitize(name) : 'Anonymous'
      const validColor = ['yellow', 'pink', 'blue', 'mint', 'lavender'].includes(color)
        ? color
        : 'yellow'

      const newRecord: StickyNoteRecord = {
        id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        name: cleanName || 'Anonymous',
        message: cleanMessage,
        color: validColor,
        createdAt: new Date().toISOString(),
        moderationStatus: 'approved',
      }

      IN_MEMORY_NOTES.unshift(newRecord)

      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          success: true,
          message: 'Note published to community wall!',
          note: newRecord,
        })
      )
    } catch {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ success: false, error: 'Invalid request body.' }))
    }
    return
  }

  res.statusCode = 405
  res.end('Method Not Allowed')
}
