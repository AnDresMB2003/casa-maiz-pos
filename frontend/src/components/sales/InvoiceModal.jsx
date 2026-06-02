import {
  useState,
  useRef,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

function InvoiceModal({
  sale,
  onClose,
  onSaleComplete,
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

  const [searching, setSearching] =
    useState(false);

  const [lastSearchedDocument, setLastSearchedDocument] =
    useState("");

  const [lastSearchedEmail, setLastSearchedEmail] =
    useState("");

  const documentDebounceRef =
    useRef(null);

  const emailDebounceRef =
    useRef(null);

  if (!sale)
    return null;

  async function searchCustomerByDocument(
    doc
  ) {

    if (
      !doc ||
      doc.trim().length === 0
    ) {
      return;
    }

    try {

      setSearching(true);

      const response =
        await axios.get(
          `http://localhost:4000/api/customers/search/document/${doc}`
        );

      if (response.data) {

        setCustomerName(
          response.data.name ||
            ""
        );

        setCustomerPhone(
          response.data.phone ||
            ""
        );

        setCustomerEmail(
          response.data.email ||
            ""
        );

        setLastSearchedDocument(
          doc
        );

      }

    } catch {

      // Cliente no encontrado,
      // no mostrar error

    } finally {

      setSearching(false);
    }
  }

  async function searchCustomerByEmail(
    email
  ) {

    if (
      !email ||
      email.trim().length === 0
    ) {
      return;
    }

    try {

      setSearching(true);

      const response =
        await axios.get(
          `http://localhost:4000/api/customers/search/email/${email}`
        );

      if (response.data) {

        setCustomerName(
          response.data.name ||
            ""
        );

        setCustomerPhone(
          response.data.phone ||
            ""
        );

        setCustomerDocument(
          response.data.document ||
            ""
        );

        setLastSearchedEmail(
          email
        );

      }

    } catch {

      // Cliente no encontrado,
      // no mostrar error

    } finally {

      setSearching(false);
    }
  }

  function handleDocumentChange(
    value
  ) {

    setCustomerDocument(value);

    // Si el documento cambió
    // respecto al que se buscó,
    // limpiar los datos
    // auto-cargados
    if (
      value !==
        lastSearchedDocument &&
      lastSearchedDocument !== ""
    ) {

      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setLastSearchedDocument("");
    }

    clearTimeout(
      documentDebounceRef.current
    );

    documentDebounceRef.current =
      setTimeout(() => {

        searchCustomerByDocument(
          value
        );

      }, 2000);
  }

  function handleEmailChange(
    value
  ) {

    setCustomerEmail(value);

    // Si el correo cambió
    // respecto al que se buscó,
    // limpiar los datos
    // auto-cargados
    if (
      value !==
        lastSearchedEmail &&
      lastSearchedEmail !== ""
    ) {

      setCustomerName("");
      setCustomerPhone("");
      setCustomerDocument("");
      setLastSearchedEmail("");
    }

    clearTimeout(
      emailDebounceRef.current
    );

    emailDebounceRef.current =
      setTimeout(() => {

        searchCustomerByEmail(
          value
        );

      }, 2000);
  }

  function determineCustomer() {

    const hasName =
      customerName.trim().length > 0;

    const hasDocument =
      customerDocument.trim()
        .length > 0;

    const hasPhone =
      customerPhone.trim()
        .length > 0;

    const hasEmail =
      customerEmail.trim()
        .length > 0;

    const hasAnyField =
      hasName ||
      hasDocument ||
      hasPhone ||
      hasEmail;

    // Si no hay ningún campo,
    // es consumidor final
    if (!hasAnyField) {

      return {
        name: "CONSUMIDOR FINAL",
        document: "222222222222",
        phone: "No informado",
        email: "No informado",
      };
    }

    // Si hay al menos un campo,
    // NO es consumidor final
    return {
      name:
        hasName ?
          customerName :
          "Cliente registrado",
      document:
        hasDocument ?
          customerDocument :
          "222222222222",
      phone:
        hasPhone ?
          customerPhone :
          "No informado",
      email:
        hasEmail ?
          customerEmail :
          "No informado",
    };
  }

  async function handleGenerateInvoice() {

    if (!sale) {

      toast.error(
        "No hay venta para facturar"
      );

      return;
    }

    try {

      setLoading(true);

      const finalCustomer =
        determineCustomer();

      const response =
        await axios.post(
          "http://localhost:4000/api/sales",
          {
            customer:
              finalCustomer,
            cart: sale.cart,
            subtotal: sale.subtotal,
            iva: sale.iva,
            total: sale.total,
          }
        );

      const invoiceResponse =
        await axios.get(
          `http://localhost:4000/api/sales/${response.data.saleId}`
        );

      const printedSale =
        invoiceResponse.data;

      const printWindow =
        window.open(
          "",
          "_blank",
          "width=900,height=1000"
        );

      if (!printWindow) {

        toast.error(
          "El navegador bloqueó la ventana de impresión"
        );

        onSaleComplete?.();
        onClose();

        return;
      }

      const invoiceDate =
        new Date(
          printedSale.created_at
        ).toLocaleDateString();

      const invoiceTime =
        new Date(
          printedSale.created_at
        ).toLocaleTimeString();

      const html = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="utf-8" />
            <title>Factura CASA MAÍZ</title>
            <style>
              * {
                box-sizing: border-box;
              }

              html,
              body {
                margin: 0;
                padding: 0;
                font-family: Inter, Arial, sans-serif;
                color: #111;
                background: #fff;
              }

              body {
                padding: 20px;
                font-size: 13px;
                line-height: 1.5;
              }

              .invoice-wrapper {
                max-width: 760px;
                width: 100%;
                margin: 0 auto;
              }

              .header {
                display: flex;
                justify-content: space-between;
                gap: 20px;
                align-items: flex-start;
                border-bottom: 1px solid #ddd;
                padding-bottom: 18px;
              }

              .company h1 {
                margin: 0;
                font-size: 32px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
              }

              .company p,
              .invoice-info p,
              .customer-item p {
                margin: 4px 0;
                font-size: 12px;
              }

              .invoice-info {
                text-align: right;
                font-size: 12px;
              }

              .invoice-number {
                margin: 0;
                font-size: 24px;
                font-weight: 900;
              }

              .section {
                margin-top: 28px;
              }

              .section h3 {
                margin: 0 0 14px;
                font-size: 16px;
                letter-spacing: 0.03em;
              }

              .customer-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 10px;
              }

              .customer-item {
                background: #f8f8f8;
                border-radius: 16px;
                padding: 12px 14px;
                font-size: 12px;
              }

              .customer-item strong {
                display: block;
                margin-bottom: 6px;
                font-weight: 700;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                page-break-inside: avoid;
              }

              th,
              td {
                border: 1px solid #ddd;
                padding: 10px 12px;
                font-size: 12px;
              }

              th {
                background: #f4f4f4;
                text-align: left;
                font-weight: 700;
              }

              td.right {
                text-align: right;
              }

              td.center {
                text-align: center;
              }

              tbody tr {
                page-break-inside: avoid;
              }

              .totals {
                width: 100%;
                max-width: 380px;
                margin-left: auto;
                margin-top: 24px;
                border-top: 1px solid #ddd;
                padding-top: 14px;
              }

              .totals-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 13px;
              }

              .grand-total {
                display: flex;
                justify-content: space-between;
                margin-top: 16px;
                padding-top: 16px;
                border-top: 2px solid #111;
                font-size: 18px;
                font-weight: 900;
              }

              .footer {
                margin-top: 34px;
                text-align: center;
                font-size: 12px;
                color: #555;
              }

              @media print {
                body {
                  padding: 10px;
                }

                @page {
                  size: A4 portrait;
                  margin: 10mm;
                }

                .invoice-wrapper {
                  width: 100%;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-wrapper">
              <div class="header">
                <div class="company">
                  <h1>CASA MAÍZ</h1>
                  <p>NIT: 901456789-1</p>
                  <p>Bogotá, Colombia</p>
                  <p>+57 300 000 0000</p>
                </div>
                <div class="invoice-info">
                  <p class="invoice-number">${printedSale.invoice_number}</p>
                  <p>Fecha: ${invoiceDate}</p>
                  <p>Hora: ${invoiceTime}</p>
                </div>
              </div>

              <div class="section">
                <h3>DATOS DEL CLIENTE</h3>
                <div class="customer-grid">
                  <div class="customer-item">
                    <strong>Nombre</strong>
                    <p>${printedSale.customer_name || finalCustomer.name}</p>
                  </div>
                  <div class="customer-item">
                    <strong>Documento</strong>
                    <p>${printedSale.customer_document || finalCustomer.document}</p>
                  </div>
                  <div class="customer-item">
                    <strong>Celular</strong>
                    <p>${printedSale.customer_phone || finalCustomer.phone}</p>
                  </div>
                  <div class="customer-item">
                    <strong>Correo</strong>
                    <p>${printedSale.customer_email || finalCustomer.email}</p>
                  </div>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th class="center">Cant.</th>
                    <th class="right">Unitario</th>
                    <th class="right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    (printedSale.items || sale.cart || [])
                      .map(
                        (item) => `
                          <tr>
                            <td>${item.product_name || item.name}</td>
                            <td class="center">${item.quantity}</td>
                            <td class="right">$${item.price.toLocaleString(
                              "es-CO"
                            )}</td>
                            <td class="right">$${(
                              item.price * item.quantity
                            ).toLocaleString("es-CO")}</td>
                          </tr>
                        `
                      )
                      .join("")
                  }
                </tbody>
              </table>

              <div class="totals">
                <div class="totals-row">
                  <span>SUBTOTAL</span>
                  <span>$${sale.subtotal.toLocaleString("es-CO", {
                    maximumFractionDigits: 0,
                  })}</span>
                </div>
                <div class="totals-row">
                  <span>IVA 19%</span>
                  <span>$${sale.iva.toLocaleString("es-CO", {
                    maximumFractionDigits: 0,
                  })}</span>
                </div>
                <div class="grand-total">
                  <span>TOTAL</span>
                  <span>$${sale.total.toLocaleString("es-CO")}</span>
                </div>
              </div>

              <div class="footer">
                <p>Gracias por comprar en CASA MAÍZ</p>
                <p>Factura POS</p>
              </div>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();

      onSaleComplete?.();
      onClose();

      printWindow.onload = () => {

        printWindow.print();
        printWindow.close();
      };

      toast.success(
        "Factura generada correctamente"
      );

    } catch (_error) {

      console.log(_error);

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

        <div
          className="
            grid
            grid-cols-2
            gap-4
          "
        >

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
              p-3
              rounded-xl
              text-black
              bg-white
            "
          />

          <input
            type="text"
            placeholder="Documento"
            value={customerDocument}
            onChange={(e) =>
              handleDocumentChange(
                e.target.value
              )
            }
            disabled={searching}
            className="
              border
              p-3
              rounded-xl
              text-black
              bg-white
              disabled:bg-gray-100
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
              p-3
              rounded-xl
              text-black
              bg-white
            "
          />

          <input
            type="email"
            placeholder="Correo"
            value={customerEmail}
            onChange={(e) =>
              handleEmailChange(
                e.target.value
              )
            }
            disabled={searching}
            className="
              border
              p-3
              rounded-xl
              text-black
              bg-white
              disabled:bg-gray-100
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
          {
            customerName.trim()
              .length === 0 &&
            customerDocument
              .trim()
              .length === 0 &&
            customerPhone
              .trim()
              .length === 0 &&
            customerEmail
              .trim()
              .length === 0
              ? "Si no agregas datos, se emitirá como CONSUMIDOR FINAL."
              : "Se emitirá a nombre del cliente registrado."
          }
        </p>

        <div
          className="
            flex
            items-center
            justify-between
            mt-8
          "
        >

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border
              border-black/10
              px-5
              py-3
              font-bold
              text-black
              bg-white
              hover:bg-black/5
              transition
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={
              handleGenerateInvoice
            }
            disabled={
              loading || searching
            }
            className="
              bg-black
              text-white
              px-5
              py-3
              rounded-xl
              font-bold
              disabled:opacity-50
            "
          >

            {loading
              ? "Generando..."
              : searching
                ? "Buscando..."
                : "Generar Factura"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default InvoiceModal;