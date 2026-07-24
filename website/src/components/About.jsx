import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";
import { useCountUp } from "../hooks/useCountUp";

const stats = [
  { target: 10, prefix: "+", label: "سال تجربه" },
  { target: 8000, prefix: "+", label: "بیمار راضی" },
  { target: 3000, prefix: "+", label: "ترمیم لبخند" },
  { target: 3, prefix: "+", label: "جایزه کسب شده" },
];

const credentials = [
  "دندانپزشک متخصص بورد",
  "گواهینامه پیشرفته ایمپلنت",
  "دانشکده دندانپزشکی خاتم النبیین",
];

function StatItem({ target, prefix, label, active, dark }) {
  const value = useCountUp(target, active);
  const display =
    target >= 1000
      ? `${prefix}${value.toLocaleString("fa-IR")}`
      : `${prefix}${value.toLocaleString("fa-IR")}`;

  return (
    <div className="text-center group">
      <span className="block text-2xl sm:text-3xl font-extrabold text-gold mb-1 transition-transform duration-300 group-hover:scale-110">
        {display}
      </span>
      <span className={`text-xs ${dark ? "text-gray-light" : "text-gray-mid"}`}>
        {label}
      </span>
    </div>
  );
}

export default function About() {
  const { dark } = useTheme();
  const [sectionRef, inView] = useInView({ threshold: 0.2 });
  const [statsRef, statsInView] = useInView({ threshold: 0.4 });

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`py-20 sm:py-24 transition-colors duration-300 relative overflow-hidden ${
        dark ? "bg-black-custom" : "bg-white-custom"
      }`}
    >
      {/* Soft background accent */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`relative reveal-right ${inView ? "revealed" : ""}`}>
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-3 rounded-[2rem] border border-gold/20 -z-10" />
              <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-gold/40 rounded-tr-3xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-gold/40 rounded-bl-3xl" />

              <img
                src="/profile.JPG"
                alt="دکتر محمود علیزاده"
                className="w-full h-[520px] sm:h-[600px] object-cover rounded-3xl shadow-2xl shadow-black/20"
              />
              <div className="absolute -bottom-5 -left-2 sm:-left-5 bg-gradient-to-br from-gold to-gold-dark text-black-custom p-5 sm:p-6 rounded-2xl text-center shadow-xl shadow-gold/25">
                <span className="block text-3xl sm:text-4xl font-extrabold leading-none">
                  +۱۰
                </span>
                <span className="text-sm font-medium">سال تجربه</span>
              </div>
            </div>
          </div>

          <div className={`py-5 reveal-left ${inView ? "revealed stagger-2" : ""}`}>
            <p className="section-label mb-4">درباره دکتر علیزاده</p>
            <h2
              className={`font-display text-3xl sm:text-4xl font-semibold mb-2 leading-tight tracking-tight transition-colors ${
                dark ? "text-white-custom" : "text-black-custom"
              }`}
            >
              دکتر محمود علیزاده
            </h2>
            <p className="text-gold font-semibold text-lg mb-5">
              جراح ارشد دندانپزشکی و استیمالوژیست
            </p>
            <p
              className={`text-base leading-relaxed mb-5 transition-colors ${
                dark ? "text-gray-light" : "text-gray-mid"
              }`}
            >
              دکتر علیزاده با بیش از ۱۰ سال تجربه در دندانپزشکی پیشرفته، متعهد
              به ارائه مراقبت‌های استثنایی دندانپزشکی در محیطی لوکس و راحت است.
              اشتیاق او ترمیم لبخندها و بهبود زندگی از طریق برنامه‌های درمانی
              شخصی‌سازی شده است.
            </p>
            <p
              className={`text-base leading-relaxed mb-10 transition-colors ${
                dark ? "text-gray-light" : "text-gray-mid"
              }`}
            >
              فارغ‌التحصیل از دانشکده دندانپزشکی خاتم النبیین با آموزش پیشرفته
              در دندانپزشکی زیبایی، ایمپلنت‌های دندانی و ترمیم لبخند.
            </p>

            <div
              ref={statsRef}
              className={`grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-t border-b mb-8 transition-colors ${
                dark ? "border-gold/10" : "border-black/10"
              }`}
            >
              {stats.map((stat) => (
                <StatItem
                  key={stat.label}
                  target={stat.target}
                  prefix={stat.prefix}
                  label={stat.label}
                  active={statsInView}
                  dark={dark}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {credentials.map((cred, i) => (
                <div
                  key={cred}
                  className={`flex items-center gap-3 font-medium reveal ${
                    inView ? "revealed" : ""
                  } ${dark ? "text-white-custom" : "text-black-custom"}`}
                  style={{ transitionDelay: `${0.35 + i * 0.08}s` }}
                >
                  <span className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-gold to-gold-dark text-black-custom rounded-full text-xs shrink-0 shadow-md shadow-gold/20">
                    ✓
                  </span>
                  <span className="text-sm">{cred}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
