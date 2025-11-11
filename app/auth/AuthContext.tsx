'use client'

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { getAccessToken, removeFromStorage } from '@/src/services/auth/auth-token.service'
import { useProfile } from '@/src/shared/application/hooks/useProfile'
import { IUser } from '@/src/shared/domain/entities/user.interface'

interface IAuthContext {
    user: IUser | null
    setUser: (user: IUser | null) => void
    logout: () => void
    isLoading: boolean // Optionally, for initial user check (we'll implement this in the next step)
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<IUser | null>(null)
  
  const { user: profileUser, isLoading: isProfileLoading } = useProfile() 
  
  const [isLoading, setIsLoading] = useState(true)

  const logout = () => {
      setUser(null)
      removeFromStorage()
  }

  useEffect(() => {
      // Only run if the access token exists (meaning the user *might* be logged in)
      if (getAccessToken()) {
          if (isProfileLoading) {
              setIsLoading(true)
          } else if (profileUser) {
              setUser(profileUser)
              setIsLoading(false)
          } else {
              // * Token exists but profile failed (token invalid/expired)
              logout() 
              setIsLoading(false)
          }
      } else {
          // * No token, not loading profile
          setIsLoading(false) 
      }
  }, [profileUser, isProfileLoading])

  const value = useMemo(() => ({
      user,
      setUser,
      logout,
      isLoading,
  }), [user, isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}
