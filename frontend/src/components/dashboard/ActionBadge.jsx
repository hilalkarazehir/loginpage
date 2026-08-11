import {
  CheckCircle2,
  XCircle,
  UserX,
  History,
  ShieldAlert,
  UserPlus,
  UserCog,
  UserMinus,
  ShieldPlus,
  ShieldCheck,
  ShieldMinus,
} from "lucide-react"

const STATIC_ACTION_META = {
  LOGIN_SUCCESS: {
    label: "Giriş başarılı",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  },
  LOGIN_FAILED_INVALID_CREDENTIALS: {
    label: "Hatalı kullanıcı adı / şifre",
    icon: XCircle,
    className: "bg-red-500/10 text-red-300 border-red-500/25",
  },
  LOGIN_BLOCKED_TOO_MANY_ATTEMPTS: {
    label: "Çok fazla yanlış giriş yapıldı",
    icon: ShieldAlert,
    className: "bg-red-500/10 text-red-300 border-red-500/25",
  },
  LOGIN_FAILED_INACTIVE_ACCOUNT: {
    label: "Hesap aktif değil",
    icon: UserX,
    className: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  },
}
const PARAMETERIZED_ACTION_META = {
  USER_CREATED: {
    label: "Kullanıcı oluşturuldu",
    icon: UserPlus,
    className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  },
  USER_UPDATED: {
    label: "Kullanıcı güncellendi",
    icon: UserCog,
    className: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  },
  USER_DELETED: {
    label: "Kullanıcı silindi",
    icon: UserMinus,
    className: "bg-red-500/10 text-red-300 border-red-500/25",
  },
  ROLE_CREATED: {
    label: "Rol oluşturuldu",
    icon: ShieldPlus,
    className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  },
  ROLE_UPDATED: {
    label: "Rol güncellendi",
    icon: ShieldCheck,
    className: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  },
  ROLE_DELETED: {
    label: "Rol silindi",
    icon: ShieldMinus,
    className: "bg-red-500/10 text-red-300 border-red-500/25",
  },
}
const DEFAULT_META = {
  icon: History,
  className: "bg-white/5 text-white/60 border-white/10",
}
export default function ActionBadge({ action }) {
  if (!action) {
    return null
  }
  const staticMeta = STATIC_ACTION_META[action]
  if (staticMeta) {
    return <Badge meta={staticMeta} label={staticMeta.label} />
  }
  const separatorIndex = action.indexOf(":")
  if (separatorIndex !== -1) {
    const type = action.slice(0, separatorIndex).trim()
    const detail = action.slice(separatorIndex + 1).trim().replace(/->/g, "→")
    const paramMeta = PARAMETERIZED_ACTION_META[type]

    if (paramMeta) {
      return <Badge meta={paramMeta} label={paramMeta.label} detail={detail} />
    }
  }
  return <Badge meta={DEFAULT_META} label={action} />
}

function Badge({ meta, label, detail }) {
  const Icon = meta.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium ${meta.className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
      {detail && <span className="font-normal opacity-70">· {detail}</span>}
    </span>
  )
}
