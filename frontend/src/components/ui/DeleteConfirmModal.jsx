function DeleteConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}) {

  if (!open)
    return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/40
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          bg-white
          rounded-3xl
          p-7
          w-full
          max-w-md
          shadow-2xl
        "
      >

        <div className="text-center">

          <div
            className="
              text-6xl
              mb-4
            "
          >
            ⚠️
          </div>

          <h2
            className="
              text-2xl
              font-black
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
            {message}
          </p>

        </div>

        <div
          className="
            flex
            gap-3
            mt-7
          "
        >

          <button
            onClick={onCancel}
            className="
              flex-1
              py-3
              rounded-2xl
              bg-gray-100
              font-semibold
            "
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="
              flex-1
              py-3
              rounded-2xl
              bg-red-500
              text-white
              font-bold
            "
          >
            Eliminar
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteConfirmModal;