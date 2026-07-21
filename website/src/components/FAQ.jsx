import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";

const faqs = [
  {
    question: "چند وقت یکبار باید به دندانپزشک مراجعه کنم؟",
    answer:
      "توصیه می‌کنیم هر ۶ ماه یکبار برای معاینه روتین و تمیز کردن حرفه‌ای به دندانپزشک مراجعه کنید. با این حال، اگر نگرانی‌های خاص دندانپزشکی دارید، مراجعه مکررتر ممکن است توصیه شود.",
  },
  {
    question: "سفید کردن دندان به مینا آسیب می‌زند؟",
    answer:
      "سفید کردن حرفه‌ای دندان توسط دندانپزشک واجد شرایط بی‌خطر است و به مینای دندان آسیب نمی‌رساند. ما از محصولات و تکنیک‌های اثبات شده بالینی استفاده می‌کنیم.",
  },
  {
    question: "ایمپلنت‌های دندانی چقدر دوام دارند؟",
    answer:
      "با مراقبت و نگهداری مناسب، ایمپلنت‌های دندانی می‌توانند یک عمر دوام داشته باشند. آنها به عنوان راه‌حل دائمی با نرخ موفقیت بیش از ۹۵٪ طراحی شده‌اند.",
  },
  {
    question: "آیا اینویزیلاین به اندازه بریج سنتی مؤثر است؟",
    answer:
      "در بیشتر موارد، اینویزیلاین به اندازه بریج سنتی مؤثر است. به ویژه برای بزرگسالان و نوجوانانی که گزینه ارتودنسی محرمانه می‌خواهند عالی است.",
  },
  {
    question: "آیا بیمه دندانپزشکی قبول می‌کنید؟",
    answer:
      "بله، ما اکثر طرح‌های بیمه دندانپزشکی اصلی را قبول می‌کنیم. همچنین گزینه‌های پرداخت انعطاف‌پذیر و برنامه‌های اقساطی برای درمان‌هایی که کامل توسط بیمه پوشش داده نمی‌شوند ارائه می‌دهیم.",
  },
  {
    question: "در شرایط اورژانس دندانپزشکی چه کاری باید انجام دهم؟",
    answer:
      "فوراً با خط اورژانس ما به شماره ۰۱۲۳-۴۵۶-۷۸۹۱ تماس بگیرید. اورژانس‌های رایج شامل درد شدید دندان، دندان‌های کنده شده، دندان‌های شکسته یا پرکردگی‌های از دست رفته است.",
  },
];

export default function FAQ() {
  const { dark } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <section
      id="faq"
      ref={ref}
      className={`py-24 sm:py-28 transition-colors duration-300 ${
        dark ? "bg-black-custom" : "bg-white-custom"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`text-center max-w-2xl mx-auto mb-12 reveal ${inView ? "revealed" : ""}`}
        >
          <p className="section-label justify-center mb-4">سوالات متداول</p>
          <h2
            className={`font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight ${
              dark ? "text-white-custom" : "text-black-custom"
            }`}
          >
            پرسش‌های پرتکرار
          </h2>
          <p
            className={`text-lg leading-relaxed ${dark ? "text-gray-light" : "text-gray-mid"}`}
          >
            سوالی دارید؟ ما پاسخ‌ها را داریم.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl mb-3 overflow-hidden transition-all duration-300 border-2 reveal ${
                  inView ? "revealed" : ""
                } ${
                  isOpen
                    ? dark
                      ? "border-gold bg-black-lighter shadow-lg shadow-gold/5"
                      : "border-gold bg-white shadow-lg"
                    : dark
                      ? "border-gold/10 bg-black-lighter hover:border-gold/30"
                      : "border-black/5 bg-white hover:border-gold/30"
                }`}
                style={{ transitionDelay: `${0.05 + i * 0.05}s` }}
              >
                <button
                  type="button"
                  className="w-full px-6 py-5 flex items-center justify-between bg-transparent border-none cursor-pointer text-right gap-4"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base sm:text-lg font-semibold pl-4 ${
                      dark ? "text-white-custom" : "text-black-custom"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-lg font-bold shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-gold text-black-custom rotate-180"
                        : "bg-gold/10 text-gold"
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div className={`faq-panel ${isOpen ? "open" : ""}`}>
                  <div>
                    <p
                      className={`px-6 pb-5 leading-relaxed ${
                        dark ? "text-gray-light" : "text-gray-mid"
                      }`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
