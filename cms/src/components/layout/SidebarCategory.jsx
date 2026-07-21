import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSidebar } from '../../context/SidebarContext'

export default function SidebarCategory({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const { isOpen: sidebarOpen } = useSidebar()

  if (!sidebarOpen) {
    return (
      <div className="px-2 py-1">
        <div className="flex items-center justify-center px-2 py-2.5 text-gray-400 group relative">
          <Icon size={20} />
          <div className="absolute left-full ml-2 px-2.5 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {title}
          </div>
        </div>
        <div className="mt-1 space-y-0.5">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="px-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-400 hover:bg-sidebar-hover hover:text-white transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="mt-1 ml-2 space-y-0.5 border-l border-gray-700 pl-2">
          {children}
        </div>
      )}
    </div>
  )
}
