import { useState } from "react"
import { X, ShieldPlus, Pencil } from "lucide-react"
import { authFetch } from "@/lib/apiClient"

export default function RoleFormModal({ open, role, onClose, onSaved }) {
  const isEdit = Boolean(role)

  const [name, setName] = useState(role?.name || "")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Rol adı boş olamaz.")
      return
    }

    setSaving(true)
    try {
      const path = isEdit ? `/api/roles/${role.id}` : "/api/roles"
      const method = isEdit ? "PUT" : "POST"

      const res = await authFetch(path, {
        method,
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.message || "İşlem başarısız oldu.")
        setSaving(false)
        return
      }

      onSaved()
    } catch {
      setError("Sunucuya ulaşılamadı.")
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0E1B2A] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D9A441]/10 border border-[#D9A441]/25 flex items-center justify-center">
              {isEdit ? <Pencil className="w-4 h-4 text-[#D9A441]" /> : <ShieldPlus className="w-4 h-4 text-[#D9A441]" />}
            </div>
            <h3 className="text-[15px] font-semibold text-white">
              {isEdit ? "Rolü Düzenle" : "Yeni Rol"}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/25 px-3 py-2 text-[12.5px] text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-white/40 font-medium mb-1">
              Rol Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              autoFocus
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]/50"
              placeholder="ör. MODERATOR"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-[12.5px] font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gradient-to-r from-[#F4D27A] to-[#D9A441] px-3.5 py-2 text-[12.5px] font-semibold text-slate-950 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : isEdit ? "Kaydet" : "Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
