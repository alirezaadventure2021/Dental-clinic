import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import { UPLOAD_URL } from "../../config";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function ServiceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [removeImageFlag, setRemoveImageFlag] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [treatmentsLoading, setTreatmentsLoading] = useState(true);
  const [form, setForm] = useState({
    service_name: "",
    treatmentIds: [],
    status: "active",
    description: "",
  });

  useEffect(() => {
    fetchService();
    fetchTreatments();
  }, [id]);

  const fetchService = async () => {
    try {
      const data = await api.get(`/services/${id}`);
      const { service } = data;
      const treatmentIds = service.treatments?.map((t) => t.id) || [];
      setForm({
        service_name: service.service_name,
        treatmentIds,
        status: service.status,
        description: service.description || "",
      });
      if (service.image) {
        setImagePreview(`${UPLOAD_URL}${service.image}`);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات خدمت", { position: "top-left" });
      navigate("/services");
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatments = async () => {
    try {
      const data = await api.get("/treatments");
      setTreatments(data.treatments || []);
    } catch (err) {
      setError(err.message || "Unable to load treatments");
    } finally {
      setTreatmentsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("فقط فایل‌های تصویری مجاز هستند (JPEG, PNG, GIF, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("حجم فایل نباید بیشتر از 5 مگابایت باشد");
      return;
    }

    setError("");
    setImageFile(file);
    setRemoveImageFlag(false);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImageFlag(true);
  };

  const toggleTreatment = (treatmentId) => {
    setForm((prev) => ({
      ...prev,
      treatmentIds: prev.treatmentIds.includes(treatmentId)
        ? prev.treatmentIds.filter((tId) => tId !== treatmentId)
        : [...prev.treatmentIds, treatmentId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("service_name", form.service_name);
      formData.append("treatmentIds", JSON.stringify(form.treatmentIds));
      formData.append("status", form.status);
      formData.append("description", form.description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (removeImageFlag) {
        formData.append("removeImage", "true");
      }

      await api.put(`/services/${id}`, formData);
      toast.success("خدمت با موفقیت بروزرسانی شد", { position: "top-left" });
      navigate(`/services/${id}`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "خطا در بروزرسانی خدمت", {
        position: "top-left",
      });
      throw err;
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to={`/services`}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">ویرایش خدمت</h1>
          <p className="text-gray-500 text-sm mt-1">بروزرسانی اطلاعات خدمت</p>
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
              نام خدمت <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="service_name"
              value={form.service_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
              placeholder="مثلا: ایمپلنت دندانی"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              تصویر خدمت
            </label>

            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="پیش‌نمایش"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gold hover:bg-gold-light/30 transition-colors">
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  کلیک کنید یا تصویر را بکشید
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  JPEG, PNG, GIF, WebP - حداکثر 5 مگابایت
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              درمان‌های مرتبط
            </label>
            {treatmentsLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 border border-gray-300 rounded-lg">
                <Loader2 size={16} className="animate-spin" />
                در حال بارگذاری...
              </div>
            ) : treatments.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500 border border-gray-300 rounded-lg">
                درمانی موجود نیست.
              </p>
            ) : (
              <div className="max-h-52 overflow-y-auto rounded-lg border border-gray-300 divide-y divide-gray-100">
                {treatments.map((treatment) => (
                  <label
                    key={treatment.id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={form.treatmentIds.includes(treatment.id)}
                      onChange={() => toggleTreatment(treatment.id)}
                      className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
                    />
                    <span className="text-sm text-gray-700">
                      {treatment.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              توضیحات <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition resize-none"
              placeholder="توضیحات خدمت..."
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gold text-navy rounded-lg text-sm font-medium hover:bg-gold-hover focus:ring-2 focus:ring-gold focus:ring-offset-2 transition flex items-center gap-2"
            >
              <span>بروزرسانی خدمت</span>
            </button>
            <Link
              to={`/services/${id}`}
              className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
            >
              انصراف
            </Link>
          </div>
        </form>
      </div>

      {/* Update Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={handleConfirmUpdate}
        title="بروزرسانی خدمت"
        message={`آیا از بروزرسانی "${form.service_name}" اطمینان دارید؟`}
        confirmText="بروزرسانی"
        cancelText="انصراف"
        type="info"
      />
    </div>
  );
}
