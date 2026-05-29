import toast from "react-hot-toast";

function ProductCard({
  product,
  addToCart,
}) {

  function handleAdd() {

    try {

      addToCart(product);

    } catch (error) {

      console.log(error);

      toast.error(
        "Error agregando producto"
      );
    }
  }

  const outOfStock =
    Number(product.stock) <= 0;

  return (

    <div
      className="
        rounded-[32px]
        border
        border-white/10
        bg-white/[0.03]
        overflow-hidden
        transition-all
        hover:scale-[1.01]
        hover:border-[#EAB308]/30
      "
    >

      <div
        className="
          aspect-square
          bg-black/20
          overflow-hidden
        "
      >

        {product.image ? (

          <img
            src={product.image}
            alt={product.name}
            className="
              w-full
              h-full
              object-cover
            "
          />

        ) : (

          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              text-7xl
            "
          >
            📦
          </div>

        )}

      </div>

      <div className="p-5">

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
            mb-4
          "
        >

          <div className="min-w-0">

            <h3
              className="
                text-xl
                font-bold
                truncate
              "
            >
              {product.name}
            </h3>

            <p
              className="
                text-sm
                text-gray-400
                mt-1
              "
            >
              {product.category ||
                "Sin categoría"}
            </p>

          </div>

          <div
            className={`
              min-w-[82px]
              text-center
              px-3
              py-1.5
              rounded-full
              text-xs
              font-bold
              whitespace-nowrap

              ${
                outOfStock
                  ? "bg-red-500/20 text-red-400"
                  : Number(product.stock) <= 5
                  ? "bg-orange-500/20 text-orange-300"
                  : "bg-green-500/20 text-green-300"
              }
            `}
          >

            {outOfStock
              ? "Agotado"
              : `${product.stock} stock`}

          </div>

        </div>

        <div
          className="
            flex
            items-center
            justify-between
            mt-6
          "
        >

          <h2
            className="
              text-3xl
              font-black
              text-[#EAB308]
            "
          >
            $
            {Number(
              product.price
            ).toLocaleString(
              "es-CO"
            )}
          </h2>

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`
              px-5
              py-3
              rounded-2xl
              font-bold
              transition-all

              ${
                outOfStock
                  ? `
                    bg-gray-700
                    text-gray-400
                    cursor-not-allowed
                  `
                  : `
                    bg-[#EAB308]
                    text-black
                    hover:scale-105
                  `
              }
            `}
          >
            Agregar
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;