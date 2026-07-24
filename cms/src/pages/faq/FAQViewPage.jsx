import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function FAQViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [faq, setFAQ] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    fetchFAQ();
  }, [id]);

  const fetchFAQ = async () => {
    try {
      const data = await api.get(`/api/faqs/${id}`);
      setFAQ(data.faq);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات سوال", { position: "top-left" });
      navigate("/faq");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/faqs/${id}`);
      toast.success("سوال با موفقیت حذف شد", { position: "top-left" });
      navigate("/faq");
    } catch (err) {
      toast.error(err.message || "خطا در حذف سوال", { position: "top-left" });
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

  if (!faq) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">سوال یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/faq")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">مشاهده سوال</h1>
            <p className="text-gray-500 text-sm mt-1">جزئیات سوال</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/faq/${id}/edit`}
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
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">وضعیت:</span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              faq.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                faq.status === "active" ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            {faq.status === "active" ? "فعال" : "غیرفعال"}
          </span>
        </div>

        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            سوال
          </label>
          <p className="text-gray-800 font-medium">{faq.question}</p>
        </div>

        {/* Answer */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            پاسخ
          </label>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {faq.answer}
          </p>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            ترتیب نمایش
          </label>
          <p className="text-gray-700">{faq.sort_order}</p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              تاریخ ایجاد
            </label>
            <p className="text-sm text-gray-600">
              {new Date(faq.created_at).toLocaleDateString("fa-IR")}
            </p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              تاریخ بروزرسانی
            </label>
            <p className="text-sm text-gray-600">
              {new Date(faq.updated_at).toLocaleDateString("fa-IR")}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="حذف سوال"
        message={`آیا از حذف "${faq.question}" اطمینان دارید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        type="danger"
      />
    </div>
  );
}
