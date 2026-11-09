import type { Plugin, ViteDevServer, PreviewServer } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
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

const DATA_DIR = path.resolve(process.cwd(), 'data')
const DB_FILE = path.resolve(DATA_DIR, 'notes.json')
const ADMIN_KEY = process.env.VITE_ADMIN_KEY || 'ravi_admin_2026'

// Rate limiter: Map<IP, timestamps[]>
const rateLimitMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 6

  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < windowMs)
  if (timestamps.length >= maxRequests) {
    return true
  }
  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)
  return false
}

function readNotes(): StickyNoteRecord[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true })
      }
      fs.writeFileSync(DB_FILE, '[]', 'utf-8')
      return []
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('[NotesAPI] Error reading database:', err)
    return []
  }
}

function writeNotes(notes: StickyNoteRecord[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    const tempFile = `${DB_FILE}.${Date.now()}.tmp`
    fs.writeFileSync(tempFile, JSON.stringify(notes, null, 2), 'utf-8')
    fs.renameSync(tempFile, DB_FILE)
    return true
  } catch (err) {
    console.error('[NotesAPI] Error saving database:', err)
    return false
  }
}

function sanitizeText(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function checkSpam(message: string): boolean {
  const spamKeywords = [
    'http://',
    'https://',
    't.me/',
    'telegram',
    'whatsapp',
    'crypto',
    'viagra',
    'casino',
    'loan',
    'seo service',
    'invest now',
  ]
  const lower = message.toLowerCase()
  return spamKeywords.some((k) => lower.includes(k))
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk: any) => {
      body += chunk
      if (body.length > 10000) {
        reject(new Error('Payload too large'))
      }
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key')
  res.end(JSON.stringify(data))
}

export function notesApiMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url || '/', 'http://localhost')

  if (!url.pathname.startsWith('/api/notes')) {
    return next()
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key')
    return res.end()
  }

  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket.remoteAddress ||
    '127.0.0.1'

  // GET /api/notes
  if (req.method === 'GET') {
    const adminKey = req.headers['x-admin-key'] || url.searchParams.get('admin')
    const isAdmin = adminKey === ADMIN_KEY
    const allNotes = readNotes()

    const publicNotes = isAdmin
      ? allNotes
      : allNotes.filter((n) => n.moderationStatus === 'approved')

    publicNotes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return sendJson(res, 200, {
      success: true,
      count: publicNotes.length,
      data: publicNotes,
    })
  }

  // POST /api/notes
  if (req.method === 'POST') {
    if (isRateLimited(clientIp)) {
      return sendJson(res, 429, {
        success: false,
        error: 'Too many requests. Please wait a moment before sending another note.',
      })
    }

    parseJsonBody(req)
      .then((body) => {
        const rawMessage = typeof body.message === 'string' ? body.message.trim() : ''
        const rawName = typeof body.name === 'string' ? body.name.trim() : ''
        const color = ['yellow', 'pink', 'blue', 'mint', 'lavender'].includes(body.color)
          ? body.color
          : 'yellow'

        if (!rawMessage || rawMessage.length < 2) {
          return sendJson(res, 400, {
            success: false,
            error: 'Message is required and must contain at least 2 characters.',
          })
        }

        if (rawMessage.length > 180) {
          return sendJson(res, 400, {
            success: false,
            error: 'Message cannot exceed 180 characters.',
          })
        }

        const name = rawName ? sanitizeText(rawName.slice(0, 40)) : 'Anonymous'
        const message = sanitizeText(rawMessage)
        const hasSpam = checkSpam(rawMessage)
        const moderationStatus = hasSpam ? 'pending' : 'approved'

        const newNote: StickyNoteRecord = {
          id: `note-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
          name,
          message,
          color,
          createdAt: new Date().toISOString(),
          moderationStatus,
        }

        const notes = readNotes()
        notes.unshift(newNote)
        const saved = writeNotes(notes)

        if (!saved) {
          return sendJson(res, 500, {
            success: false,
            error: 'Failed to write note to database.',
          })
        }

        return sendJson(res, 201, {
          success: true,
          message:
            moderationStatus === 'approved'
              ? 'Your note has been posted to the public wall!'
              : 'Your note was received and submitted for moderation review.',
          data: newNote,
        })
      })
      .catch((err) => {
        return sendJson(res, 400, {
          success: false,
          error: err.message || 'Invalid JSON body',
        })
      })
    return
  }

  // PATCH /api/notes/:id (Admin moderation)
  if (req.method === 'PATCH') {
    const adminKey = req.headers['x-admin-key'] || url.searchParams.get('admin')
    if (adminKey !== ADMIN_KEY) {
      return sendJson(res, 403, { success: false, error: 'Unauthorized: invalid admin key' })
    }

    const noteId = url.pathname.split('/').filter(Boolean)[2]
    if (!noteId) {
      return sendJson(res, 400, { success: false, error: 'Missing note id' })
    }

    parseJsonBody(req)
      .then((body) => {
        const notes = readNotes()
        const target = notes.find((n) => n.id === noteId)
        if (!target) {
          return sendJson(res, 404, { success: false, error: 'Note not found' })
        }

        if (body.moderationStatus && ['approved', 'pending', 'rejected'].includes(body.moderationStatus)) {
          target.moderationStatus = body.moderationStatus
        }
        if (typeof body.pinned === 'boolean') {
          target.pinned = body.pinned
        }

        writeNotes(notes)
        return sendJson(res, 200, { success: true, data: target })
      })
      .catch((err) => {
        return sendJson(res, 400, { success: false, error: err.message })
      })
    return
  }

  // DELETE /api/notes/:id (Admin removal)
  if (req.method === 'DELETE') {
    const adminKey = req.headers['x-admin-key'] || url.searchParams.get('admin')
    if (adminKey !== ADMIN_KEY) {
      return sendJson(res, 403, { success: false, error: 'Unauthorized: invalid admin key' })
    }

    const noteId = url.pathname.split('/').filter(Boolean)[2]
    if (!noteId) {
      return sendJson(res, 400, { success: false, error: 'Missing note id' })
    }

    const notes = readNotes()
    const filtered = notes.filter((n) => n.id !== noteId)
    if (filtered.length === notes.length) {
      return sendJson(res, 404, { success: false, error: 'Note not found' })
    }

    writeNotes(filtered)
    return sendJson(res, 200, { success: true, message: 'Note deleted' })
  }

  return sendJson(res, 405, { success: false, error: 'Method not allowed' })
}

export function notesApiPlugin(): Plugin {
  return {
    name: 'notes-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        notesApiMiddleware(req, res, next)
      })
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use((req, res, next) => {
        notesApiMiddleware(req, res, next)
      })
    },
  }
}

