import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout";

import ProductCard from "../components/sales/ProductCard";

import CartItem from "../components/sales/CartItem";

import InvoiceModal from "../components/sales/InvoiceModal";

function Sales() {

  const [products, setProducts] =
    useState([]);

  const [cart, setCart] =
    useState([]);

  const [draftSale, setDraftSale] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {

    loadProducts();

  }, []);

  async function loadProducts() {

    try {

      const response =
        await axios.get(
          "http://localhost:4000/api/products"
        );

      setProducts(
        response.data || []
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Error cargando productos"
      );
    }
  }

  function addToCart(product) {

    const exists =
      cart.find(
        (item) =>
          item.id === product.id
      );

    if (exists) {
      if (
        Number(exists.quantity) >=
        Number(product.stock)
      ) {
        toast.error(
          "No hay suficiente stock"
        );

        return;
      }

      setCart(
        cart.map((item) =>

          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );

      return;
    }

    if (Number(product.stock) <= 0) {
      toast.error(
        "Producto agotado"
      );
      return;
    }

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1,
      },
    ]);
  }

  function removeFromCart(id) {

    setCart(
      cart.filter(
        (item) =>
          item.id !== id
      )
    );
  }

  function increaseQuantity(id) {

    setCart(
      cart.map((item) =>

        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(id) {

    setCart(
      cart
        .map((item) =>

          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  const subtotal =
    useMemo(() => {

      return cart.reduce(
        (acc, item) =>

          acc +
          item.price *
            item.quantity,

        0
      );

    }, [cart]);

  const iva =
    subtotal * 0.19;

  const total =
    subtotal + iva;

  const filteredProducts =
    useMemo(() => {
      const term =
        searchTerm
          .trim()
          .toLowerCase();

      if (!term) {
        return products;
      }

      return products.filter(
        (product) => {
          const name =
            product.name
              ?.toLowerCase()
              .includes(term);
          const category =
            product.category
              ?.toLowerCase()
              .includes(term);
          const priceMatch =
            product.price
              .toString()
              .includes(term);

          return (
            name ||
            category ||
            priceMatch
          );
        }
      );
    }, [products, searchTerm]);

  function completeSale() {

    if (cart.length === 0) {

      toast.error(
        "Carrito vacío"
      );

      return;
    }

    setDraftSale({
      cart,
      subtotal,
      iva,
      total,
    });
  }

  return (

    <MainLayout>

      <div
        className="
          grid
          grid-cols-1
          2xl:grid-cols-3
          gap-8
        "
      >

        <div className="2xl:col-span-2">

          <div
            className="
              flex
              flex-col
              gap-4
              md:flex-row
              md:items-center
              md:justify-between
              mb-8
            "
          >

            <div>

              <h1
                className="
                  text-5xl
                  font-black
                  text-[#EAB308]
                "
              >
                Punto de Venta
              </h1>

              <p
                className="
                  text-gray-400
                  mt-3
                "
              >
                Gestión rápida
                de ventas
              </p>

            </div>

          </div>

          <div className="mb-6 max-w-xl">
            <label className="sr-only">
              Buscar producto
            </label>
            <input
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Buscar por nombre, categoría o precio"
              className="
                w-full
                rounded-3xl
                border
                border-white/10
                bg-[#111113]
                px-4
                py-3
                text-white
                outline-none
                placeholder:text-gray-500
              "
            />
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-6
            "
          >

            {filteredProducts.length === 0 ? (
              <div
                className="
                  col-span-full
                  rounded-[32px]
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-8
                  text-center
                "
              >
                <p className="text-gray-400">
                  No se encontraron productos.
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => {
                const cartItem = cart.find(
                  (item) => item.id === product.id
                );

                const maxQuantity =
                  cartItem &&
                  Number(cartItem.quantity) >=
                    Number(product.stock);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    disabled={maxQuantity}
                  />
                );
              })
            )}

          </div>

        </div>

        <div
          className="
            rounded-[36px]
            border
            border-white/10
            bg-white/[0.03]
            p-8
            h-fit
            sticky
            top-6
          "
        >

          <h2
            className="
              text-3xl
              font-black
              mb-8
            "
          >
            Carrito
          </h2>

          <div className="space-y-4">

            {cart.map((item) => (

              <CartItem
                key={item.id}
                item={item}
                removeFromCart={
                  removeFromCart
                }
                onIncrease={() =>
                  increaseQuantity(
                    item.id
                  )
                }
                onDecrease={() =>
                  decreaseQuantity(
                    item.id
                  )
                }
              />

            ))}

          </div>

          <div className="mt-8">

            <h3
              className="
                text-xl
                font-black
                mb-4
              "
            >
              Cliente
            </h3>

            <p className="text-sm text-gray-400">
              Ingresa los datos del cliente
              directamente en el modal de
              factura al finalizar la venta.
            </p>

          </div>

          <div
            className="
              mt-8
              border-t
              border-white/10
              pt-6
              space-y-4
            "
          >

            <div
              className="
                flex
                justify-between
              "
            >

              <p className="text-gray-400">
                Subtotal
              </p>

              <h3 className="font-bold">
                $
                {subtotal.toLocaleString(
                  "es-CO"
                )}
              </h3>

            </div>

            <div
              className="
                flex
                justify-between
              "
            >

              <p className="text-gray-400">
                IVA
              </p>

              <h3 className="font-bold">
                $
                {iva.toLocaleString(
                  "es-CO"
                )}
              </h3>

            </div>

            <div
              className="
                flex
                justify-between
                items-center
                pt-4
                border-t
                border-white/10
              "
            >

              <p className="text-xl">
                Total
              </p>

              <h3
                className="
                  text-4xl
                  font-black
                  text-[#EAB308]
                "
              >
                $
                {total.toLocaleString(
                  "es-CO"
                )}
              </h3>

            </div>

            <button
              onClick={completeSale}
              className="
                w-full
                py-4
                rounded-2xl
                bg-[#EAB308]
                text-black
                font-bold
                text-lg
                hover:scale-[1.02]
                transition
              "
            >
              Finalizar Venta
            </button>

          </div>

        </div>

      </div>

      <InvoiceModal
        key={draftSale ? "open" : "closed"}
        sale={draftSale}
        onClose={() =>
          setDraftSale(null)
        }
        onSaleComplete={() => {
          setCart([]);
          setDraftSale(null);
          loadProducts();
          toast.success("Venta completada");
        }}
      />

    </MainLayout>
  );
}

export default Sales;