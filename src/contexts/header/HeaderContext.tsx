'use client'
import React, { createContext, useState, useContext } from 'react'

interface HeaderContextType {
  isNavActive: boolean
  toggleNav: () => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNavActive, setIsNavActive] = useState(false)

  const toggleNav = () => {
    setIsNavActive(prev => !prev)
  }

  return (
    <HeaderContext.Provider value={{ isNavActive, toggleNav }}>
      {children}
    </HeaderContext.Provider>
  )
}

export const useHeader = () => {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}