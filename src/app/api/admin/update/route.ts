// Pfad: src/app/api/admin/update/route.ts

import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const authHeader = req.headers.get('authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) {
    return Response.json({ message: 'Missing token' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]

  // Inject token into client manually (since @supabase/ssr does not handle this natively yet)
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'super_admin') {
    return Response.json({ message: 'Permission denied' }, { status: 403 })
  }

  const { id, update } = await req.json()

  const { error: updateError } = await supabase
    .from('admin_users')
    .update(update)
    .eq('id', id)

  if (updateError) {
    return Response.json({ message: 'Update failed' }, { status: 500 })
  }

  return Response.json({ success: true })
}
