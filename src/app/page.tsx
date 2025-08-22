import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect root to login - middleware will handle auth flow
  redirect('/login')
}