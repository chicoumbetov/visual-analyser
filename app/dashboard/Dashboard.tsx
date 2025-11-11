'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { authService } from '@/src/services/auth/auth.service'
import { useAuthContext } from '../auth/AuthContext'

export function Dashboard() {
  const router = useRouter()
  const { user, logout: logoutContext } = useAuthContext() 

  const handleLogout = async () => {
    try {
      // * Call API to clear server-side refresh cookie
      await authService.logout()
    } catch (error) {
      console.error('Logout API failed but performing client-side cleanup:', error)
    }

    logoutContext() 

    router.push('/auth') 
  }

  if (!user) return null

  return (
    <div className="p-8">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-zinc-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Visual Analyzer Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {user.name} ({user.email})
          </span>
          <Button variant='ghost' onClick={handleLogout} className="text-red-500 hover:text-red-600 dark:hover:bg-zinc-800">
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Placeholder for the main Map and Upload Content */}
      <div className="mt-8 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
          <p className="text-gray-600 dark:text-gray-400">
              Content for the Map and Photo Uploader goes here.
          </p>
      </div>
    </div>
  )
}
