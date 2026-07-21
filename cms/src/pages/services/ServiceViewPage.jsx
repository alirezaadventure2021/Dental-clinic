import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { UPLOAD_URL } from "../../config";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function ServiceViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const data = await api.get(`/services/${id}`);
      setService(data.service);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات خدمت", { position: "top-left" });
      navigate("/services");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/services/${id}`);
      toast.success("خدمت با موفقیت حذف شد", { position: "top-left" });
      navigate("/services");
    } catch (error) {
      toast.error(error.message || "خطا در حذف خدمت", { position: "top-left" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/services"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {service.service_name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">مشاهده جزئیات خدمت</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/services/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Edit size={16} />
            <span>ویرایش</span>
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} />
            <span>حذف</span>
          </button>
        </div>
      </div>

      {/* Service Details */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {service.image && (
          <div className="aspect-video bg-gray-100">
            <img
              src={`${UPLOAD_URL}${service.image}`}
              alt={service.service_name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">نام خدمت</h3>
            <p className="text-gray-800">{service.service_name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">وضعیت</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                service.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {service.status === "active" ? "فعال" : "غیرفعال"}
            </span>
          </div>

          {service.tags?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                برچسب‌ها
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded text-sm font-medium bg-navy/10 text-navy"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {service.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                توضیحات
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {service.description}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              تاریخ ایجاد
            </h3>
            <p className="text-gray-700">
              {new Date(service.created_at).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="حذف خدمت"
        message={`آیا از حذف "${service.service_name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        confirmText={deleting ? "در حال حذف..." : "حذف"}
        cancelText="انصراف"
        type="danger"
      />
    </div>
  );
}
