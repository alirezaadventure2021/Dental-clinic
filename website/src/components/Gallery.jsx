import { useState, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";
import api from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function getTileAspect(index) {
  const landscapeShapes = [
    "16 / 10",
    "4 / 3",
    "3 / 2",
    "16 / 9",
    "5 / 3",
    "2 / 1",
    "6 / 4",
    "5 / 4",
  ];
  return landscapeShapes[index % landscapeShapes.length];
}

const DESKTOP_PER_PAGE = 16;
const MOBILE_PER_PAGE = 8;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
}

export default function Gallery() {
  const { dark } = useTheme();
  const isMobile = useIsMobile();
  const perPage = isMobile ? MOBILE_PER_PAGE : DESKTOP_PER_PAGE;
  const [activeService, setActiveService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [headerRef, headerInView] = useInView({ threshold: 0.2 });
  const [gridRef, gridInView] = useInView({ threshold: 0.05 });
  const [allPhotos, setAllPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const data = await api.get("/api/gallery");
        const images = (data.images || []).map((img) => ({
          id: img.id,
          serviceId: img.service?.id,
          serviceName: img.service?.service_name || "سایر",
          title: img.description || img.service?.service_name || "تصویر گالری",
          image: `${API_BASE_URL}${img.image}`,
          w: 1200,
          h: 800,
          ratio: 1.5,
          orient: "landscape",
        }));
        setAllPhotos(images);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const services = useMemo(() => {
    const serviceMap = new Map();
    allPhotos.forEach((photo) => {
      if (photo.serviceId) {
        if (!serviceMap.has(photo.serviceId)) {
          serviceMap.set(photo.serviceId, {
            id: photo.serviceId,
            name: photo.serviceName,
            count: 0,
          });
        }
        serviceMap.get(photo.serviceId).count++;
      }
    });
    return Array.from(serviceMap.values());
  }, [allPhotos]);

  const filteredPhotos = useMemo(() => {
    if (activeService === null) return allPhotos;
    return allPhotos.filter((photo) => photo.serviceId === activeService);
  }, [activeService, allPhotos]);

  const totalPages = Math.ceil(filteredPhotos.length / perPage) || 1;
  const displayedPhotos = filteredPhotos.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const selectedItem =
    selectedIndex !== null ? displayedPhotos[selectedIndex] : null;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeService, isMobile]);

  const goPrev = useCallback(() => {
    setSelectedIndex((i) =>
      i === null
        ? null
        : (i - 1 + displayedPhotos.length) % displayedPhotos.length,
    );
  }, [displayedPhotos.length]);

  const goNext = useCallback(() => {
    setSelectedIndex((i) =>
      i === null ? null : (i + 1) % displayedPhotos.length,
    );
  }, [displayedPhotos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") goNext();
      if (e.key === "ArrowRight") goPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedIndex, goPrev, goNext]);

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
      id="gallery"
      className={`py-20 sm:py-24 transition-colors duration-300 ${
        dark ? "bg-black-custom" : "bg-white-custom"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-10 sm:mb-14 reveal ${headerInView ? "revealed" : ""}`}
        >
          <p className="section-label justify-center mb-4">کارهای ما</p>
          <h2
            className={`font-display text-3xl sm:text-4xl font-semibold mb-4 leading-tight tracking-tight ${
              dark ? "text-white-custom" : "text-black-custom"
            }`}
          >
            گالری لبخند
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed ${dark ? "text-gray-light" : "text-gray-mid"}`}
          >
            مجموعه‌ای از نتایج واقعی درمان — با کیفیت استودیویی
          </p>
        </div>

        {/* Service filter tabs */}
        <div className="flex justify-center mb-10 sm:mb-12">
          <div
            className={`inline-flex flex-wrap justify-center gap-1 sm:gap-2 p-1.5 rounded-2xl ${
              dark ? "bg-black-lighter/80" : "bg-white-off"
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveService(null)}
              className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeService === null
                  ? "bg-gold text-black-custom shadow-md shadow-gold/25"
                  : dark
                    ? "text-gray-light hover:text-gold hover:bg-gold/10"
                    : "text-gray-mid hover:text-gold hover:bg-gold/10"
              }`}
            >
              همه
              <span
                className={`mr-1.5 text-[11px] opacity-70 ${
                  activeService === null ? "text-black-custom/70" : ""
                }`}
              >
                {allPhotos.length}
              </span>
            </button>
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveService(service.id)}
                className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeService === service.id
                    ? "bg-gold text-black-custom shadow-md shadow-gold/25"
                    : dark
                      ? "text-gray-light hover:text-gold hover:bg-gold/10"
                      : "text-gray-mid hover:text-gold hover:bg-gold/10"
                }`}
              >
                {service.name}
                <span
                  className={`mr-1.5 text-[11px] opacity-70 ${
                    activeService === service.id ? "text-black-custom/70" : ""
                  }`}
                >
                  {service.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div
              className={`inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin`}
            />
          </div>
        ) : (
          <>
            {/* Masonry grid */}
            <div
              ref={gridRef}
              className="columns-2 md:columns-3 xl:columns-4 gap-3 sm:gap-4"
            >
              {displayedPhotos.map((photo, i) => (
                <figure
                  key={photo.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedIndex(i)}
                  onClick={() => setSelectedIndex(i)}
                  className={`break-inside-avoid mb-3 sm:mb-4 group cursor-pointer reveal-scale ${
                    gridInView ? "revealed" : ""
                  }`}
                  style={{ transitionDelay: `${Math.min(i, 12) * 0.04}s` }}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl ${
                      dark
                        ? "bg-black-lighter shadow-lg shadow-black/40"
                        : "bg-cream shadow-md shadow-black/5"
                    } transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/20 group-hover:-translate-y-1`}
                    style={{ aspectRatio: getTileAspect(i) }}
                  >
                    <img
                      src={photo.image}
                      alt={photo.title}
                      loading="lazy"
                      width={photo.w}
                      height={photo.h}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Hover veil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                    {/* Zoom affordance */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6"
                        />
                      </svg>
                    </div>

                    {/* Caption */}
                    <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                      <span className="block text-white text-sm sm:text-base font-semibold leading-snug">
                        {photo.title}
                      </span>
                      <span className="inline-flex mt-1.5 items-center gap-1.5 text-gold text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        {photo.serviceName}
                      </span>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="text-center py-20">
                <h3
                  className={`text-xl font-semibold mb-2 ${dark ? "text-white-custom" : "text-black-custom"}`}
                >
                  عکسی یافت نشد
                </h3>
                <p className={dark ? "text-gray-light" : "text-gray-mid"}>
                  فیلترهای خود را تنظیم کنید
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14 flex-wrap">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full font-medium transition-all disabled:opacity-35 disabled:cursor-not-allowed border ${
                    dark
                      ? "border-white/10 text-white-custom hover:border-gold hover:text-gold"
                      : "border-black/10 text-black-custom hover:border-gold hover:text-gold"
                  }`}
                >
                  قبلی
                </button>
                <div className="flex items-center gap-1.5 mx-2">
                  {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`d${i}`}
                        className="w-8 text-center text-gray-mid"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setCurrentPage(p)}
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
                  onClick={() => setCurrentPage((p) => p + 1)}
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

            {/* Total count */}
            <p
              className={`text-center mt-5 text-sm ${dark ? "text-gray-light/70" : "text-gray-mid"}`}
            >
              نمایش {displayedPhotos.length.toLocaleString("fa-IR")} از{" "}
              {filteredPhotos.length.toLocaleString("fa-IR")} تصویر — مجموع:{" "}
              {allPhotos.length.toLocaleString("fa-IR")} تصویر
            </p>
          </>
        )}
      </div>

      {/* Lightbox */}
      {selectedItem && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[2000] flex flex-col animate-[fadeIn_0.25s_ease]"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
        >
          <div
            className="absolute inset-0 bg-black/92 backdrop-blur-md"
            onClick={() => setSelectedIndex(null)}
          />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4">
            <div className="text-white/80 text-sm font-medium">
              {(selectedIndex + 1).toLocaleString("fa-IR")} /{" "}
              {displayedPhotos.length.toLocaleString("fa-IR")}
            </div>
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-gold text-white hover:text-black-custom transition-all flex items-center justify-center text-2xl leading-none"
              aria-label="بستن"
            >
              ×
            </button>
          </div>

          {/* Stage */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-16 pb-6 min-h-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-gold text-white hover:text-black-custom transition-all flex items-center justify-center z-20"
              aria-label="عکس قبلی"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div
              className="max-w-6xl w-full max-h-full flex flex-col items-center animate-[scaleIn_0.3s_cubic-bezier(0.22,1,0.36,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                width={selectedItem.w}
                height={selectedItem.h}
                className="max-h-[min(72vh,900px)] w-auto max-w-full object-contain rounded-lg shadow-2xl relative"
              />
              <div className="mt-5 text-center px-4 absolute bottom-16">
                <h3 className="text-white font-display text-xl sm:text-2xl font-bold mb-2">
                  {selectedItem.title}
                </h3>
                <span className="inline-flex items-center gap-2 bg-gold/15 text-gold px-4 py-1.5 rounded-full text-sm font-medium border border-gold/20">
                  {selectedItem.serviceName}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-gold text-white hover:text-black-custom transition-all flex items-center justify-center z-20"
              aria-label="عکس بعدی"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          {/* Filmstrip thumbnails */}
          <div className="relative z-10 px-4 sm:px-8 pb-5 overflow-x-auto">
            <div className="flex gap-2 justify-center min-w-min mx-auto">
              {displayedPhotos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedIndex
                      ? "border-gold scale-105 shadow-lg shadow-gold/20"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                  aria-label={p.title}
                >
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
