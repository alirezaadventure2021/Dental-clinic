import { Outlet } from 'react-router-dom'
import { SidebarProvider, useSidebar } from '../../context/SidebarContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

function LayoutContent() {
  const { isOpen } = useSidebar()

  return (
    <div className="min-h-screen bg-gray-50 font-[Vazirmatn]">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isOpen ? 'lg:mr-[280px]' : 'lg:mr-[72px]'
        }`}
      >
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default function Layout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  )
}
