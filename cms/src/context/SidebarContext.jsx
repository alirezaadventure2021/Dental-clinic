import { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar-open')
    return saved !== null ? JSON.parse(saved) : true
  })

  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('sidebar-open', JSON.stringify(isOpen))
  }, [isOpen])

  const toggle = () => setIsOpen(prev => !prev)
  const openMobile = () => setIsMobileOpen(true)
  const closeMobile = () => setIsMobileOpen(false)

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, isMobileOpen, openMobile, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
