import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";
import api from "../services/api";

const PER_PAGE = 10;

const fallbackFaqs = [
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
];

export default function FAQ() {
  const { dark } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [faqs, setFaqs] = useState(fallbackFaqs);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await api.get("/api/faqs");
        const activeFaqs = (data.faqs || []).filter(
          (faq) => faq.status === "active",
        );
        if (activeFaqs.length > 0) {
          setFaqs(activeFaqs);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFAQs();
  }, []);

  const totalPages = Math.ceil(faqs.length / PER_PAGE);
  const displayedFaqs = faqs.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let s = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, s + max - 1);
    if (end - s + 1 < max) s = Math.max(1, end - max + 1);
    if (s > 1) {
      pages.push(1);
      if (s > 2) pages.push("...");
    }
    for (let i = s; i <= end; i++) pages.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section
      id="faq"
      ref={ref}
      className={`py-20 sm:py-24 transition-colors duration-300 ${
        dark ? "bg-black-custom" : "bg-white-custom"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`text-center max-w-2xl mx-auto mb-12 reveal ${inView ? "revealed" : ""}`}
        >
          <p className="section-label justify-center mb-4">سوالات متداول</p>
          <h2
            className={`font-display text-3xl sm:text-4xl font-semibold mb-4 leading-tight tracking-tight ${
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
          {displayedFaqs.map((faq, i) => {
            const globalIndex = (currentPage - 1) * PER_PAGE + i;
            const isOpen = openIndex === globalIndex;
            return (
              <div
                key={globalIndex}
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
                  onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => p - 1);
                setOpenIndex(null);
              }}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full font-medium transition-all disabled:opacity-35 disabled:cursor-not-allowed border ${
                dark
                  ? "border-white/10 text-white-custom hover:border-gold hover:text-gold"
                  : "border-black/10 text-black-custom hover:border-gold hover:text-gold"
              }`}
            >
              قبلی
            </button>
            <div className="flex items-center gap-1.5 mx-2">
              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`d${idx}`}
                    className="w-8 text-center text-gray-mid"
                  >
                    …
                  </span>
                ) : (
                  <button
                    type="button"
                    key={p}
                    onClick={() => {
                      setCurrentPage(p);
                      setOpenIndex(null);
                    }}
                    className={`min-w-[40px] h-10 px-2 flex items-center justify-center rounded-full font-medium transition-all ${
                      currentPage === p
                        ? "bg-gold text-black-custom shadow-md shadow-gold/25"
                        : dark
                          ? "text-gray-light hover:bg-gold/10 hover:text-gold"
                          : "text-gray-mid hover:bg-gold/10 hover:text-gold"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => p + 1);
                setOpenIndex(null);
              }}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full font-medium transition-all disabled:opacity-35 disabled:cursor-not-allowed border ${
                dark
                  ? "border-white/10 text-white-custom hover:border-gold hover:text-gold"
                  : "border-black/10 text-black-custom hover:border-gold hover:text-gold"
              }`}
            >
              بعدی
            </button>
          </div>
        )}

        <p
          className={`text-center mt-5 text-sm ${dark ? "text-gray-light/70" : "text-gray-mid"}`}
        >
          نمایش {((currentPage - 1) * PER_PAGE + 1).toLocaleString("fa-IR")} تا{" "}
          {Math.min(currentPage * PER_PAGE, faqs.length).toLocaleString(
            "fa-IR",
          )}{" "}
          از {faqs.length.toLocaleString("fa-IR")} سوال
        </p>
      </div>
    </section>
  );
}
