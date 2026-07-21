import { NavLink } from 'react-router-dom'
import { useSidebar } from '../../context/SidebarContext'

export default function SidebarItem({ icon: Icon, label, href }) {
  const { isOpen, closeMobile } = useSidebar()

  const handleClick = () => {
    closeMobile()
  }

  return (
    <NavLink
      to={href}
      onClick={handleClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
          isActive
            ? 'bg-gold text-navy font-medium'
            : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
        } ${!isOpen ? 'justify-center px-2' : ''}`
      }
    >
      <Icon size={20} className="shrink-0" />
      {isOpen && <span className="text-sm truncate">{label}</span>}

      {/* Tooltip for collapsed state */}
      {!isOpen && (
        <div className="absolute left-full ml-2 px-2.5 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </NavLink>
  )
}
