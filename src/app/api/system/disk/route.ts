// Pfad: src/app/api/system/disk/route.ts

import { NextRequest } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(req: NextRequest) {
  try {
    // Nur Root-Dateisystem anzeigen (erste Zeile unter `df -h /`)
    const { stdout } = await execAsync("df -h / | tail -1 | awk '{print $5}'")

    // Ausgabe ist z. B. '82%' – wir entfernen das Prozentzeichen
    const percentUsed = parseInt(stdout.trim().replace('%', ''))

    return Response.json({ usedPercent: percentUsed })
  } catch (error) {
    return Response.json(
      { message: 'Failed to check disk usage', error },
      { status: 500 }
    )
  }
}
