function EmptyState({
  title,
  description,
}) {

  return (
    <div
      className="
        rounded-[28px]
        border
        border-dashed
        border-white/[0.08]
        bg-[#111113]
        py-20
        px-8
        text-center
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          text-white
        "
      >
        {title}
      </h2>

      <p
        className="
          text-gray-500
          mt-3
        "
      >
        {description}
      </p>

    </div>
  );
}

export default EmptyState;