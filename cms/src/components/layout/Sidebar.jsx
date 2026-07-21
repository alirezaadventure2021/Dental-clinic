import { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Image,
  UserCog,
  Stethoscope,
  MessageSquare,
  Mail,
  HelpCircle,
  Phone,
  Users,
  Calendar,
  ClipboardList,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import SidebarItem from "./SidebarItem";
import SidebarCategory from "./SidebarCategory";

export default function Sidebar() {
  const { isOpen, toggle, isMobileOpen, closeMobile } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogoClick = () => {
    if (isMobile) {
      closeMobile();
    } else {
      toggle();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar-bg text-white">
      {/* Logo - Clickable to toggle sidebar (desktop) or close (mobile) */}
      <button
        onClick={handleLogoClick}
        className={`flex items-center h-16 border-b border-gray-800 hover:bg-sidebar-hover transition-colors w-full ${isOpen || isMobileOpen ? "px-4 gap-3" : "justify-center px-2"}`}
      >
        <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center shrink-0">
          <span className="text-navy font-bold text-lg">د</span>
        </div>
        {(isOpen || isMobileOpen) && (
          <span className="text-sm font-bold text-white truncate">
            کلینیک دندانپزشکی
          </span>
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {/* Dashboard */}
        <div className="px-2">
          <SidebarItem icon={LayoutDashboard} label="داشبورد" href="/" />
        </div>

        {/* Website Content Editor */}
        <SidebarCategory
          title="ویرایشگر محتوای وبسایت"
          icon={Image}
          defaultOpen={isOpen || isMobileOpen}
        >
          <SidebarItem icon={Image} label="گالری تصاویر" href="/gallery" />
          {/* <SidebarItem icon={UserCog} label="اطلاعات پزشکان" href="/doctors" /> */}
          <SidebarItem icon={Stethoscope} label="خدمات" href="/services" />
          <SidebarItem
            icon={ClipboardList}
            label="درمان‌ها"
            href="/treatments"
          />
          {/* <SidebarItem
            icon={MessageSquare}
            label="نظرات بیماران"
            href="/comments"
          /> */}
          <SidebarItem icon={Mail} label="پیام‌ها" href="/messages" />
          <SidebarItem icon={HelpCircle} label="سوالات متداول" href="/faq" />
          {/* <SidebarItem
            icon={Phone}
            label="اطلاعات تماس کلینیک"
            href="/contact"
          /> */}
        </SidebarCategory>

        {/* Clinic Management */}
        {/* <SidebarCategory
          title="مدیریت کلینیک"
          icon={Users}
          defaultOpen={isOpen || isMobileOpen}
        >
          <SidebarItem icon={Users} label="لیست بیماران" href="/patients" />
          <SidebarItem icon={Calendar} label="نوبت‌دهی" href="/scheduling" />
        </SidebarCategory> */}
      </nav>

      {/* Collapse Toggle - Desktop only */}
      <div className="hidden lg:flex border-t border-gray-800 p-2">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-sidebar-hover hover:text-white transition-colors"
        >
          {isOpen ? (
            <>
              <ChevronRight size={18} />
              <span className="text-sm">بستن منو</span>
            </>
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 right-0 h-screen bg-sidebar-bg sidebar-transition z-50 ${
          isOpen ? "w-[280px]" : "w-[72px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeMobile} />

          {/* Sidebar */}
          <aside className="absolute top-0 right-0 h-full w-[280px] bg-sidebar-bg animate-slide-in">
            {/* Close button */}
            <button
              onClick={closeMobile}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-sidebar-hover text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
