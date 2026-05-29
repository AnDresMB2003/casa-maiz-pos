import {
  ArrowDownCircle,
  ArrowUpCircle,
  ShoppingCart,
} from "lucide-react";

function InventoryMovements({
  movements = [],
}) {

  function getIcon(type) {

    if (type === "entrada") {

      return (
        <ArrowUpCircle
          size={18}
          className="text-green-500"
        />
      );
    }

    if (type === "salida") {

      return (
        <ArrowDownCircle
          size={18}
          className="text-red-500"
        />
      );
    }

    return (
      <ShoppingCart
        size={18}
        className="text-yellow-500"
      />
    );
  }

  return (

    <div
      className="
        bg-white
        rounded-3xl
        border
        p-6
        shadow-sm
      "
    >

      <div className="mb-6">

        <h2
          className="
            text-2xl
            font-black
          "
        >
          Movimientos
        </h2>

        <p className="text-gray-500">
          Historial de inventario
        </p>

      </div>

      <div className="space-y-4">

        {movements.map(
          (movement) => (

            <div
              key={movement.id}
              className="
                flex
                items-center
                justify-between
                border-b
                pb-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                {getIcon(
                  movement.type
                )}

                <div>

                  <h3 className="font-bold">
                    {
                      movement.product_name
                    }
                  </h3>

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    {
                      movement.note
                    }
                  </p>

                </div>

              </div>

              <div className="text-right">

                <h3 className="font-black">
                  {
                    movement.quantity
                  }
                </h3>

                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  {
                    movement.created_at
                  }
                </p>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}

export default InventoryMovements;