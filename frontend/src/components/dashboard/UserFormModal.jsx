import { useState } from "react"
import { X, UserPlus, Pencil } from "lucide-react"
import { authFetch } from "@/lib/apiClient"

export default function UserFormModal({ open, user, roles, onClose, onSaved }) {
  const isEdit = Boolean(user)

  const [form, setForm] = useState(() => ({
    username: user?.username || "",
    password: "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    roleId: user?.roleId ? String(user.roleId) : (roles[0]?.id ? String(roles[0].id) : ""),
  }))
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!isEdit && (!form.username.trim() || !form.password.trim())) {
      setError("Kullanıcı adı ve şifre zorunludur.")
      return
    }
    if (!form.roleId) {
      setError("Bir rol seçmelisiniz.")
      return
    }

    setSaving(true)
    try {
      const path = isEdit ? `/api/admin/users/${user.id}` : "/api/admin/users"
      const method = isEdit ? "PUT" : "POST"

      const body = isEdit
        ? {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phoneNumber: form.phoneNumber,
            roleId: Number(form.roleId),
            ...(form.password.trim() ? { password: form.password } : {}),
          }
        : {
            username: form.username,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phoneNumber: form.phoneNumber,
            roleId: Number(form.roleId),
          }

      const res = await authFetch(path, {
        method,
        body: JSON.stringify(body),
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

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0E1B2A] shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D9A441]/10 border border-[#D9A441]/25 flex items-center justify-center">
              {isEdit ? <Pencil className="w-4 h-4 text-[#D9A441]" /> : <UserPlus className="w-4 h-4 text-[#D9A441]" />}
            </div>
            <h3 className="text-[15px] font-semibold text-white">
              {isEdit ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı"}
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
              Kullanıcı Adı {isEdit && <span className="normal-case text-white/25">(değiştirilemez)</span>}
            </label>
            <input
              type="text"
              value={form.username}
              onChange={handleChange("username")}
              disabled={isEdit}
              maxLength={16}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]/50 disabled:opacity-50"
              placeholder="ornek_kullanici"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-white/40 font-medium mb-1">
              {isEdit ? "Yeni Şifre (opsiyonel)" : "Şifre"}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]/50"
              placeholder={isEdit ? "Boş bırakılırsa değişmez" : "En az 6 karakter"}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-white/40 font-medium mb-1">Ad</label>
              <input
                type="text"
                value={form.firstName}
                onChange={handleChange("firstName")}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]/50"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-white/40 font-medium mb-1">Soyad</label>
              <input
                type="text"
                value={form.lastName}
                onChange={handleChange("lastName")}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-white/40 font-medium mb-1">E-posta</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]/50"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-white/40 font-medium mb-1">Telefon</label>
            <input
              type="text"
              value={form.phoneNumber}
              onChange={handleChange("phoneNumber")}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]/50"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-white/40 font-medium mb-1">Rol</label>
            <select
              value={form.roleId}
              onChange={handleChange("roleId")}
              className="w-full rounded-lg border border-white/15 bg-[#0E1B2A] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#D9A441]/50"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
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
