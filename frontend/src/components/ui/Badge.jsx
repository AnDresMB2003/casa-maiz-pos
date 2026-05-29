function Badge({
  children,
  variant = "default",
}) {

  const variants = {

    default: `
      bg-white/[0.06]
      text-white
    `,

    success: `
      bg-green-500/10
      text-green-400
    `,

    warning: `
      bg-yellow-500/10
      text-yellow-400
    `,

    danger: `
      bg-red-500/10
      text-red-400
    `,

    blue: `
      bg-blue-500/10
      text-blue-400
    `,
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;