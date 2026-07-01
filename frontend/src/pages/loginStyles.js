export const s = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at 30% 20%, #2d0a5e 0%, #0d0620 40%, #000008 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden",
  },
  glow1: {
    position: "fixed", left: -80, top: "20%", width: 320, height: 320,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(120,40,200,0.3) 0%, transparent 70%)",
    filter: "blur(70px)", pointerEvents: "none",
  },
  glow2: {
    position: "fixed", right: -60, bottom: "10%", width: 260, height: 260,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(200,40,120,0.2) 0%, transparent 70%)",
    filter: "blur(70px)", pointerEvents: "none",
  },
  glow3: {
    position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
    filter: "blur(80px)", pointerEvents: "none",
  },
  card: {
    display: "flex", width: 780, minHeight: 500,
    borderRadius: 24, overflow: "hidden",
    border: "1px solid rgba(139,92,246,0.25)",
    boxShadow: "0 0 0 1px rgba(139,92,246,0.06), 0 24px 80px rgba(0,0,0,0.7)",
    position: "relative", zIndex: 1,
  },

  /* ---- SOL ---- */
  left: {
    width: "42%", padding: "2.2rem 1.8rem",
    borderRight: "1px solid rgba(139,92,246,0.12)",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    background: "linear-gradient(160deg, rgba(60,20,120,0.6) 0%, rgba(20,5,50,0.85) 60%, rgba(10,2,30,0.95) 100%)",
    position: "relative", overflow: "hidden",
  },
  leftTop: { display: "flex", flexDirection: "column", gap: 16 },
  brandRow: { display: "flex", alignItems: "center",justifyContent: "center",width:280, height: 120, objectFit: "contain"},
  tagline: {
    fontSize: 15, color: "rgba(196,132,252,0.6)", lineHeight: 1.6,
    fontWeight: 400, letterSpacing: "0.02em",marginTop: 50,
    marginBottom: 50,
  },

  /* Planet */
planetWrap: {
  position: "absolute",
  bottom: 125,
  left: "50%",
  transform: "translateX(-50%)",
  width: 260,
  height: 240,
  overflow: "visible",
},


  leftBottom: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 12, paddingBottom: 4, position: "relative", zIndex: 2,
  },
  systemBadge: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 18px", borderRadius: 20,
    background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)",
  },
  systemDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 8px #22c55e",
    animation: "pulse 2s ease-in-out infinite",
  },
  systemText: {
    fontSize: 11, color: "rgba(196,132,252,0.8)", letterSpacing: "0.18em",
    textTransform: "uppercase", fontWeight: 500,
  },
  leftFooter: {
    fontSize: 12, color: "rgba(196,132,252,0.2)",
    letterSpacing: "0.1em", textTransform: "uppercase",paddingBottom: 20,
  },

  /* ---- SAĞ ---- */
  right: {
    flex: 1, padding: "2.4rem 2rem",
    display: "flex", flexDirection: "column", justifyContent: "center",
    background: "linear-gradient(150deg, rgba(45,15,90,0.55) 0%, rgba(20,6,50,0.75) 50%, rgba(10,2,30,0.9) 100%)",
  },
  eyebrow: {
    fontSize: 15, letterSpacing: "0.22em", textTransform: "uppercase",
    color: "rgba(168,85,247,0.75)", marginBottom: 40, fontWeight: 500,
    textAlign: "center"
  },
  rtitle:  { fontSize: 15, fontWeight: 600, color: "#f3e8ff", marginBottom:20, letterSpacing: "-0.01em",textAlign:"center" },

  rsub:    { fontSize: 14, color: "rgba(196,132,252,0.4)", marginBottom: 28 },
  flabel:  {
    fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
    color: "rgba(196,132,252,0.65)", marginBottom: 8, display: "block", fontWeight: 600,
  },
  iw:      { position: "relative", marginBottom: 6 },
  iconSpan:{
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
    display: "flex", alignItems: "center", pointerEvents: "none",
  },
  checkIcon: {
    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
    display: "flex", alignItems: "center",
  },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", padding: 4,
  },
  finput:  {
    width: "100%", padding: "13px 42px 13px 42px",
    background: "rgba(10,5,25,0.6)",
    border: "1px solid rgba(139,92,246,0.22)",
    borderRadius: 12, fontSize: 13, color: "#f3e8ff", outline: "none",
    fontFamily: "Inter, sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputError: { borderColor: "rgba(248,113,113,0.6)" },
  errorText:  { display: "block", color: "#f87171", fontSize: 11, marginBottom: 10, paddingLeft: 2 },

  /* Beni hatırla satırı */
  rememberRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginTop: 4, marginBottom: 4,
  },
  rememberLabel: {
    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
  },
  checkbox: {
    width: 18, height: 18, borderRadius: 5,
    border: "1.5px solid rgba(139,92,246,0.4)",
    background: "rgba(139,92,246,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s", flexShrink: 0,
  },
  checkboxChecked: {
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    border: "1.5px solid #a855f7",
  },
  rememberText: { fontSize: 12, color: "rgba(196,132,252,0.55)" },
  forgotBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "rgba(168,85,247,0.75)", fontSize: 12,
    fontFamily: "Inter, sans-serif", padding: 0,
  },

  apiError: {
    background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: 10, padding: "10px 14px", color: "#fca5a5", fontSize: 12,
    textAlign: "center", marginBottom: 14, marginTop: 8,
  },
  btn: {
    width: "100%", padding: 14, border: "none", borderRadius: 12, marginTop: 16,
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
    color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "3px",
    textTransform: "uppercase", cursor: "pointer",
    boxShadow: "0 4px 24px rgba(139,92,246,0.45)",
    fontFamily: "Inter, sans-serif",
  },
  footer: {
    display: "flex", alignItems: "center", justifyContent: "center",
    marginTop: 24, color: "rgba(196,132,252,0.25)",
    fontSize: 13, letterSpacing: "1.5px", textTransform: "uppercase",
  },
}

