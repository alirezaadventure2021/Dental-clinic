import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";

const testimonials = [
  {
    id: 1,
    name: "سمیرا حسینی",
    role: "دندانپزشک",
    image: "/testemonial/samira.jpeg",
    rating: 5,
    text: "دکتر علیزاده لبخند را با ارتودنسی به من برگرداند.",
    treatment: "ونیر سرامیکی",
  },
  {
    id: 2,
    name: "مایکل چن",
    role: "مهندس نرم‌افزار",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 5,
    text: "از کار دندانپزشکی می‌ترسیدم، اما تیم اینجا کاملاً مرا آرام کرد. ایمپلنت دندان من طبیعی به نظر می‌رسد و احساس می‌شود!",
    treatment: "ایمپلنت دندانی",
  },
  {
    id: 3,
    name: "امیلی رودریگز",
    role: "مدیر بازاریابی",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    rating: 5,
    text: "درمان عصب کشی بسیار راحت و محرمانه بود. دندان‌هایم اکنون کاملاً صاف هستند. شدیداً توصیه می‌کنم!",
    treatment: "عصب کشی",
  },
  {
    id: 4,
    name: "دیوید تامپسون",
    role: "رستوران‌دار",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    rating: 5,
    text: "حرفه‌ای، مهربان و ماهر. دکتر علیزاده دندان‌هایم را سفید کرد و نتایج فوق‌العاده هستند. لبخندم هرگز به این زیبایی نبوده!",
    treatment: "جرم گیری و سفید کردن دندان",
  },
  {
    id: 5,
    name: "آماندا ویلیامز",
    role: "معلم",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    rating: 5,
    text: "آوردن بچه‌هایم به اینجا بهترین تصمیم بود. تیم اطفال فوق‌العاده هستند و بچه‌هایم واقعاً منتظر مراجعه هستند!",
    treatment: "دندانپزشکی کودکان",
  },
  {
    id: 6,
    name: "رابرت مارتینز",
    role: "معمار",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    rating: 5,
    text: "بعد از ترمیم لبخندم، احساس می‌کنم یک نفر جدید هستم. توجه به جزئیات و مراقبت شخصی استثنایی بود!",
    treatment: "ترمیم لبخند",
  },
];

export default function Testimonials() {
  const { dark } = useTheme();
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <section
      id="testimonials"
      ref={ref}
      className={`py-24 sm:py-28 transition-colors duration-300 relative overflow-hidden ${
        dark ? "bg-black-light" : "bg-white-off"
      }`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div
          className={`text-center max-w-2xl mx-auto mb-14 reveal ${inView ? "revealed" : ""}`}
        >
          <p className="section-label justify-center mb-4">نظرات بیماران</p>
          <h2
            className={`font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight ${
              dark ? "text-white-custom" : "text-black-custom"
            }`}
          >
            بیماران ما چه می‌گویند
          </h2>
          <p
            className={`text-lg leading-relaxed ${dark ? "text-gray-light" : "text-gray-mid"}`}
          >
            فقط به حرف ما اکتفا نکنید. اینها نظرات بیماران ماست.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`card-hover relative p-8 rounded-2xl border reveal ${
                inView ? "revealed" : ""
              } ${
                dark
                  ? "bg-black-lighter border-gold/5 hover:border-gold/20 hover:shadow-xl hover:shadow-gold/5"
                  : "bg-white border-black/5 hover:border-gold/25 hover:shadow-xl hover:shadow-black/5"
              }`}
              style={{ transitionDelay: `${0.08 + i * 0.07}s` }}
            >
              {/* Quote mark */}
              <span
                className="absolute top-5 left-6 text-5xl font-serif text-gold/20 leading-none select-none"
                aria-hidden
              >
                «
              </span>

              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold/40"
                  />
                  <span className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-gold rounded-full border-2 border-white dark:border-black-lighter" />
                </div>
                <div>
                  <h4
                    className={`text-lg font-semibold ${
                      dark ? "text-white-custom" : "text-black-custom"
                    }`}
                  >
                    {t.name}
                  </h4>
                  <p
                    className={`text-sm ${dark ? "text-gray-light" : "text-gray-mid"}`}
                  >
                    {t.role}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex gap-0.5" aria-label={`امتیاز ${t.rating} از ۵`}>
                {[...Array(5)].map((_, j) => (
                  <span
                    key={j}
                    className={`text-lg ${j < t.rating ? "text-gold" : "text-gray-dark"}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p
                className={`leading-relaxed mb-5 text-sm ${
                  dark ? "text-gray-light" : "text-gray-mid"
                }`}
              >
                «{t.text}»
              </p>

              <div
                className={`pt-4 border-t ${dark ? "border-gold/10" : "border-black/5"}`}
              >
                <span className="bg-gold/10 text-gold px-3.5 py-1.5 rounded-full text-sm font-medium border border-gold/10">
                  {t.treatment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
