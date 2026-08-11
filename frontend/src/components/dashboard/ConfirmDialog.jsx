import { AlertTriangle, X } from "lucide-react"

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Sil",
  cancelLabel = "Vazgeç",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0E1B2A] shadow-2xl">
        <div className="flex items-start gap-3 px-5 pt-5">
          <div className="w-9 h-9 shrink-0 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
            <AlertTriangle className="w-4.5 h-4.5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-white">{title}</h3>
            <p className="mt-1 text-[13px] text-white/60 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 mt-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-[12.5px] font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-500/90 px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {loading ? "İşleniyor..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
