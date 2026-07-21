import { Bell, Menu } from 'lucide-react'
import { useSidebar } from '../../context/SidebarContext'
import Avatar from '../ui/Avatar'

export default function TopBar() {
  const { openMobile } = useSidebar()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 lg:px-6">
      {/* Right side (RTL) - Hamburger for mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={openMobile}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Left side (RTL) - User + Notifications */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Avatar */}
        <Avatar />
      </div>
    </header>
  )
}
