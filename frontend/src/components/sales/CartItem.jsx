import { Minus, Plus } from "lucide-react";

function CartItem({
  item,
  onIncrease,
  onDecrease,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-3xl
        bg-white/[0.03]
        border
        border-white/[0.05]
        p-4
      "
    >
      <div>
        <h3 className="font-bold text-lg">
          {item.name}
        </h3>

        <p className="text-gray-500 mt-1">
          ${item.price.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={() => onDecrease(item.id)}
          className="
            w-10
            h-10
            rounded-xl
            bg-white/[0.04]
            flex
            items-center
            justify-center
          "
        >
          <Minus size={18} />
        </button>

        <span className="text-xl font-bold w-8 text-center">
          {item.quantity}
        </span>

        <button
          onClick={() => onIncrease(item.id)}
          className="
            w-10
            h-10
            rounded-xl
            bg-[#EAB308]
            text-black
            flex
            items-center
            justify-center
          "
        >
          <Plus size={18} />
        </button>

      </div>
    </div>
  );
}

export default CartItem;