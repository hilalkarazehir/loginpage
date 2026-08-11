function CornerBrackets() {
  const base = "pointer-events-none absolute w-3.5 h-3.5 border-[#D9A441]/70"
  return (
    <>
      <span className={`${base} top-1.5 left-1.5 border-t-2 border-l-2`} />
      <span className={`${base} top-1.5 right-1.5 border-t-2 border-r-2`} />
      <span className={`${base} bottom-1.5 left-1.5 border-b-2 border-l-2`} />
      <span className={`${base} bottom-1.5 right-1.5 border-b-2 border-r-2`} />
    </>
  )
}

export default CornerBrackets