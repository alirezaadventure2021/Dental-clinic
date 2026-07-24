import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function FAQEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [leaveConfirmModal, setLeaveConfirmModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const initialFormRef = useRef(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    sort_order: 0,
    status: "active",
  });

  useEffect(() => {
    fetchFAQ();
  }, [id]);

  const fetchFAQ = async () => {
    try {
      const data = await api.get(`/api/faqs/${id}`);
      const { faq } = data;
      const initialForm = {
        question: faq.question,
        answer: faq.answer,
        sort_order: faq.sort_order,
        status: faq.status,
      };
      setForm(initialForm);
      initialFormRef.current = initialForm;
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات سوال", { position: "top-left" });
      navigate("/faq");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isDirty = useCallback(() => {
    if (!initialFormRef.current) return false;
    const initial = initialFormRef.current;
    return (
      form.question !== initial.question ||
      form.answer !== initial.answer ||
      form.sort_order !== initial.sort_order ||
      form.status !== initial.status
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
    setSaving(true);

    try {
      await api.put(`/api/faqs/${id}`, form);
      toast.success("سوال با موفقیت بروزرسانی شد", { position: "top-left" });
      setTimeout(() => navigate(`/faq/${id}`), 500);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "خطا در بروزرسانی سوال", {
        position: "top-left",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-gray-800">ویرایش سوال</h1>
          <p className="text-gray-500 text-sm mt-1">بروزرسانی اطلاعات سوال</p>
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
              disabled={saving}
              className="px-6 py-2.5 bg-gold text-navy rounded-lg text-sm font-medium hover:bg-gold-hover focus:ring-2 focus:ring-gold focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>در حال بروزرسانی...</span>
                </>
              ) : (
                <span>بروزرسانی سوال</span>
              )}
            </button>
            <Link
              to={`/faq/${id}`}
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
