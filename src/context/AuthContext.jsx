/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../config'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('inviteque_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setTimeout(() => {
      setToast({ message, type })
      setTimeout(() => {
        setToast(null)
      }, 2000)
    }, 0)
  }

  useEffect(() => {
    // Check if we need to show flags
    if (localStorage.getItem('show_login_toast') === 'true') {
      showToast('Successfully logged in!')
      localStorage.removeItem('show_login_toast')
    } else if (localStorage.getItem('show_signup_toast') === 'true') {
      showToast('Account created successfully!')
      localStorage.removeItem('show_signup_toast')
    } else if (localStorage.getItem('show_logout_toast') === 'true') {
      showToast('Logged out successfully!')
      localStorage.removeItem('show_logout_toast')
    }
  }, [])

  const loginWithData = (userData) => {
    const userWithToken = {
      ...userData,
      purchasedInvitations: [],
    }
    setUser(userWithToken)
    localStorage.setItem('inviteque_user', JSON.stringify(userWithToken))
    localStorage.setItem('show_login_toast', 'true')
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }

      const data = await response.json()
      const userWithToken = {
        ...data,
        purchasedInvitations: [], // You can fetch this later from DB
      }
      setUser(userWithToken)
      localStorage.setItem('inviteque_user', JSON.stringify(userWithToken))
      localStorage.setItem('show_login_toast', 'true')
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const signup = async (name, email, password, phoneNumber) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phoneNumber }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Signup failed')
      }

      const data = await response.json()
      setUser(data)
      localStorage.setItem('inviteque_user', JSON.stringify(data))
      localStorage.setItem('show_signup_toast', 'true')
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const addPurchasedInvitation = (invitationData) => {
    if (!user) return

    const newInvitation = {
      id: Date.now().toString(),
      ...invitationData,
      purchaseDate: new Date().toISOString(),
    }

    const updatedUser = {
      ...user,
      purchasedInvitations: [...(user.purchasedInvitations || []), newInvitation],
    }

    setUser(updatedUser)
    localStorage.setItem('inviteque_user', JSON.stringify(updatedUser))
  }

  const updatePurchasedInvitation = (invitationId, updates) => {
    if (!user) return

    const updatedInvitations = user.purchasedInvitations.map((inv) =>
      inv.id === invitationId ? { ...inv, ...updates } : inv
    )

    const updatedUser = {
      ...user,
      purchasedInvitations: updatedInvitations,
    }

    setUser(updatedUser)
    localStorage.setItem('inviteque_user', JSON.stringify(updatedUser))
  }

  const saveInvitation = async (invitationRequest) => {
    try {
      const response = await fetch(`${API_URL}/api/invites`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(invitationRequest),
      })

      if (response.status === 401) {
        logout()
        throw new Error('Your session has expired. Please login again.')
      }

      if (!response.ok) {
        throw new Error('Failed to save invitation')
      }

      return await response.json()
    } catch (error) {
      console.error('Save error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('inviteque_user')
    localStorage.setItem('show_logout_toast', 'true')
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithData,
        signup,
        logout,
        addPurchasedInvitation,
        updatePurchasedInvitation,
        saveInvitation,
        loading,
      }}
    >
      {!loading && children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -15, scale: 0.95, x: '-50%' }}
            transition={{ duration: 0.25, ease: [0.21, 1.02, 0.43, 1.01] }}
            className="fixed top-6 left-1/2 z-[9999] pointer-events-none"
          >
            <div className="px-6 py-3.5 rounded-full bg-emerald-950/90 text-emerald-100 shadow-[0_20px_50px_rgba(16,185,129,0.15)] text-xs md:text-sm font-semibold flex items-center gap-3 border border-emerald-500/30 tracking-wide backdrop-blur-md">
              <span className="text-emerald-400 animate-pulse">✓</span>
              <span className="font-saas tracking-tight">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
