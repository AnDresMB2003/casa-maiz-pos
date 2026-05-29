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

  const [invoice, setInvoice] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("Todos");

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

  const categories =
    [
      "Todos",
      ...new Set(
        products.map(
          (p) => p.category
        )
      ),
    ];

  const filteredProducts =
    products.filter((product) => {

      const matchSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchCategory =
        category === "Todos"
          ? true
          : product.category ===
            category;

      return (
        matchSearch &&
        matchCategory
      );
    });

  function addToCart(product) {

    const exists =
      cart.find(
        (item) =>
          item.id === product.id
      );

    if (exists) {

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

  async function completeSale() {

    if (cart.length === 0) {

      toast.error(
        "Carrito vacío"
      );

      return;
    }

    try {

      const response =
        await axios.post(
          "http://localhost:4000/api/sales",
          {
            cart,
            subtotal,
            iva,
            total,
          }
        );

      const invoiceResponse =
        await axios.get(
          `http://localhost:4000/api/sales/${response.data.saleId}`
        );

      setInvoice(
        invoiceResponse.data
      );

      setCart([]);

      loadProducts();

      toast.success(
        "Venta completada"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data
          ?.error ||
          "Error realizando venta"
      );
    }
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
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-5
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

            <div
              className="
                flex
                gap-4
                flex-col
                md:flex-row
              "
            >

              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  text-white
                  outline-none
                "
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  text-white
                  outline-none
                "
              >

                {categories.map(
                  (cat) => (

                    <option
                      key={cat}
                      value={cat}
                      className="bg-black"
                    >
                      {cat}
                    </option>

                  )
                )}

              </select>

            </div>

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

            {filteredProducts.map(
              (product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={
                    addToCart
                  }
                />

              )
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
              "
            >
              Finalizar Venta
            </button>

          </div>

        </div>

      </div>

      <InvoiceModal
        sale={invoice}
        onClose={() =>
          setInvoice(null)
        }
      />

    </MainLayout>
  );
}

export default Sales;