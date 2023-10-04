import { signIn } from '@/lib/supabase/auth'
import { use, useEffect } from 'react'

export default function Login() {
  useEffect(() => {
    signIn()
  }, [])
  return <div></div>
}
