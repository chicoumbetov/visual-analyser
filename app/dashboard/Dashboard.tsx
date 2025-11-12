'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { authService } from '@/src/services/auth/auth.service'
import { useAuthContext } from '../auth/AuthContext'

import { MapComponent } from './MapComponent'
import { PhotoDetailsModal } from './PhotoDetailsModal'
import { PhotoUploader } from './PhotoUploader'

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
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-zinc-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Uploader */}
        <div className="lg:col-span-1">
            <PhotoUploader />
        </div>
        
        {/* Right Column: Map */}
        <div className="lg:col-span-2 min-h-[400px] h-full">
            <MapComponent />
        </div>
        
      </div>

      <PhotoDetailsModal />
    </div>
  )
}
