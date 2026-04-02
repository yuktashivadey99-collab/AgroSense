import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('agrosense_user')
      if (saved) setUser(JSON.parse(saved))
    } catch {}
    setAuthLoading(false)
  }, [])

  const signIn = (userData) => {
    setUser(userData)
    localStorage.setItem('agrosense_user', JSON.stringify(userData))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('agrosense_user')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, authLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)