import { useTheme } from "../context/ThemeContext";

const quickLinks = [
  { label: "خانه", href: "#home" },
  { label: "درباره ما", href: "#about" },
  { label: "خدمات", href: "#services" },
  { label: "گالری", href: "#gallery" },
  { label: "تماس با ما", href: "#contact" },
];

const services = [
  "دندانپزشکی عمومی",
  "دندانپزشکی زیبایی",
  "ایمپلنت دندانی",
  "ارتدنسی",
  "دندانپزشکی کودکان",
];

const socials = [
  {
    label: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Twitter",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

export default function Footer() {
  const { dark } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer
      className={`pt-20 pb-0 transition-colors duration-300 relative overflow-hidden ${
        dark
          ? "bg-black-light border-t border-gold/10"
          : "bg-black-custom border-t border-white/10"
      }`}
    >
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          <div>
            <a
              href="#home"
              className="flex items-center gap-3 text-2xl font-bold mb-5 group"
            >
              <img
                src="/logo.png"
                alt="لوگو کلینیک دندانپزشکی"
                className="h-[50px] w-[50px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="text-white-custom font-display">
                کلینیک<span className="text-gold">دندان</span>
              </span>
            </a>
            <p className="text-gray-light leading-relaxed mb-6 text-sm">
              ایجاد لبخندهای زیبا و سالم با فناوری دندانپزشکی پیشرفته و
              مراقبت‌های دلسوزانه در محیطی لوکس.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={`https://${s.label.toLowerCase()}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-gray-light border border-white/5 hover:bg-gold hover:text-black-custom hover:border-gold transition-all duration-300 hover:-translate-y-1"
                  aria-label={s.label}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white-custom text-lg font-semibold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-10 after:h-[3px] after:bg-gradient-to-l after:from-gold after:to-gold-dark after:rounded-sm">
              دسترسی سریع
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-light hover:text-gold transition-all hover:pr-2 text-sm inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white-custom text-lg font-semibold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-10 after:h-[3px] after:bg-gradient-to-l after:from-gold after:to-gold-dark after:rounded-sm">
              خدمات
            </h4>
            <ul className="space-y-3">
              {services.map((svc) => (
                <li key={svc}>
                  <a
                    href="#services"
                    className="text-gray-light hover:text-gold transition-all hover:pr-2 text-sm inline-block"
                  >
                    {svc}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white-custom text-lg font-semibold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-10 after:h-[3px] after:bg-gradient-to-l after:from-gold after:to-gold-dark after:rounded-sm">
              تماس با ما
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-gray-light text-sm">
                <span className="text-xl shrink-0">📍</span>
                <span>
                  خیابان دندان ۱۲۳، واحد ۱۰۰
                  <br />
                  نیویورک، NY 10001
                </span>
              </li>
              <li className="flex gap-3 text-gray-light text-sm">
                <span className="text-xl shrink-0">📞</span>
                <a
                  href="tel:+1234567890"
                  className="text-gray-light hover:text-gold transition-all"
                >
                  ۰۱۲۳-۴۵۶-۷۸۹۰
                </a>
              </li>
              <li className="flex gap-3 text-gray-light text-sm">
                <span className="text-xl shrink-0">✉️</span>
                <a
                  href="mailto:info@dentalclinic.com"
                  className="text-gray-light hover:text-gold transition-all break-all"
                >
                  info@dentalclinic.com
                </a>
              </li>
              <li className="flex gap-3 text-gray-light text-sm">
                <span className="text-xl shrink-0">🕐</span>
                <span>
                  شنبه تا پنجشنبه: ۹ صبح تا ۶ عصر
                  <br />
                  جمعه: ۹ صبح تا ۲ بعدازظهر
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-light text-sm">
            &copy; {year.toLocaleString("fa-IR")} کلینیک دندان. تمامی حقوق محفوظ
            است.
          </p>
          <div className="flex gap-6">
            <a
              href="#privacy"
              className="text-gray-light text-sm hover:text-gold transition-all"
            >
              سیاست حفظ حریم خصوصی
            </a>
            <a
              href="#terms"
              className="text-gray-light text-sm hover:text-gold transition-all"
            >
              شرایط استفاده
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
