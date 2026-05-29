import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
  Package,
  AlertTriangle,
  DollarSign,
  Pencil,
  Trash2,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";

import ProductForm from "../components/inventory/ProductForm";

import EditProductModal from "../components/inventory/EditProductModal";

import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";

function Inventory({
  currentModule,
  setCurrentModule,
}) {

  const [products, setProducts] =
    useState([]);

  const [editing, setEditing] =
    useState(null);

  const [deleting, setDeleting] =
    useState(null);

  useEffect(() => {

    let ignore = false;

    async function fetchProducts() {

      try {

        const response =
          await axios.get(
            "http://localhost:4000/api/products"
          );

        if (!ignore) {

          setProducts(
            response.data || []
          );
        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Error cargando productos"
        );
      }
    }

    fetchProducts();

    return () => {

      ignore = true;
    };

  }, []);

  async function refreshProducts() {

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
    }
  }

  async function handleDelete() {

    if (!deleting)
      return;

    try {

      await axios.delete(
        `http://localhost:4000/api/products/${deleting.id}`
      );

      setProducts(
        (prev) =>
          prev.filter(
            (p) =>
              p.id !== deleting.id
          )
      );

      toast.success(
        "Producto eliminado"
      );

      setDeleting(null);

    } catch (error) {

      console.log(error);

      toast.error(
        "Error eliminando producto"
      );
    }
  }

  const totalProducts =
    products.length;

  const lowStock =
    products.filter(
      (p) =>
        Number(p.stock) <= 5
    ).length;

  const totalValue =
    products.reduce(
      (
        acc,
        product
      ) =>
        acc +
        Number(
          product.price
        ) *
          Number(
            product.stock
          ),
      0
    );

  return (

    <div
      className="
        flex
        min-h-screen
        bg-[#f5f7fb]
      "
    >

      <Sidebar
        currentModule={
          currentModule
        }
        setCurrentModule={
          setCurrentModule
        }
      />

      <div className="flex-1">

        {/* CUSTOM TOPBAR */}

        <div
          className="
            h-[84px]
            bg-white
            border-b
            px-8
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h1
              className="
                text-2xl
                font-black
                text-gray-900
              "
            >
              Inventario
            </h1>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Gestión y control de productos
            </p>

          </div>

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                bg-black
                text-white
                px-4
                py-2
                rounded-2xl
                font-semibold
                text-sm
              "
            >
              CASA MAÍZ ERP
            </div>

          </div>

        </div>

        <div className="p-8">

          {/* TOP GRID */}

          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-3
              gap-6
              mb-8
            "
          >

            {/* FORM */}

            <div
              className="
                xl:col-span-2
                bg-white
                rounded-3xl
                border
                p-7
                shadow-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >

                <div>

                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    Nuevo producto
                  </h2>

                  <p
                    className="
                      text-gray-500
                      mt-1
                    "
                  >
                    Agrega productos al inventario
                  </p>

                </div>

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-black
                    text-white
                    flex
                    items-center
                    justify-center
                    text-2xl
                  "
                >
                  📦
                </div>

              </div>

              <ProductForm
                onCreated={(
                  product
                ) => {

                  setProducts(
                    (prev) => [
                      product,
                      ...prev,
                    ]
                  );

                  toast.success(
                    "Producto creado"
                  );
                }}
              />

            </div>

            {/* STATS */}

            <div
              className="
                flex
                flex-col
                gap-5
              "
            >

              <div
                className="
                  bg-gradient-to-r
                  from-black
                  to-gray-900
                  text-white
                  rounded-3xl
                  p-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p className="text-gray-400">
                      Productos
                    </p>

                    <h2
                      className="
                        text-4xl
                        font-black
                        mt-2
                      "
                    >
                      {totalProducts}
                    </h2>

                  </div>

                  <Package size={30} />

                </div>

              </div>

              <div
                className="
                  bg-white
                  rounded-3xl
                  border
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p className="text-gray-500">
                      Stock bajo
                    </p>

                    <h2
                      className="
                        text-3xl
                        font-black
                        text-red-500
                        mt-2
                      "
                    >
                      {lowStock}
                    </h2>

                  </div>

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-red-100
                      text-red-500
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <AlertTriangle size={20} />

                  </div>

                </div>

              </div>

              <div
                className="
                  bg-white
                  rounded-3xl
                  border
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p className="text-gray-500">
                      Valor inventario
                    </p>

                    <h2
                      className="
                        text-2xl
                        font-black
                        mt-2
                      "
                    >
                      $
                      {totalValue.toLocaleString(
                        "es-CO"
                      )}
                    </h2>

                  </div>

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-green-100
                      text-green-600
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <DollarSign size={20} />

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* PRODUCTS */}

          <div>

            <div className="mb-5">

              <h2
                className="
                  text-2xl
                  font-black
                "
              >
                Productos
              </h2>

              <p className="text-gray-500">
                Todos los productos registrados
              </p>

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

              {products.map(
                (
                  product
                ) => (

                  <div
                    key={
                      product.id
                    }
                    className="
                      bg-white
                      rounded-3xl
                      border
                      overflow-hidden
                      shadow-sm
                      transition
                      hover:-translate-y-1
                    "
                  >

                    {product.image ? (

                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        className="
                          w-full
                          h-52
                          object-cover
                        "
                      />

                    ) : (

                      <div
                        className="
                          w-full
                          h-52
                          bg-gray-100
                          flex
                          items-center
                          justify-center
                          text-6xl
                        "
                      >
                        📦
                      </div>

                    )}

                    <div className="p-5">

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                        "
                      >

                        <div>

                          <h3
                            className="
                              text-xl
                              font-bold
                              text-gray-900
                            "
                          >
                            {product.name}
                          </h3>

                          <p
                            className="
                              text-gray-500
                              text-sm
                              mt-1
                            "
                          >
                            {
                              product.category
                            }
                          </p>

                        </div>

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-bold

                            ${
                              Number(
                                product.stock
                              ) <= 5
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-700"
                            }
                          `}
                        >

                          Stock:
                          {" "}
                          {
                            product.stock
                          }

                        </span>

                      </div>

                      <div
                        className="
                          mt-6
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <div>

                          <p
                            className="
                              text-gray-500
                              text-sm
                            "
                          >
                            Precio
                          </p>

                          <h2
                            className="
                              text-3xl
                              font-black
                            "
                          >
                            $
                            {Number(
                              product.price
                            ).toLocaleString(
                              "es-CO"
                            )}
                          </h2>

                        </div>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <button
                            onClick={() =>
                              setEditing(
                                product
                              )
                            }
                            className="
                              w-11
                              h-11
                              rounded-2xl
                              bg-black
                              text-white
                              flex
                              items-center
                              justify-center
                              hover:opacity-90
                            "
                          >

                            <Pencil size={18} />

                          </button>

                          <button
                            onClick={() =>
                              setDeleting(
                                product
                              )
                            }
                            className="
                              w-11
                              h-11
                              rounded-2xl
                              bg-red-500
                              text-white
                              flex
                              items-center
                              justify-center
                              hover:bg-red-600
                            "
                          >

                            <Trash2 size={18} />

                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

      {/* EDIT MODAL */}

      <EditProductModal
        open={!!editing}
        product={editing}
        onClose={() =>
          setEditing(null)
        }
        onUpdated={async () => {

          await refreshProducts();

          setEditing(null);

        }}
      />

      {/* DELETE MODAL */}

      <DeleteConfirmModal
        open={!!deleting}
        title="Eliminar producto"
        message={`¿Deseas eliminar "${deleting?.name}"?`}
        onCancel={() =>
          setDeleting(null)
        }
        onConfirm={
          handleDelete
        }
      />

    </div>
  );
}

export default Inventory;