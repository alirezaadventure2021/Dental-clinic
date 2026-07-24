import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { label: "خانه", href: "#home" },
  { label: "درباره ما", href: "#about" },
  { label: "خدمات", href: "#services" },
  { label: "گالری", href: "#gallery" },
  // { label: "نظرات", href: "#testimonials" },
  { label: "تماس با ما", href: "#contact" },
  { label: "سوالات متداول", href: "#faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { dark, toggleDark } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((l) => l.href.slice(1));
      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 120) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? dark
              ? "bg-black-custom/90 backdrop-blur-xl shadow-lg shadow-black/40 border-b border-gold/10"
              : "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-3 group">
            <img
              src="/logo-landscape.png"
              alt="لوگو کلینیک دندانپزشکی"
              className="h-[50px] w-[200px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </a>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = activeSection === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`nav-link px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-gold active"
                      : dark
                        ? "text-gray-light hover:text-gold"
                        : scrolled
                          ? "text-gray-mid hover:text-gold"
                          : "text-white/85 hover:text-gold"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleDark}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                dark
                  ? "bg-gold/10 text-gold hover:bg-gold/20"
                  : scrolled
                    ? "bg-black/5 text-black-custom hover:bg-gold/10 hover:text-gold"
                    : "bg-white/10 text-white hover:bg-gold/20 hover:text-gold"
              }`}
              aria-label="تغییر حالت شب"
            >
              {dark ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <a
              href="#contact"
              className="btn-primary hidden md:inline-flex px-6 py-2.5 bg-gold text-black-custom rounded-full font-semibold text-sm hover:bg-gold-light shadow-lg shadow-gold/20"
            >
              رزرو نوبت
            </a>

            <button
              onClick={() => setIsOpen(true)}
              className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                dark
                  ? "bg-gold/10 text-gold"
                  : scrolled
                    ? "bg-black/5 text-black-custom"
                    : "bg-white/10 text-white"
              }`}
              aria-label="باز کردن منو"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.25s_ease]" />
          <div
            className="absolute top-0 right-0 h-full w-80 max-w-[85vw] flex flex-col animate-[slideInLeft_0.35s_cubic-bezier(0.22,1,0.36,1)] shadow-2xl"
            style={{
              background: dark
                ? "linear-gradient(180deg, #0A0A0A 0%, #141414 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,245,242,0.98) 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gold/10">
              <a
                href="#home"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <img
                  src="/logo.png"
                  alt="لوگو کلینیک دندانپزشکی"
                  className="h-[50px] w-[50px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <span
                  className={`text-lg font-bold font-display ${dark ? "text-white-custom" : "text-black-custom"}`}
                >
                  کلینیک<span className="text-gold">دندان</span>
                </span>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  dark ? "bg-gold/10 text-gold" : "bg-black/5 text-black-custom"
                }`}
                aria-label="بستن منو"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col p-6 gap-1 flex-1 overflow-y-auto">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300 ${
                    activeSection === link.href.slice(1)
                      ? "text-gold bg-gold/10"
                      : dark
                        ? "text-gray-light hover:text-gold hover:bg-gold/10"
                        : "text-gray-mid hover:text-gold hover:bg-gold/10"
                  }`}
                  style={{ animation: `fadeInUp 0.4s ease ${i * 0.05}s both` }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="p-6 border-t border-gold/10">
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary block text-center px-6 py-3.5 bg-gold text-black-custom rounded-xl font-semibold hover:bg-gold-light shadow-lg shadow-gold/20"
              >
                رزرو نوبت
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
