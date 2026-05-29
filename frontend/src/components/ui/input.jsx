function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {

  return (
    <div className="space-y-2">

      {label && (

        <label
          className="
            text-sm
            text-gray-400
          "
        >
          {label}
        </label>

      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-2xl
          border
          border-white/[0.08]
          bg-[#111113]
          px-5
          py-4
          text-white
          outline-none
          transition-all
          focus:border-[#EAB308]
        "
      />

    </div>
  );
}

export default Input;