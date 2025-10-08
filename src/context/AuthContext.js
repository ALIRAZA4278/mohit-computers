'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, supabase } from '@/lib/supabase-db'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const getUser = async () => {
    try {
      const { user, error } = await authAPI.getCurrentUser()
      if (user && !error) {
        setUser(user)
        await getUserProfile(user.id)
      }
    } catch (error) {
      console.error('Error getting user:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await authAPI.getProfile(userId)
      if (data && !error) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error getting user profile:', error)
    }
  }

  useEffect(() => {
    // Get initial user
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await getUserProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    ) || { data: { subscription: null } }

    return () => {
      subscription?.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      const { data, error } = await authAPI.signUp(email, password, userData)
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await authAPI.signIn(email, password)
      
      if (error) throw error
      
      if (data.user) {
        setUser(data.user)
        await getUserProfile(data.user.id)
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await authAPI.signOut()
      
      if (error) throw error
      
      setUser(null)
      setProfile(null)
      
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      const { data, error } = await authAPI.updateProfile(user.id, profileData)
      
      if (error) throw error
      
      if (data) {
        setProfile(data)
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}