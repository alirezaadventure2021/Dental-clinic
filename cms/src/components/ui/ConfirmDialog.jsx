import { useState } from 'react'
import { AlertTriangle, X, Loader2 } from 'lucide-react'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'تایید', cancelText = 'انصراف', type = 'danger' }) {
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const confirmButtonClass = type === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-gold hover:bg-gold-hover text-navy'

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch {
      // Let the calling component handle errors via toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={loading ? undefined : onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              type === 'danger' ? 'bg-red-100' : 'bg-amber-100'
            }`}>
              <AlertTriangle size={20} className={type === 'danger' ? 'text-red-600' : 'text-amber-600'} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={loading ? undefined : onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 bg-gray-50 border-t border-gray-100">
          <button
            onClick={loading ? undefined : onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${confirmButtonClass}`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>در حال انجام...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
