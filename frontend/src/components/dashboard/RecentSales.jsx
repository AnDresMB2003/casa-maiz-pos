function RecentSales({ sales }) {

  return (
    <div
      className="
        rounded-[36px]
        border
        border-white/[0.06]
        bg-gradient-to-br
        from-white/[0.04]
        to-white/[0.02]
        p-8
        backdrop-blur-xl
      "
    >

      <h2
        className="
          text-4xl
          font-bold
          mb-8
        "
      >
        Últimas Ventas
      </h2>

      <div className="space-y-5">

        {sales.map((sale) => (

          <div
            key={sale.id}
            className="
              flex
              items-center
              justify-between
              rounded-3xl
              bg-white/[0.03]
              border
              border-white/[0.05]
              px-5
              py-5
            "
          >

            <div>

              <h3 className="text-lg font-semibold">
                Venta #{sale.id}
              </h3>

              <p className="text-gray-500 mt-1">
                {sale.created_at}
              </p>

            </div>

            <div className="text-right">

              <h4
                className="
                  text-3xl
                  font-bold
                  text-[#EAB308]
                "
              >
                $
                {Number(
                  sale.total
                ).toLocaleString()}
              </h4>

              <p className="text-gray-500 text-sm">
                total
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentSales;