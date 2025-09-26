import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await supabase.auth.getUser()
  if (!user.data.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.data.user.id)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data)
}
