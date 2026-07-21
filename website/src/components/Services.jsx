import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";

const services = [
  {
    icon: "🦷",
    title: "دندانپزشکی عمومی",
    desc: "مراقبت جامع از سلامت دهان شامل تمیز کردن، پر کردن و درمان‌های پیشگیرانه.",
    treatments: ["تمیز کردن و معاینه", "پر کردن", "عصب‌کشی", "کشیدن دندان"],
    image: "/services/general-stomotology.jpg",
  },
  {
    icon: "✨",
    title: "دندانپزشکی زیبایی",
    desc: "لبخند خود را با روش‌های زیبایی پیشرفته برای افزایش اعتماد به نفس تغییر دهید.",
    treatments: ["سفید کردن دندان", "ونیر", "باندینگ", "ترمیم لبخند"],
    image: "/services/beauty-stomotology.jpg",
  },
  {
    icon: "😁",
    title: "ارتدنسی",
    desc: "دندان‌های خود را با راه‌حل‌های مدرن از جمله ارتودنسی شفاف صاف کنید.",
    treatments: ["اینویزیلاین", "بریج فلزی", "بریج سرامیکی", "نگهدارنده"],
    image: "/services/orthodontic.jpg",
  },
  {
    icon: "🏥",
    title: "جراحی دهان",
    desc: "روش‌های جراحی تخصصی با دقت و مراقبت برای بهبودی بهینه.",
    treatments: ["دندان عقل", "حفظ سوکت", "بیوپسی", "جراحی فک"],
    image: "/services/surgery.jpg",
  },
  {
    icon: "👶",
    title: "دندانپزشکی کودکان",
    desc: "مراقبت دندانپزشکی ملایم و دوستانه برای کودکان در محیطی مناسب کودک.",
    treatments: ["سیلانت", "فلوراید درمانی", "نگهدارنده فضا", "معاینه کودکان"],
    image: "/services/children-dental.jpg",
  },
];

export default function Services() {
  const { dark } = useTheme();
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <section
      id="services"
      ref={ref}
      className={`py-24 sm:py-28 transition-colors duration-300 relative ${
        dark ? "bg-black-light" : "bg-white-off"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div
            className={`relative lg:sticky lg:top-28 reveal-right ${inView ? "revealed" : ""}`}
          >
            <div className="relative overflow-hidden rounded-3xl group">
              <img
                src="/services-cover.jpg"
                alt="خدمات دندانپزشکی"
                className="w-full h-[420px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-custom/80 via-black-custom/20 to-transparent" />
              <div className="absolute bottom-8 right-8 left-8">
                <p className="section-label mb-3 text-gold">چه چیزی ارائه می‌دهیم</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-white">
                  خدمات ما
                </h2>
                <p className="text-white/70 mt-3 text-sm sm:text-base max-w-md leading-relaxed">
                  از مراقبت‌های پیشگیرانه تا درمان‌های تخصصی — همه در یک محیط
                  آرام و مدرن.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {services.map((service, i) => (
              <div
                key={service.title}
                className={`card-hover rounded-2xl overflow-hidden border reveal-scale ${
                  inView ? "revealed" : ""
                } ${
                  dark
                    ? "bg-black-lighter border-gold/5 hover:border-gold/25 hover:shadow-xl hover:shadow-gold/5"
                    : "bg-white border-black/5 hover:border-gold/30 hover:shadow-xl hover:shadow-black/5"
                } ${i === services.length - 1 && services.length % 2 === 1 ? "sm:col-span-2 sm:max-w-md sm:mx-auto w-full" : ""}`}
                style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-md text-xl border border-white/10">
                    {service.icon}
                  </span>
                </div>
                <div className="p-5">
                  <h3
                    className={`font-display text-lg font-bold mb-2 ${
                      dark ? "text-white-custom" : "text-black-custom"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      dark ? "text-gray-light" : "text-gray-mid"
                    }`}
                  >
                    {service.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.treatments.map((t) => (
                      <span
                        key={t}
                        className="bg-gold/10 text-gold px-2.5 py-1 rounded-full text-xs font-medium border border-gold/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
