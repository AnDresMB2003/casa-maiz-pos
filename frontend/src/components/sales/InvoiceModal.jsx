import {
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

function InvoiceModal({
  sale,
  onClose,
}) {

  const [customerName, setCustomerName] =
    useState("");

  const [customerDocument, setCustomerDocument] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [customerEmail, setCustomerEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (!sale)
    return null;

  const subtotal =
    sale.total / 1.19;

  const iva =
    sale.total - subtotal;

  async function handleGenerateInvoice() {

    try {

      setLoading(true);

      const hasCustomerData =
        customerName.trim() ||
        customerDocument.trim() ||
        customerPhone.trim() ||
        customerEmail.trim();

      const finalCustomer =
        hasCustomerData
          ? {
              name:
                customerName.trim() ||
                "Cliente",

              document:
                customerDocument.trim() ||
                "",

              phone:
                customerPhone.trim() ||
                "",

              email:
                customerEmail.trim() ||
                "",
            }
          : {
              name:
                "CONSUMIDOR FINAL",

              document:
                "222222222",

              phone:
                "",

              email:
                "",
            };

      const response =
        await axios.post(
          "http://localhost:4000/api/sales",
          {
            customer:
              finalCustomer,

            cart:
              sale.items.map(
                (item) => ({
                  id:
                    item.id ||
                    item.product_id,

                  name:
                    item.name ||
                    item.product_name,

                  quantity:
                    item.quantity,

                  price:
                    item.price,
                })
              ),

            subtotal,

            iva,

            total:
              sale.total,
          }
        );

      const {
        invoiceNumber,
      } = response.data;

      const now =
        new Date();

      const printWindow =
        window.open(
          "",
          "_blank",
          "width=900,height=1000"
        );

      printWindow.document.write(`
        <html>

        <head>

          <title>
            Factura
          </title>

          <style>

            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, sans-serif;
              color: black;
              padding: 20px;
              margin: 0;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid black;
              padding-bottom: 20px;
            }

            .company h1 {
              margin: 0;
              font-size: 42px;
              font-weight: 900;
            }

            .company p {
              margin: 4px 0;
              font-size: 14px;
            }

            .invoice-info {
              text-align: right;
            }

            .invoice-number {
              font-size: 28px;
              font-weight: bold;
              margin: 0;
            }

            .invoice-date {
              margin-top: 10px;
              font-size: 14px;
            }

            .section {
              margin-top: 30px;
            }

            .section h3 {
              margin-bottom: 15px;
              font-size: 18px;
            }

            .customer-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }

            .customer-item {
              font-size: 14px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 25px;
            }

            th {
              background: #f2f2f2;
              font-size: 14px;
            }

            th,
            td {
              border: 1px solid #ddd;
              padding: 12px;
            }

            td {
              font-size: 14px;
            }

            .right {
              text-align: right;
            }

            .center {
              text-align: center;
            }

            .totals {
              width: 320px;
              margin-left: auto;
              margin-top: 25px;
            }

            .totals div {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 15px;
            }

            .grand-total {
              font-size: 30px !important;
              font-weight: 900;
              border-top: 2px solid black;
              margin-top: 10px;
              padding-top: 12px;
            }

            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
            }

            @media print {

              body {
                padding: 10px;
              }

              @page {
                size: auto;
                margin: 8mm;
              }

            }

          </style>

        </head>

        <body>

          <div class="header">

            <div class="company">

              <h1>
                CASA MAÍZ
              </h1>

              <p>
                NIT:
                901456789-1
              </p>

              <p>
                Bogotá, Colombia
              </p>

              <p>
                +57 300 000 0000
              </p>

            </div>

            <div class="invoice-info">

              <p class="invoice-number">
                ${invoiceNumber}
              </p>

              <p class="invoice-date">

                ${now.toLocaleDateString(
                  "es-CO"
                )}

                -

                ${now.toLocaleTimeString(
                  "es-CO"
                )}

              </p>

            </div>

          </div>

          <div class="section">

            <h3>
              DATOS DEL CLIENTE
            </h3>

            <div class="customer-grid">

              <div class="customer-item">

                <strong>
                  Nombre:
                </strong>

                ${finalCustomer.name}

              </div>

              <div class="customer-item">

                <strong>
                  Documento:
                </strong>

                ${finalCustomer.document}

              </div>

              <div class="customer-item">

                <strong>
                  Celular:
                </strong>

                ${finalCustomer.phone || "-"}

              </div>

              <div class="customer-item">

                <strong>
                  Correo:
                </strong>

                ${finalCustomer.email || "-"}

              </div>

            </div>

          </div>

          <table>

            <thead>

              <tr>

                <th>
                  Producto
                </th>

                <th>
                  Cant.
                </th>

                <th>
                  Unitario
                </th>

                <th>
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              ${sale.items.map(
                (item) => `
                  <tr>

                    <td>
                      ${
                        item.name ||
                        item.product_name
                      }
                    </td>

                    <td class="center">
                      ${item.quantity}
                    </td>

                    <td class="right">
                      $${Number(
                        item.price
                      ).toLocaleString(
                        "es-CO"
                      )}
                    </td>

                    <td class="right">
                      $${(
                        item.price *
                        item.quantity
                      ).toLocaleString(
                        "es-CO"
                      )}
                    </td>

                  </tr>
                `
              ).join("")}

            </tbody>

          </table>

          <div class="totals">

            <div>

              <span>
                SUBTOTAL
              </span>

              <span>

                $${subtotal.toLocaleString(
                  "es-CO",
                  {
                    maximumFractionDigits: 0,
                  }
                )}

              </span>

            </div>

            <div>

              <span>
                IVA 19%
              </span>

              <span>

                $${iva.toLocaleString(
                  "es-CO",
                  {
                    maximumFractionDigits: 0,
                  }
                )}

              </span>

            </div>

            <div class="grand-total">

              <span>
                TOTAL
              </span>

              <span>

                $${sale.total.toLocaleString(
                  "es-CO"
                )}

              </span>

            </div>

          </div>

          <div class="footer">

            <p>
              Gracias por comprar
              en CASA MAÍZ
            </p>

            <p>
              Factura POS
            </p>

          </div>

        </body>

        </html>
      `);

      printWindow.document.close();

      setTimeout(() => {

        printWindow.print();

      }, 500);

      toast.success(
        "Factura generada correctamente"
      );

      onClose();

    } catch (error) {

      console.log(error);

      toast.error(
        "Error generando factura"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/60
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-2xl
          rounded-2xl
          p-8
        "
      >

        <h2
          className="
            text-3xl
            font-black
            mb-6
            text-black
          "
        >
          Generar Factura
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Nombre cliente"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="
              border
              border-gray-300
              p-3
              rounded-xl
              text-black
              bg-white
              outline-none
            "
          />

          <input
            type="text"
            placeholder="Documento"
            value={customerDocument}
            onChange={(e) =>
              setCustomerDocument(
                e.target.value
              )
            }
            className="
              border
              border-gray-300
              p-3
              rounded-xl
              text-black
              bg-white
              outline-none
            "
          />

          <input
            type="text"
            placeholder="Celular"
            value={customerPhone}
            onChange={(e) =>
              setCustomerPhone(
                e.target.value
              )
            }
            className="
              border
              border-gray-300
              p-3
              rounded-xl
              text-black
              bg-white
              outline-none
            "
          />

          <input
            type="email"
            placeholder="Correo"
            value={customerEmail}
            onChange={(e) =>
              setCustomerEmail(
                e.target.value
              )
            }
            className="
              border
              border-gray-300
              p-3
              rounded-xl
              text-black
              bg-white
              outline-none
            "
          />

        </div>

        <p
          className="
            text-sm
            text-gray-500
            mt-4
          "
        >
          Si no agregas datos,
          se emitirá como
          CONSUMIDOR FINAL.
        </p>

        <div
          className="
            flex
            justify-end
            mt-8
          "
        >

          <button
            onClick={
              handleGenerateInvoice
            }
            disabled={loading}
            className="
              bg-black
              text-white
              px-5
              py-3
              rounded-xl
              font-bold
            "
          >

            {loading
              ? "Generando..."
              : "Generar Factura"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default InvoiceModal;