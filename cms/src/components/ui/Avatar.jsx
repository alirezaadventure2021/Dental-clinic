import { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Avatar() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-sm hover:ring-2 hover:ring-gold-hover transition-all"
      >
        {user?.name ? user.name.charAt(0) : <User size={20} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800">{user?.name || 'کاربر'}</p>
            <p className="text-xs text-gray-500">{user?.email || ''}</p>
          </div>

          <button
            onClick={() => {
              setIsOpen(false)
              navigate('/profile')
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <User size={16} />
            <span>پروفایل</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false)
              navigate('/settings')
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings size={16} />
            <span>تنظیمات حساب</span>
          </button>

          <div className="border-t border-gray-100 my-1"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>خروج</span>
          </button>
        </div>
      )}
    </div>
  )
}
