function Card({
  children,
  className = "",
}) {

  return (
    <div
      className={`
        rounded-[28px]
        border
        border-white/[0.06]
        bg-[#111113]
        p-6
        shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;