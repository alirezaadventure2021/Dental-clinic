import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await api.get("/api/services");
      setServices(data.services || []);
    } catch (error) {
      toast.error("خطا در دریافت لیست خدمات", { position: "top-left" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/services/${deleteModal.id}`);
      setServices(services.filter((s) => s.id !== deleteModal.id));
      setDeleteModal(null);
      toast.success("خدمت با موفقیت حذف شد", { position: "top-left" });
    } catch (error) {
      toast.error(error.message || "خطا در حذف خدمت", { position: "top-left" });
    } finally {
      setDeleting(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.service_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">خدمات</h1>
          <p className="text-gray-500 text-sm mt-1">مدیریت خدمات کلینیک</p>
        </div>
        <Link
          to="/services/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-navy rounded-lg text-sm font-medium hover:bg-gold-hover transition-colors"
        >
          <Plus size={18} />
          <span>افزودن خدمت</span>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="جستجوی خدمت..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
          />
        </div>
      </div>

      {/* Services Table */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">خدمتی یافت نشد</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    نام خدمت
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    برچسب‌ها
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    تاریخ ایجاد
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {service.image ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${service.image}`}
                            alt={service.service_name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center">
                            <span className="text-gold font-bold text-sm">
                              {service.service_name?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-800">
                          {service.service_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {service.tags?.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy/10 text-navy"
                          >
                            {tag}
                          </span>
                        ))}
                        {service.tags?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{service.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {service.status === "active" ? "فعال" : "غیرفعال"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(service.created_at).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/services/${service.id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gold hover:bg-gold-light transition-colors"
                          title="مشاهده"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/services/${service.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="ویرایش"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal(service)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="حذف خدمت"
        message={`آیا از حذف "${deleteModal?.service_name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        confirmText={deleting ? "در حال حذف..." : "حذف"}
        cancelText="انصراف"
        type="danger"
      />
    </div>
  );
}
