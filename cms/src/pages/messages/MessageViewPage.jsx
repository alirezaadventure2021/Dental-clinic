import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Trash2, Mail, MailOpen } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function MessageViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    fetchMessage();
  }, [id]);

  const fetchMessage = async () => {
    try {
      const data = await api.get(`/messages/${id}`);
      setMessage(data.message);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات پیام", { position: "top-left" });
      navigate("/messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/messages/${id}`);
      toast.success("پیام با موفقیت حذف شد", { position: "top-left" });
      navigate("/messages");
    } catch (err) {
      toast.error(err.message || "خطا در حذف پیام", { position: "top-left" });
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

  if (!message) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">پیام یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/messages")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">مشاهده پیام</h1>
            <p className="text-gray-500 text-sm mt-1">جزئیات پیام دریافتی</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {message.is_read ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-500 bg-gray-100 rounded-lg text-xs font-medium">
              <MailOpen size={14} />
              خوانده شده
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gold bg-gold-light/30 rounded-lg text-xs font-medium">
              <Mail size={14} />
              خوانده نشده
            </span>
          )}
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
        {/* Sender Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              نام فرستنده
            </label>
            <p className="text-gray-800 font-medium">{message.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              ایمیل
            </label>
            <p className="text-gray-800" dir="ltr">
              {message.email}
            </p>
          </div>
          {message.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                تلفن
              </label>
              <p className="text-gray-800" dir="ltr">
                {message.phone}
              </p>
            </div>
          )}
          {message.subject && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                موضوع
              </label>
              <p className="text-gray-800">{message.subject}</p>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            متن پیام
          </label>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {message.message}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-xs text-gray-500 mb-1">
            تاریخ دریافت
          </label>
          <p className="text-sm text-gray-600">
            {new Date(message.created_at).toLocaleString("fa-IR")}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="حذف پیام"
        message={`آیا از حذف پیام "${message.name}" اطمینان دارید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        type="danger"
      />
    </div>
  );
}
