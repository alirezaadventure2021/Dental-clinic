import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";
import api from "../services/api";

export default function Services() {
  const { dark } = useTheme();
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get("/api/services");
        const activeServices = (data.services || []).filter(
          (service) => service.status === "active",
        );
        setServices(activeServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <section
      id="services"
      ref={ref}
      className={`py-20 lg:py-24 transition-colors duration-300 relative ${
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
              <div className="absolute top-1/2 right-8 left-8">
                <p className="section-label mb-3 text-gold">
                  چه چیزی ارائه می‌دهیم
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-white">
                  خدمات ما
                </h2>
                <p className="text-white/70 mt-3 text-sm sm:text-base  leading-relaxed">
                  از مراقبت‌های پیشگیرانه تا درمان‌های تخصصی — همه در یک محیط
                  آرام و مدرن.
                </p>
              </div>
            </div>
          </div>

          <div className="grid  grid-cols-1 lg:grid-cols-2 gap-5">
            {services.map((service, i) => (
              <div
                key={service.id}
                className={`card-hover rounded-2xl overflow-hidden border reveal-scale ${
                  inView ? "revealed" : ""
                } ${
                  dark
                    ? "bg-black-lighter border-gold/5 hover:border-gold/25 hover:shadow-xl hover:shadow-gold/5"
                    : "bg-white border-black/5 hover:border-gold/30 hover:shadow-xl hover:shadow-black/5"
                } `}
                style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${service.image}`}
                    alt={service.service_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-5">
                  <h3
                    className={`font-display text-lg font-bold mb-2 ${
                      dark ? "text-white-custom" : "text-black-custom"
                    }`}
                  >
                    {service.service_name}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      dark ? "text-gray-light" : "text-gray-mid"
                    }`}
                  >
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.treatments?.map((treatment) => (
                      <span
                        key={treatment.id}
                        className="bg-gold/10 text-gold px-2.5 py-1 rounded-full text-xs font-medium border border-gold/10"
                      >
                        {treatment.name}
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
