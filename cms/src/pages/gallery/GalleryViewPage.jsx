import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function GalleryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    fetchImage();
  }, [id]);

  const fetchImage = async () => {
    try {
      const data = await api.get(`/api/gallery/${id}`);
      setImage(data.image);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات تصویر", { position: "top-left" });
      navigate("/gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/gallery/${id}`);
      toast.success("تصویر با موفقیت حذف شد", { position: "top-left" });
      navigate("/gallery");
    } catch (err) {
      toast.error(err.message || "خطا در حذف تصویر", { position: "top-left" });
    } finally {
      setDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (!image) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">تصویر یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/gallery")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">مشاهده تصویر</h1>
            <p className="text-gray-500 text-sm mt-1">جزئیات تصویر گالری</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/gallery/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg text-sm font-medium transition-colors"
          >
            <Edit size={16} />
            <span>ویرایش</span>
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 size={16} />
            <span>حذف</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Image */}
        <div className="aspect-video bg-gray-100">
          <img
            src={`${import.meta.env.VITE_API_URL}${image.image}`}
            alt={image.description || "تصویر گالری"}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              خدمت مرتبط
            </label>
            <p className="text-gray-800">
              {image.service?.service_name || "بدون خدمت"}
            </p>
          </div>

          {/* Description */}
          {image.description && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                توضیحات
              </label>
              <p className="text-gray-700 whitespace-pre-wrap">
                {image.description}
              </p>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                تاریخ ایجاد
              </label>
              <p className="text-sm text-gray-600">
                {new Date(image.created_at).toLocaleDateString("fa-IR")}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                تاریخ بروزرسانی
              </label>
              <p className="text-sm text-gray-600">
                {new Date(image.updated_at).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="حذف تصویر"
        message="آیا از حذف این تصویر اطمینان دارید؟"
        confirmText="حذف"
        cancelText="انصراف"
        type="danger"
      />
    </div>
  );
}
