import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/faqs");
      setFaqs(data.faqs || []);
    } catch (err) {
      toast.error("خطا در دریافت سوالات", { position: "top-left" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;
    try {
      await api.delete(`/api/faqs/${faqToDelete.id}`);
      toast.success("سوال با موفقیت حذف شد", { position: "top-left" });
      setFaqs((prev) => prev.filter((f) => f.id !== faqToDelete.id));
    } catch (err) {
      toast.error(err.message || "خطا در حذف سوال", { position: "top-left" });
    } finally {
      setDeleteModal(false);
      setFaqToDelete(null);
    }
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">سوالات متداول</h1>
          <p className="text-gray-500 text-sm mt-1">
            مدیریت سوالات متداول وب‌سایت
          </p>
        </div>
        <Link
          to="/faq/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-navy rounded-lg text-sm font-medium hover:bg-gold-hover transition-colors"
        >
          <Plus size={18} />
          <span>افزودن سوال</span>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="جستجو در سوالات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
          />
        </div>
      </div>

      {/* FAQ List */}
      {filteredFAQs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">
            {searchQuery ? "نتیجه‌ای یافت نشد" : "هنوز سوالی اضافه نشده است"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Question Header */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(faq.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        faq.status === "active" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <h3 className="text-sm font-medium text-gray-800 truncate">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 mr-4">
                    ترتیب: {faq.sort_order}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/faq/${faq.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link
                    to={`/faq/${faq.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFaqToDelete(faq);
                      setDeleteModal(true);
                    }}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  {expandedId === faq.id ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Answer (Expandable) */}
              {expandedId === faq.id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setFaqToDelete(null);
        }}
        onConfirm={handleDelete}
        title="حذف سوال"
        message={`آیا از حذف "${faqToDelete?.question}" اطمینان دارید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        type="danger"
      />
    </div>
  );
}
