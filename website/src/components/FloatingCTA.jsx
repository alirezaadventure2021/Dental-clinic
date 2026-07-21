import { useState, useEffect } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("home");
      const contact = document.getElementById("contact");
      const heroBottom = hero ? hero.offsetHeight * 0.6 : 400;
      const contactTop = contact
        ? contact.getBoundingClientRect().top
        : Infinity;

      // Show after hero, hide when contact is near
      setVisible(window.scrollY > heroBottom && contactTop > 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#contact"
      className={`cta-float fixed bottom-6 left-6 z-40 md:hidden flex items-center gap-2 px-5 py-3.5 bg-gold text-black-custom rounded-full font-semibold text-sm shadow-xl shadow-gold/30 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="رزرو نوبت"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      رزرو نوبت
    </a>
  );
}
