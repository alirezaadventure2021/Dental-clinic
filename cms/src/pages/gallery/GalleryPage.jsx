import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ImageIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/gallery");
      setImages(data.images || []);
    } catch (err) {
      toast.error("خطا در دریافت تصاویر", { position: "top-left" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;
    try {
      await api.delete(`/api/gallery/${imageToDelete.id}`);
      toast.success("تصویر با موفقیت حذف شد", { position: "top-left" });
      setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
    } catch (err) {
      toast.error(err.message || "خطا در حذف تصویر", { position: "top-left" });
    } finally {
      setDeleteModal(false);
      setImageToDelete(null);
    }
  };

  const filteredImages = images.filter(
    (img) =>
      (img.description &&
        img.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (img.service &&
        img.service.service_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
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
          <h1 className="text-xl font-bold text-gray-800">گالری تصاویر</h1>
          <p className="text-gray-500 text-sm mt-1">مدیریت تصاویر گالری</p>
        </div>
        <Link
          to="/gallery/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-navy rounded-lg text-sm font-medium hover:bg-gold-hover transition-colors"
        >
          <Plus size={18} />
          <span>افزودن تصویر</span>
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
            placeholder="جستجو در تصاویر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {searchQuery ? "نتیجه‌ای یافت نشد" : "هنوز تصویری اضافه نشده است"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-square">
                <img
                  src={`${import.meta.env.VITE_API_URL}${img.image}`}
                  alt={img.description || "تصویر گالری"}
                  className="w-full h-full object-cover"
                />
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    to={`/gallery/${img.id}`}
                    className="p-2 bg-white/90 text-gray-700 rounded-lg hover:bg-white transition-colors"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    to={`/gallery/${img.id}/edit`}
                    className="p-2 bg-white/90 text-amber-600 rounded-lg hover:bg-white transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => {
                      setImageToDelete(img);
                      setDeleteModal(true);
                    }}
                    className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-white transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-gray-500 truncate">
                  {img.service?.service_name || "بدون خدمت"}
                </p>
                {img.description && (
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {img.description}
                  </p>
                )}
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
          setImageToDelete(null);
        }}
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
