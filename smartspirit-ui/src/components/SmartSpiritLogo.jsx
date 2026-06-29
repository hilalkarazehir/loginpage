import { useState } from "react"

function SmartSpiritLogo() {
  const [imgFailed, setImgFailed] = useState(false)

  if (!imgFailed) {
    return (
      <img
        src="/logo.png"
        alt="Smart Spirit Intelligence"
        className="login-logo-img"
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <>
      <div className="login-logo-icon">◈</div>
      <div className="login-title">SMART SPIRIT AI</div>
    </>
  )
}

export default SmartSpiritLogo