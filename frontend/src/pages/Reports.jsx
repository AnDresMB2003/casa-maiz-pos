import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import MainLayout from "../layouts/MainLayout";

function Reports() {

  const [sales, setSales] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  useEffect(() => {

    async function loadSales() {

      try {

        const response =
          await axios.get(
            "http://localhost:4000/api/sales"
          );

        setSales(
          response.data || []
        );

      } catch (error) {

        console.log(error);
      }
    }

    loadSales();

  }, []);

  async function openSale(
    saleId
  ) {

    try {

      const response =
        await axios.get(
          `http://localhost:4000/api/sales/${saleId}`
        );

      setSelected(
        response.data
      );

    } catch (error) {

      console.log(error);
    }
  }

  const totalSales =
    sales.reduce(
      (acc, sale) =>

        acc +
        Number(sale.total),

      0
    );

  return (

    <MainLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-5xl font-black text-[#EAB308]">
            Reportes
          </h1>

          <p className="text-gray-400 text-xl mt-4">
            Estadísticas y análisis del negocio.
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div
            className="
              rounded-[30px]
              bg-white/[0.03]
              border
              border-white/[0.06]
              p-7
            "
          >

            <h3 className="text-gray-400 text-lg">
              Total ventas
            </h3>

            <h2 className="text-5xl font-black mt-4 text-[#EAB308]">
              $
              {totalSales.toLocaleString(
                "es-CO"
              )}
            </h2>

          </div>

          <div
            className="
              rounded-[30px]
              bg-white/[0.03]
              border
              border-white/[0.06]
              p-7
            "
          >

            <h3 className="text-gray-400 text-lg">
              Facturas generadas
            </h3>

            <h2 className="text-5xl font-black mt-4">
              {sales.length}
            </h2>

          </div>

          <div
            className="
              rounded-[30px]
              bg-white/[0.03]
              border
              border-white/[0.06]
              p-7
            "
          >

            <h3 className="text-gray-400 text-lg">
              Ticket promedio
            </h3>

            <h2 className="text-5xl font-black mt-4">
              $
              {sales.length > 0

                ? Math.round(
                    totalSales /
                    sales.length
                  ).toLocaleString(
                    "es-CO"
                  )

                : 0}
            </h2>

          </div>

        </div>

        <div
          className="
            rounded-[30px]
            bg-white/[0.03]
            border
            border-white/[0.06]
            p-7
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-8
            "
          >

            <div>

              <h2
                className="
                  text-3xl
                  font-black
                "
              >
                Historial de ventas
              </h2>

              <p className="text-gray-400 mt-2">
                Todas las facturas generadas
              </p>

            </div>

          </div>

          <div className="space-y-5">

            {sales.map(
              (sale) => (

                <div
                  key={sale.id}
                  className="
                    rounded-3xl
                    border
                    border-white/[0.06]
                    bg-black/20
                    p-6
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-6
                  "
                >

                  <div>

                    <h3
                      className="
                        text-2xl
                        font-black
                      "
                    >
                      {
                        sale.invoice_number
                      }
                    </h3>

                    <p className="text-gray-400 mt-2">
                      Cliente:
                      {" "}
                      {
                        sale.customer_name ||
                        "Consumidor final"
                      }
                    </p>

                    <p className="text-gray-500">
                      {
                        sale.created_at
                      }
                    </p>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-8
                    "
                  >

                    <div>

                      <p className="text-gray-400">
                        Total
                      </p>

                      <h2
                        className="
                          text-3xl
                          font-black
                          text-[#EAB308]
                        "
                      >
                        $
                        {Number(
                          sale.total
                        ).toLocaleString(
                          "es-CO"
                        )}
                      </h2>

                    </div>

                    <button
                      onClick={() =>
                        openSale(
                          sale.id
                        )
                      }
                      className="
                        px-5
                        py-3
                        rounded-2xl
                        bg-[#EAB308]
                        text-black
                        font-bold
                        hover:scale-105
                        transition
                      "
                    >
                      Ver factura
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {selected && (

          <div
            className="
              fixed
              inset-0
              bg-black/70
              backdrop-blur-sm
              z-50
              flex
              items-center
              justify-center
              p-6
            "
          >

            <div
              className="
                w-full
                max-w-2xl
                rounded-[32px]
                bg-white
                text-black
                p-8
                overflow-y-auto
                max-h-[90vh]
              "
            >

              <div
                className="
                  flex
                  justify-between
                  items-start
                "
              >

                <div>

                  <h2
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    FACTURA
                  </h2>

                  <p className="mt-2">
                    {
                      selected.invoice_number
                    }
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelected(null)
                  }
                  className="
                    text-2xl
                  "
                >
                  ✕
                </button>

              </div>

              <div className="mt-8 space-y-2">

                <p>
                  Cliente:
                  {" "}
                  {
                    selected.customer_name
                  }
                </p>

                <p>
                  Documento:
                  {" "}
                  {
                    selected.customer_document
                  }
                </p>

                <p>
                  Teléfono:
                  {" "}
                  {
                    selected.customer_phone
                  }
                </p>

              </div>

              <div className="mt-10">

                <h3
                  className="
                    text-2xl
                    font-black
                    mb-5
                  "
                >
                  Productos
                </h3>

                <div className="space-y-4">

                  {selected.items?.map(
                    (item) => (

                      <div
                        key={item.id}
                        className="
                          border
                          rounded-2xl
                          p-4
                          flex
                          justify-between
                        "
                      >

                        <div>

                          <h4
                            className="
                              font-bold
                            "
                          >
                            {
                              item.product_name
                            }
                          </h4>

                          <p>
                            Cantidad:
                            {" "}
                            {
                              item.quantity
                            }
                          </p>

                        </div>

                        <h4
                          className="
                            font-black
                          "
                        >
                          $
                          {Number(
                            item.price *
                            item.quantity
                          ).toLocaleString(
                            "es-CO"
                          )}
                        </h4>

                      </div>

                    )
                  )}

                </div>

              </div>

              <div className="mt-10 space-y-3">

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <p>Subtotal</p>

                  <p>
                    $
                    {Number(
                      selected.subtotal
                    ).toLocaleString(
                      "es-CO"
                    )}
                  </p>

                </div>

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <p>IVA</p>

                  <p>
                    $
                    {Number(
                      selected.iva
                    ).toLocaleString(
                      "es-CO"
                    )}
                  </p>

                </div>

                <div
                  className="
                    flex
                    justify-between
                    text-3xl
                    font-black
                    pt-4
                    border-t
                  "
                >

                  <p>Total</p>

                  <p>
                    $
                    {Number(
                      selected.total
                    ).toLocaleString(
                      "es-CO"
                    )}
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </MainLayout>
  );
}

export default Reports;