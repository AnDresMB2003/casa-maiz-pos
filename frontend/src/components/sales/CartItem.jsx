function CartItem({
  item,
  onIncrease,
  onDecrease,
  removeFromCart,
}) {

  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-black/20
        p-4
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <div>

          <h4 className="font-bold">
            {item.name}
          </h4>

          <p className="text-sm text-gray-500">
            $
            {Number(
              item.price
            ).toLocaleString()}
          </p>

        </div>

        <button
          onClick={() =>
            removeFromCart(item.id)
          }
          className="
            text-red-400
            text-sm
          "
        >
          Eliminar
        </button>

      </div>

      <div
        className="
          flex
          items-center
          justify-between
          mt-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <button
            onClick={() =>
              onDecrease(item.id)
            }
            className="
              w-8
              h-8
              rounded-full
              bg-white/10
            "
          >
            -
          </button>

          <span className="font-bold">
            {item.quantity}
          </span>

          <button
            onClick={() =>
              onIncrease(item.id)
            }
            disabled={
              Number(item.quantity) >=
              Number(item.stock)
            }
            className={`
              w-8
              h-8
              rounded-full
              transition
              ${
                Number(item.quantity) >=
                Number(item.stock)
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20"
              }
            `}
          >
            +
          </button>

        </div>

        <p
          className="
            font-black
            text-[#EAB308]
          "
        >
          $
          {(
            item.price *
            item.quantity
          ).toLocaleString()}
        </p>

      </div>

    </div>
  );
}

export default CartItem;