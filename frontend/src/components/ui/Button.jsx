function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {

  const variants = {

    primary: `
      bg-[#EAB308]
      text-black
      hover:opacity-90
    `,

    secondary: `
      bg-white/[0.05]
      border
      border-white/[0.08]
      text-white
      hover:bg-white/[0.08]
    `,

    danger: `
      bg-red-500/10
      border
      border-red-500/20
      text-red-400
      hover:bg-red-500/20
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5
        py-3
        rounded-2xl
        font-semibold
        transition-all
        duration-200
        hover:scale-[1.02]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;