import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function FAQCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leaveConfirmModal, setLeaveConfirmModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    sort_order: 0,
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isDirty = useCallback(() => {
    return (
      form.question.trim() !== "" ||
      form.answer.trim() !== "" ||
      form.sort_order !== 0 ||
      form.status !== "active"
    );
  }, [form]);

  const handleBackNavigation = (destination) => {
    if (isDirty()) {
      setPendingNavigation(destination);
      setLeaveConfirmModal(true);
    } else {
      navigate(destination);
    }
  };

  const handleConfirmLeave = () => {
    setLeaveConfirmModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/faqs", form);
      navigate("/faq");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "خطا در ایجاد سوال", { position: "top-left" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnHover
        theme="colored"
      />
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => handleBackNavigation("/faq")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">افزودن سوال جدید</h1>
          <p className="text-gray-500 text-sm mt-1">
            اطلاعات سوال جدید را وارد کنید
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              سوال <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="question"
              value={form.question}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
              placeholder="مثلا: آیا ایمپلنت درد دارد؟"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              پاسخ <span className="text-red-500">*</span>
            </label>
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleChange}
              rows={5}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition resize-none"
              placeholder="پاسخ سوال..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ترتیب نمایش
              </label>
              <input
                type="number"
                name="sort_order"
                value={form.sort_order}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                وضعیت
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition bg-white"
              >
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gold text-navy rounded-lg text-sm font-medium hover:bg-gold-hover focus:ring-2 focus:ring-gold focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                <span>ذخیره سوال</span>
              )}
            </button>
            <Link
              to="/faq"
              className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
            >
              انصراف
            </Link>
          </div>
        </form>
      </div>

      {/* Leave Page Confirmation Dialog */}
      <ConfirmDialog
        isOpen={leaveConfirmModal}
        onClose={() => {
          setLeaveConfirmModal(false);
          setPendingNavigation(null);
        }}
        onConfirm={handleConfirmLeave}
        title="ترک صفحه"
        message="آیا از ترک صفحه اطمینان دارید؟ تغییرات ذخیره نشده از بین خواهند رفت."
        confirmText="ترک صفحه"
        cancelText="ماندن در صفحه"
        type="danger"
      />
    </div>
  );
}
