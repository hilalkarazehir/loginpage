import { LogOut, UserCircle2 } from "lucide-react"

export default function DashboardHeader({ username, status, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#1E3A5F]/85 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-sans text-[15px] font-semibold tracking-[0.08em] text-white uppercase">
            Smart Spirit AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          {status === "ready" && (
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 pl-2 pr-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                <UserCircle2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] font-medium text-white">{username}</span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-[13.5px] font-medium text-white transition-all hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            Çıkış yap
          </button>
        </div>
      </div>
    </header>
  )
}