import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  Search,
  Trash2,
  Eye,
  Mail,
  MailOpen,
  Clock,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await api.get("/messages");
      setMessages(data.messages || []);
    } catch (err) {
      toast.error("خطا در دریافت پیام‌ها", { position: "top-left" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    try {
      await api.delete(`/messages/${messageToDelete.id}`);
      toast.success("پیام با موفقیت حذف شد", { position: "top-left" });
      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
    } catch (err) {
      toast.error(err.message || "خطا در حذف پیام", { position: "top-left" });
    } finally {
      setDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">پیام‌ها</h1>
          <p className="text-gray-500 text-sm mt-1">
            مدیریت پیام‌های دریافتی
            {unreadCount > 0 && (
              <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                {unreadCount} خوانده نشده
              </span>
            )}
          </p>
        </div>
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
            placeholder="جستجو در پیام‌ها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
          />
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Mail size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {searchQuery ? "نتیجه‌ای یافت نشد" : "هنوز پیامی دریافت نشده است"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl border overflow-hidden transition-colors ${
                msg.is_read
                  ? "border-gray-200"
                  : "border-gold bg-gold-light/10"
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Read/Unread Icon */}
                <div className="flex-shrink-0">
                  {msg.is_read ? (
                    <MailOpen size={20} className="text-gray-400" />
                  ) : (
                    <Mail size={20} className="text-gold" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`text-sm font-medium truncate ${
                        msg.is_read ? "text-gray-700" : "text-gray-900"
                      }`}
                    >
                      {msg.name}
                    </h3>
                    {msg.subject && (
                      <span className="text-xs text-gray-500 truncate">
                        - {msg.subject}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{msg.email}</p>
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {msg.message}
                  </p>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 text-left">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>
                      {new Date(msg.created_at).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/messages/${msg.id}`}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => {
                      setMessageToDelete(msg);
                      setDeleteModal(true);
                    }}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setMessageToDelete(null);
        }}
        onConfirm={handleDelete}
        title="حذف پیام"
        message={`آیا از حذف پیام "${messageToDelete?.name}" اطمینان دارید؟`}
        confirmText="حذف"
        cancelText="انصراف"
        type="danger"
      />
    </div>
  );
}
