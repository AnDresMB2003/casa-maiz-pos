function InvoicePreview({ sale }) {
  if (!sale) return null;

  const invoiceDate = new Date(
    sale.created_at
  ).toLocaleDateString("es-CO");

  const invoiceTime = new Date(
    sale.created_at
  ).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const customerName =
    sale.customer_name ||
    "CONSUMIDOR FINAL";
  const customerDocument =
    sale.customer_document ||
    "222222222";
  const customerPhone =
    sale.customer_phone ||
    "No informado";
  const customerEmail =
    sale.customer_email ||
    "No informado";

  const items =
    sale.items || [];

  return (
    <div className="rounded-[32px] border border-black/10 bg-white text-black p-8 shadow-xl shadow-black/5">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b border-black/10 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
            Factura POS
          </p>
          <h1 className="text-4xl font-black mt-3">CASA MAÍZ</h1>
          <p className="text-sm text-gray-500 mt-4">
            NIT: 901456789-1
          </p>
          <p className="text-sm text-gray-500">
            Avenida Principal 123, Bogotá
          </p>
          <p className="text-sm text-gray-500">
            +57 300 000 0000
          </p>
        </div>

        <div className="rounded-3xl bg-[#F8F8F8] p-5 text-right min-w-[220px]">
          <p className="text-xs uppercase text-gray-500 tracking-[0.3em]">
            Número
          </p>
          <p className="text-2xl font-black mt-2">
            {sale.invoice_number}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {invoiceDate}
          </p>
          <p className="text-sm text-gray-500">
            {invoiceTime}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="rounded-3xl bg-[#F8F8F8] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Cliente
          </p>
          <p className="mt-3 font-black text-lg">
            {customerName}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Documento: {customerDocument}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Celular: {customerPhone}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Correo: {customerEmail}
          </p>
        </div>

        <div className="rounded-3xl bg-[#F8F8F8] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Resumen
          </p>
          <div className="mt-3 text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$ {Number(sale.subtotal || 0).toLocaleString("es-CO")}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA 19%</span>
              <span>$ {Number(sale.iva || 0).toLocaleString("es-CO")}</span>
            </div>
            <div className="flex justify-between font-black text-lg mt-3">
              <span>Total</span>
              <span>$ {Number(sale.total || 0).toLocaleString("es-CO")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead>
            <tr>
              <th className="border-b border-black/10 pb-3 text-sm text-gray-500 uppercase tracking-[0.2em]">
                Producto
              </th>
              <th className="border-b border-black/10 pb-3 text-sm text-gray-500 uppercase tracking-[0.2em] text-center">
                Cant.
              </th>
              <th className="border-b border-black/10 pb-3 text-sm text-gray-500 uppercase tracking-[0.2em] text-right">
                Unitario
              </th>
              <th className="border-b border-black/10 pb-3 text-sm text-gray-500 uppercase tracking-[0.2em] text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.map((item) => (
              <tr key={item.id || `${item.product_id}-${item.quantity}`}>
                <td className="py-4 pr-6">
                  <p className="font-semibold">
                    {item.product_name || item.name}
                  </p>
                </td>
                <td className="py-4 text-center text-sm text-gray-600">
                  {item.quantity}
                </td>
                <td className="py-4 text-right text-sm text-gray-600">
                  $ {Number(item.price).toLocaleString("es-CO")}
                </td>
                <td className="py-4 text-right font-semibold">
                  $ {Number(item.price * item.quantity).toLocaleString("es-CO")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        Factura electrónica simplificada para ventas POS.
      </div>
    </div>
  );
}

export default InvoicePreview;
