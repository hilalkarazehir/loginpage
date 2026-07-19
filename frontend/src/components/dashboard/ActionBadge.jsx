import { CheckCircle2, XCircle, UserX, History ,ShieldAlert} from "lucide-react"

const ACTION_META = {
  LOGIN_SUCCESS: {
    label: "Giriş başarılı",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  LOGIN_FAILED_INVALID_CREDENTIALS: {
    label: "Hatalı kullanıcı adı / şifre",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
LOGIN_BLOCKED_TOO_MANY_ATTEMPTS: {
    label: "Çok fazla yanlış giriş yapıldı",
    icon: ShieldAlert,
    className: "bg-red-50 text-red-700 border-red-200",
},
  LOGIN_FAILED_INACTIVE_ACCOUNT: {
    label: "Hesap aktif değil",
    icon: UserX,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
}

export default function ActionBadge({ action }) {
  const meta = ACTION_META[action] || {
    label: action,
    icon: History,
    className: "bg-[#F3F5F8] text-[#4B5563] border-[#E5EAF0]",
  }
  const Icon = meta.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium ${meta.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {meta.label}
    </span>
  )
}