import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Check, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import api from "../../services/api";

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("active");
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("active");
  const [updating, setUpdating] = useState(false);

  // Delete confirmation
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Update confirmation
  const [updateModal, setUpdateModal] = useState(null);

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const data = await api.get("/api/treatments");
      setTreatments(data.treatments || []);
    } catch (error) {
      toast.error("خطا در دریافت لیست درمان‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.warning("نام درمان را وارد کنید");
      return;
    }

    setCreating(true);
    try {
      await api.post("/api/treatments", {
        name: newName.trim(),
        status: newStatus,
      });
      toast.success("درمان با موفقیت ایجاد شد");
      setNewName("");
      setNewStatus("active");
      fetchTreatments();
    } catch (error) {
      toast.error(error.message || "خطا در ایجاد درمان");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (treatment) => {
    setEditingId(treatment.id);
    setEditName(treatment.name);
    setEditStatus(treatment.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditStatus("active");
  };

  const handleUpdate = async () => {
    if (!editName.trim()) {
      toast.warning("نام درمان را وارد کنید");
      return;
    }

    setUpdating(true);
    try {
      await api.put(`/api/treatments/${editingId}`, {
        name: editName.trim(),
        status: editStatus,
      });
      toast.success("درمان با موفقیت بروزرسانی شد");
      cancelEdit();
      fetchTreatments();
    } catch (error) {
      toast.error(error.message || "خطا در بروزرسانی درمان");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/treatments/${deleteModal.id}`);
      toast.success("درمان با موفقیت حذف شد");
      fetchTreatments();
    } catch (error) {
      toast.error(error.message || "خطا در حذف درمان");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (treatment) => {
    const newStatus = treatment.status === "active" ? "inactive" : "active";
    try {
      await api.put(`/api/treatments/${treatment.id}`, { status: newStatus });
      toast.success(
        `وضعیت درمان ${newStatus === "active" ? "فعال" : "غیرفعال"} شد`,
      );
      fetchTreatments();
    } catch (error) {
      toast.error(error.message || "خطا در تغییر وضعیت");
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
    <div>
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
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">درمان‌ها</h1>
        <p className="text-gray-500 text-sm mt-1">
          مدیریت لیست درمان‌های کلینیک
        </p>
      </div>

      {/* Create Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">
          افزودن درمان جدید
        </h2>
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="نام درمان..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
          />
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition bg-white w-full sm:w-32"
          >
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
          <button
            type="submit"
            disabled={creating}
            className="px-5 py-2.5 bg-gold text-navy rounded-lg text-sm font-medium hover:bg-gold-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {creating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            <span>افزودن</span>
          </button>
        </form>
      </div>

      {/* Treatments List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {treatments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">درمانی ثبت نشده است</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="divide-y divide-gray-100 min-w-[640px]">
              {treatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  {editingId === treatment.id ? (
                    // Edit Mode
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gold rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                        autoFocus
                      />
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="px-3 py-2 border border-gold rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none bg-white w-28"
                      >
                        <option value="active">فعال</option>
                        <option value="inactive">غیرفعال</option>
                      </select>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setUpdateModal(treatment)}
                          disabled={updating}
                          className="p-2 rounded-lg bg-gold text-navy hover:bg-gold-hover transition-colors disabled:opacity-50"
                          title="ذخیره"
                        >
                          {updating ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={updating}
                          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          title="انصراف"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center shrink-0">
                        <span className="text-gold font-bold text-sm">
                          {treatment.name.charAt(0)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {treatment.name}
                        </p>
                      </div>

                      {/* Status Toggle */}
                      <button
                        onClick={() => handleToggleStatus(treatment)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          treatment.status === "active"
                            ? "bg-gold"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            treatment.status === "active"
                              ? "-translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>

                      <span
                        className={`text-xs font-medium w-16 text-center ${
                          treatment.status === "active"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {treatment.status === "active" ? "فعال" : "غیرفعال"}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(treatment)}
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="ویرایش"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal(treatment)}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="حذف درمان"
        message={`آیا از حذف "${deleteModal?.name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        confirmText={deleting ? "در حال حذف..." : "حذف"}
        cancelText="انصراف"
        type="danger"
      />

      {/* Update Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!updateModal}
        onClose={() => setUpdateModal(null)}
        onConfirm={handleUpdate}
        title="بروزرسانی درمان"
        message={`آیا از بروزرسانی "${updateModal?.name}" اطمینان دارید؟`}
        confirmText={updating ? "در حال بروزرسانی..." : "بروزرسانی"}
        cancelText="انصراف"
        type="warning"
      />
    </div>
  );
}
