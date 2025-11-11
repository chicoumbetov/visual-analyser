import type { Metadata } from 'next'

import { Auth } from './Auth'

export const metadata: Metadata = {
  title: 'Authorization'
}

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full py-8">
      <Auth />
    </div>
  )
}