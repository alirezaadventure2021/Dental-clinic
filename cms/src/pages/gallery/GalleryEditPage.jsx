import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2, Upload, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function GalleryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [removeImageFlag, setRemoveImageFlag] = useState(false);
  const [leaveConfirmModal, setLeaveConfirmModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const initialFormRef = useRef(null);
  const [form, setForm] = useState({
    description: "",
    service_id: "",
  });

  useEffect(() => {
    fetchImage();
    fetchServices();
  }, [id]);

  const fetchImage = async () => {
    try {
      const data = await api.get(`/api/gallery/${id}`);
      const { image } = data;
      const initialForm = {
        description: image.description || "",
        service_id: image.service_id || "",
      };
      setForm(initialForm);
      initialFormRef.current = {
        form: initialForm,
        imageFile: null,
        removeImageFlag: false,
      };
      if (image.image) {
        setImagePreview(`${import.meta.env.VITE_API_URL}${image.image}`);
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات تصویر", { position: "top-left" });
      navigate("/gallery");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await api.get("/api/services");
      setServices(data.services || []);
    } catch (err) {
      setError(err.message || "Unable to load services");
    } finally {
      setServicesLoading(false);
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

  const isDirty = useCallback(() => {
    if (!initialFormRef.current) return false;
    const initial = initialFormRef.current;
    return (
      form.description !== initial.form.description ||
      form.service_id !== initial.form.service_id ||
      imageFile !== initial.imageFile ||
      removeImageFlag !== initial.removeImageFlag
    );
  }, [form, imageFile, removeImageFlag]);

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
      if (!imagePreview && !imageFile) {
        setError("تصویر الزامی است");
        setSaving(false);
        return;
      }

      if (!form.service_id) {
        setError("انتخاب خدمت الزامی است");
        setSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append("description", form.description);
      formData.append("service_id", form.service_id);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (removeImageFlag) {
        formData.append("removeImage", "true");
      }

      await api.put(`/api/gallery/${id}`, formData);
      toast.success("تصویر با موفقیت بروزرسانی شد", { position: "top-left" });
      setTimeout(() => navigate(`/gallery/${id}`), 500);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "خطا در بروزرسانی تصویر", {
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
          onClick={() => handleBackNavigation("/gallery")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">ویرایش تصویر</h1>
          <p className="text-gray-500 text-sm mt-1">بروزرسانی اطلاعات تصویر</p>
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              تصویر <span className="text-red-500">*</span>
            </label>

            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="پیش‌نمایش"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-200"
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
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gold hover:bg-gold-light/30 transition-colors">
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

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              خدمت مرتبط <span className="text-red-500">*</span>
            </label>
            {servicesLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 border border-gray-300 rounded-lg">
                <Loader2 size={16} className="animate-spin" />
                در حال بارگذاری...
              </div>
            ) : services.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500 border border-gray-300 rounded-lg">
                خدمتی موجود نیست.
              </p>
            ) : (
              <select
                name="service_id"
                value={form.service_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition bg-white"
              >
                <option value="">انتخاب خدمت</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.service_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              توضیحات
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition resize-none"
              placeholder="توضیحات تصویر..."
            />
          </div>

          {/* Submit Buttons */}
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
                <span>بروزرسانی تصویر</span>
              )}
            </button>
            <Link
              to={`/gallery/${id}`}
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
