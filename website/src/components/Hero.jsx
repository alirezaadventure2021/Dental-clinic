import { useTheme } from "../context/ThemeContext";

const socials = [
  {
    label: "Facebook",
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "Twitter",
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "LinkedIn",
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

const trustBadges = [
  { value: "+۸", label: "سال تجربه" },
  { value: "+۸۰۰۰", label: "بیمار راضی" },
  { value: "۹۵٪", label: "رضایت درمان" },
];

export default function Hero() {
  const { dark } = useTheme();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/header_bg.jpg"
          alt="کلینیک دندانپزشکی"
          className="w-full h-full object-cover scale-105 animate-[floatSlow_20s_ease-in-out_infinite]"
        />
        <div
          className={`absolute inset-0 ${dark ? "bg-black-custom/85" : "bg-black/75"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black-custom/70" />
        <div className="absolute inset-0 bg-gradient-to-l from-gold/10 via-transparent to-teal/5" />
      </div>

      {/* Floating orbs */}
      <div
        className="orb orb-slow w-72 h-72 bg-gold/20 top-[15%] right-[10%]"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="orb w-56 h-56 bg-teal/15 bottom-[20%] left-[8%]"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="orb orb-slow w-40 h-40 bg-gold/10 top-[60%] right-[25%]"
        style={{ animationDelay: "4s" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-20 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 glass-card mb-6 animate-[fadeInDown_0.7s_ease]">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <p className="text-gold font-semibold text-xs sm:text-sm tracking-[0.15em]">
            مراقبت دندانپزشکی پیشرفته
          </p>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold text-white mb-5 leading-[1.1] tracking-tight animate-[fadeInUp_0.8s_ease_0.1s_both]">
          لبخند شما، <span className="gold-gradient-text">اولویت ماست</span>
        </h1>

        <p className="text-white/75 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl mx-auto animate-[fadeInUp_0.8s_ease_0.2s_both]">
          مراقبت دندانپزشکی در سطح جهانی با فناوری پیشرفته، راحتی لوکس و لمسی
          ملایم. لبخند ایده‌آل شما اینجا آغاز می‌شود.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-12 animate-[fadeInUp_0.8s_ease_0.3s_both]">
          <a
            href="#contact"
            className="btn-primary px-8 py-3.5 bg-gold text-black-custom rounded-full font-semibold shadow-xl shadow-gold/25 hover:bg-gold-light"
          >
            رزرو نوبت
          </a>
          <a
            href="#services"
            className="px-8 py-3.5 border-2 border-white/25 text-white rounded-full font-semibold glass-card hover:bg-white/10 hover:border-gold/50 hover:text-gold transition-all duration-300"
          >
            خدمات ما
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12 animate-[fadeInUp_0.8s_ease_0.35s_both]">
          {trustBadges.map((b) => (
            <div
              key={b.label}
              className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 glass-card min-w-[110px]"
            >
              <span className="block text-xl sm:text-2xl font-extrabold text-gold mb-0.5">
                {b.value}
              </span>
              <span className="text-white/60 text-xs sm:text-sm">
                {b.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center animate-[fadeInUp_0.8s_ease_0.45s_both]">
          {socials.map((s) => (
            <a
              key={s.label}
              href={`https://${s.label.toLowerCase()}.com`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-11 h-11 flex items-center justify-center bg-white/10 rounded-full text-white border border-white/10 hover:bg-gold hover:text-black-custom hover:border-gold transition-all duration-300 hover:-translate-y-1"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d={s.icon} />
              </svg>
            </a>
          ))}
          <a
            href="tel:+1234567890"
            aria-label="تماس تلفنی"
            className="w-11 h-11 flex items-center justify-center bg-white/10 rounded-full text-white border border-white/10 hover:bg-gold hover:text-black-custom hover:border-gold transition-all duration-300 hover:-translate-y-1"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer">
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-white/50 hover:text-gold transition-colors"
          aria-label="برو به بخش درباره ما"
        >
          <span className="text-[10px] tracking-widest uppercase hidden sm:block">
            بیشتر
          </span>
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
