import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";

const contactInfo = [
  {
    icon: "📍",
    lines: ["خیابان دندان ۱۲۳، واحد ۱۰۰", "نیویورک، NY 10001"],
    title: "مراجعه حضوری",
  },
  {
    icon: "📞",
    title: "تماس با ما",
    lines: ["۰۱۲۳-۴۵۶-۷۸۹۰", "شنبه تا پنجشنبه: ۹ صبح تا ۶ عصر"],
    link: "tel:+1234567890",
  },
  {
    icon: "✉️",
    title: "ایمیل",
    lines: ["info@dentalclinic.com"],
    link: "mailto:info@dentalclinic.com",
  },
];

export default function Contact() {
  const { dark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1 });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate request; no backend inventing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        time: "",
        message: "",
      });
    }, 600);
  };

  const inputClass = `w-full py-3.5 px-4 rounded-xl text-base transition-all focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold border-2 ${
    dark
      ? "bg-black-custom/50 border-gold/10 text-white-custom placeholder:text-gray-mid"
      : "bg-white border-black/8 text-black-custom placeholder:text-gray-mid"
  }`;

  const labelClass = `font-medium mb-2 text-[0.95rem] ${
    dark ? "text-white-custom" : "text-black-custom"
  }`;

  return (
    <section
      id="contact"
      ref={ref}
      className={`py-24 sm:py-28 transition-colors duration-300 relative ${
        dark ? "bg-black-light" : "bg-white-off"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`text-center max-w-2xl mx-auto mb-14 reveal ${inView ? "revealed" : ""}`}
        >
          <p className="section-label justify-center mb-4">تماس با ما</p>
          <h2
            className={`font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight ${
              dark ? "text-white-custom" : "text-black-custom"
            }`}
          >
            رزرو نوبت
          </h2>
          <p
            className={`text-lg leading-relaxed ${dark ? "text-gray-light" : "text-gray-mid"}`}
          >
            آماده‌اید لبخند خود را تغییر دهید؟ امروز مشاوره خود را برنامه‌ریزی
            کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-12">
          <div
            className={`grid gap-4 reveal-right ${inView ? "revealed" : ""}`}
          >
            {contactInfo.map((info, i) => (
              <div
                key={info.title}
                className={`group p-6 rounded-2xl border transition-all duration-400 cursor-pointer ${
                  dark
                    ? "bg-black-lighter border-gold/10 hover:border-gold hover:bg-gold"
                    : "bg-white border-black/5 hover:border-gold hover:bg-gold shadow-sm"
                }`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <span className="text-2xl mb-3 block transition-transform duration-300 group-hover:scale-110">
                  {info.icon}
                </span>
                <h3
                  className={`text-lg font-semibold mb-2 transition-colors ${
                    dark
                      ? "text-gold group-hover:text-black-custom"
                      : "text-gold group-hover:text-black-custom"
                  }`}
                >
                  {info.title}
                </h3>
                {info.lines.map((line, j) =>
                  info.link && j === 0 ? (
                    <a
                      key={j}
                      href={info.link}
                      className={`block text-sm transition-colors ${
                        dark
                          ? "text-gray-light group-hover:text-black-custom/90"
                          : "text-gray-mid group-hover:text-black-custom/90"
                      }`}
                    >
                      {line}
                    </a>
                  ) : (
                    <p
                      key={j}
                      className={`text-sm transition-colors ${
                        j === 0
                          ? dark
                            ? "text-gray-light group-hover:text-black-custom/90"
                            : "text-gray-mid group-hover:text-black-custom/90"
                          : dark
                            ? "text-gray-mid group-hover:text-black-custom/70"
                            : "text-gray-mid/70 group-hover:text-black-custom/70"
                      }`}
                    >
                      {line}
                    </p>
                  ),
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className={`p-8 sm:p-10 rounded-3xl border reveal-left ${
              inView ? "revealed stagger-2" : ""
            } ${
              dark
                ? "bg-black-lighter border-gold/10 shadow-2xl shadow-black/30"
                : "bg-white border-black/5 shadow-xl shadow-black/5"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="name">
                  نام کامل *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="نام و نام خانوادگی"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="email">
                  ایمیل *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="phone">
                  تلفن *
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="service">
                  خدمت مورد نظر *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className={`${inputClass} cursor-pointer appearance-none`}
                >
                  <option value="">خدمت مورد نظر را انتخاب کنید</option>
                  <option value="consultation">مشاوره</option>
                  <option value="cleaning">تمیز کردن و معاینه</option>
                  <option value="whitening">سفید کردن دندان</option>
                  <option value="veneers">ونیر</option>
                  <option value="implants">ایمپلنت دندانی</option>
                  <option value="invisalign">اینویزیلاین</option>
                  <option value="other">سایر</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="date">
                  تاریخ مورد نظر
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="time">
                  ساعت مورد نظر
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer appearance-none`}
                >
                  <option value="">ساعت را انتخاب کنید</option>
                  {[
                    "۹:۰۰",
                    "۱۰:۰۰",
                    "۱۱:۰۰",
                    "۱۲:۰۰",
                    "۱۳:۰۰",
                    "۱۴:۰۰",
                    "۱۵:۰۰",
                    "۱۶:۰۰",
                    "۱۷:۰۰",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label className={labelClass} htmlFor="message">
                پیام
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="مشکل دندانپزشکی خود را شرح دهید..."
                className={`${inputClass} resize-y min-h-[120px]`}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 bg-gold text-black-custom rounded-xl font-semibold cursor-pointer hover:bg-gold-light shadow-lg shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting
                ? "در حال ارسال..."
                : isSubmitted
                  ? "✓ درخواست نوبت ارسال شد!"
                  : "درخواست نوبت"}
            </button>
            {isSubmitted && (
              <p className="text-center text-gold font-medium mt-4 animate-[fadeIn_0.3s_ease]">
                متشکریم! ظرف ۲۴ ساعت با شما تماس خواهیم گرفت.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
