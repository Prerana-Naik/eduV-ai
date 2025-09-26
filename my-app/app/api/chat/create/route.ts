import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { title, mode } = await req.json()
  const user = await supabase.auth.getUser()

  if (!user.data.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data, error } = await supabase
    .from('conversations')
    .insert([{ user_id: user.data.user.id, title, mode }])
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data)
}
