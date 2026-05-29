import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import MainLayout from "../layouts/MainLayout";

function Customers() {

  const [customers, setCustomers] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  const [invoice, setInvoice] =
    useState(null);

  useEffect(() => {

    async function loadCustomers() {

      try {

        const response =
          await axios.get(
            "http://localhost:4000/api/customers"
          );

        setCustomers(
          response.data || []
        );

      } catch (error) {

        console.log(error);
      }
    }

    loadCustomers();

  }, []);

  async function openCustomer(
    customerId
  ) {

    try {

      const response =
        await axios.get(
          `http://localhost:4000/api/customers/${customerId}`
        );

      setSelected(
        response.data
      );

    } catch (error) {

      console.log(error);
    }
  }

  async function openInvoice(
    saleId
  ) {

    try {

      const response =
        await axios.get(
          `http://localhost:4000/api/sales/${saleId}`
        );

      setInvoice(
        response.data
      );

    } catch (error) {

      console.log(error);
    }
  }

  const totalCustomers =
    customers.length;

  const totalSpent =
    customers.reduce(
      (acc, customer) =>

        acc +
        Number(
          customer.total_spent
        ),

      0
    );

  const topCustomer =
    customers[0];

  return (

    <MainLayout>

      <div className="space-y-8">

        <div>

          <h1
            className="
              text-5xl
              font-black
              text-[#EAB308]
            "
          >
            Clientes
          </h1>

          <p
            className="
              text-gray-400
              mt-3
            "
          >
            Gestión completa
            de clientes y compras
          </p>

        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
          "
        >

          <div
            className="
              rounded-[30px]
              bg-white/[0.03]
              border
              border-white/10
              p-6
            "
          >

            <p className="text-gray-400">
              Clientes
            </p>

            <h2
              className="
                text-4xl
                font-black
                mt-3
              "
            >
              {totalCustomers}
            </h2>

          </div>

          <div
            className="
              rounded-[30px]
              bg-white/[0.03]
              border
              border-white/10
              p-6
            "
          >

            <p className="text-gray-400">
              Total comprado
            </p>

            <h2
              className="
                text-4xl
                font-black
                mt-3
                text-[#EAB308]
              "
            >
              $
              {totalSpent.toLocaleString(
                "es-CO"
              )}
            </h2>

          </div>

          <div
            className="
              rounded-[30px]
              bg-white/[0.03]
              border
              border-white/10
              p-6
            "
          >

            <p className="text-gray-400">
              Mejor cliente
            </p>

            <h2
              className="
                text-2xl
                font-black
                mt-3
              "
            >
              {topCustomer?.name ||
                "Sin datos"}
            </h2>

          </div>

        </div>

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          "
        >

          {customers.map(
            (customer) => (

              <div
                key={customer.id}
                className="
                  rounded-[30px]
                  bg-white/[0.03]
                  border
                  border-white/10
                  p-7
                "
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <h2
                      className="
                        text-2xl
                        font-black
                      "
                    >
                      {customer.name}
                    </h2>

                    <p className="text-gray-400 mt-2">
                      Documento:
                      {" "}
                      {customer.document}
                    </p>

                    <p className="text-gray-400">
                      {customer.phone ||
                        "Sin teléfono"}
                    </p>

                    <p className="text-gray-400">
                      {customer.email ||
                        "Sin correo"}
                    </p>

                  </div>

                  <div
                    className="
                      bg-[#EAB308]/20
                      text-[#EAB308]
                      px-4
                      py-2
                      rounded-full
                      font-bold
                    "
                  >
                    {
                      customer.total_purchases
                    }
                    {" "}
                    compras
                  </div>

                </div>

                <div
                  className="
                    mt-7
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p className="text-gray-400">
                      Total gastado
                    </p>

                    <h3
                      className="
                        text-3xl
                        font-black
                        mt-2
                      "
                    >
                      $
                      {Number(
                        customer.total_spent
                      ).toLocaleString(
                        "es-CO"
                      )}
                    </h3>

                  </div>

                  <button
                    onClick={() =>
                      openCustomer(
                        customer.id
                      )
                    }
                    className="
                      px-5
                      py-3
                      rounded-2xl
                      bg-[#EAB308]
                      text-black
                      font-bold
                    "
                  >
                    Ver historial
                  </button>

                </div>

              </div>

            )
          )}

        </div>

        {selected && (

          <div
            className="
              fixed
              inset-0
              bg-black/70
              backdrop-blur-sm
              flex
              items-center
              justify-center
              z-50
              p-6
            "
          >

            <div
              className="
                w-full
                max-w-3xl
                rounded-[32px]
                bg-[#111]
                border
                border-white/10
                p-8
                max-h-[90vh]
                overflow-y-auto
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >

                <div>

                  <h2
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    {selected.name}
                  </h2>

                  <p className="text-gray-400 mt-3">
                    {selected.document}
                  </p>

                  <p className="text-gray-400">
                    {selected.phone}
                  </p>

                  <p className="text-gray-400">
                    {selected.email}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelected(null)
                  }
                  className="
                    text-gray-400
                    text-2xl
                  "
                >
                  ✕
                </button>

              </div>

              <div className="mt-10">

                <h3
                  className="
                    text-2xl
                    font-black
                    mb-6
                  "
                >
                  Historial de compras
                </h3>

                <div className="space-y-4">

                  {selected.sales?.map(
                    (sale) => (

                      <div
                        key={sale.id}
                        className="
                          rounded-2xl
                          border
                          border-white/10
                          p-5
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <div>

                          <button
                            onClick={() =>
                              openInvoice(
                                sale.id
                              )
                            }
                            className="
                              font-bold
                              text-[#EAB308]
                              hover:underline
                            "
                          >
                            {
                              sale.invoice_number
                            }
                          </button>

                          <p className="text-gray-400 mt-1">
                            {
                              sale.created_at
                            }
                          </p>

                        </div>

                        <div
                          className="
                            text-right
                          "
                        >

                          <h4
                            className="
                              text-2xl
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
                          </h4>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        )}

        {invoice && (

          <div
            className="
              fixed
              inset-0
              bg-black/80
              z-50
              flex
              items-center
              justify-center
              p-6
            "
          >

            <div
              className="
                bg-white
                text-black
                rounded-[32px]
                p-8
                w-full
                max-w-2xl
                max-h-[90vh]
                overflow-y-auto
              "
            >

              <div
                className="
                  flex
                  justify-between
                  items-center
                  mb-8
                "
              >

                <div>

                  <h2
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    {
                      invoice.invoice_number
                    }
                  </h2>

                  <p className="mt-2 text-gray-500">
                    {
                      invoice.created_at
                    }
                  </p>

                </div>

                <button
                  onClick={() =>
                    setInvoice(null)
                  }
                  className="
                    text-2xl
                  "
                >
                  ✕
                </button>

              </div>

              <div className="mb-8">

                <h3
                  className="
                    font-black
                    text-2xl
                    mb-4
                  "
                >
                  Cliente
                </h3>

                <div
                  className="
                    rounded-2xl
                    border
                    p-5
                  "
                >

                  <p>
                    <strong>
                      Nombre:
                    </strong>
                    {" "}
                    {
                      invoice.customer_name
                    }
                  </p>

                  <p className="mt-2">
                    <strong>
                      Documento:
                    </strong>
                    {" "}
                    {
                      invoice.customer_document
                    }
                  </p>

                  <p className="mt-2">
                    <strong>
                      Teléfono:
                    </strong>
                    {" "}
                    {
                      invoice.customer_phone
                    }
                  </p>

                  <p className="mt-2">
                    <strong>
                      Correo:
                    </strong>
                    {" "}
                    {
                      invoice.customer_email
                    }
                  </p>

                </div>

              </div>

              <div>

                <h3
                  className="
                    font-black
                    text-2xl
                    mb-4
                  "
                >
                  Productos
                </h3>

                <div className="space-y-4">

                  {invoice.items?.map(
                    (item) => (

                      <div
                        key={item.id}
                        className="
                          rounded-2xl
                          border
                          p-5
                          flex
                          justify-between
                          items-center
                        "
                      >

                        <div>

                          <h4 className="font-bold">
                            {
                              item.product_name
                            }
                          </h4>

                          <p className="text-gray-500 mt-1">
                            Cantidad:
                            {" "}
                            {
                              item.quantity
                            }
                          </p>

                        </div>

                        <h3
                          className="
                            text-2xl
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
                        </h3>

                      </div>

                    )
                  )}

                </div>

              </div>

              <div
                className="
                  mt-8
                  pt-6
                  border-t
                  flex
                  justify-between
                  items-center
                "
              >

                <h3
                  className="
                    text-3xl
                    font-black
                  "
                >
                  TOTAL
                </h3>

                <h3
                  className="
                    text-4xl
                    font-black
                    text-[#EAB308]
                  "
                >
                  $
                  {Number(
                    invoice.total
                  ).toLocaleString(
                    "es-CO"
                  )}
                </h3>

              </div>

            </div>

          </div>

        )}

      </div>

    </MainLayout>
  );
}

export default Customers;