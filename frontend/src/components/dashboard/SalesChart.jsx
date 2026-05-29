/* frontend/src/components/dashboard/SalesChart.jsx */

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function SalesChart({
  sales = [],
}) {

  /* =========================================
     GENERATE REAL CHART DATA
  ========================================= */

  const groupedSales = {};

  sales.forEach((sale) => {

    const rawDate =
      sale.created_at ||
      sale.date;

    if (!rawDate)
      return;

    const date =
      new Date(rawDate);

    const day =
      date.toLocaleDateString(
        "es-CO",
        {
          weekday: "short",
        }
      );

    if (!groupedSales[day]) {

      groupedSales[day] = 0;
    }

    groupedSales[day] +=
      Number(
        sale.total || 0
      );
  });

  const chartData =
    Object.keys(
      groupedSales
    ).map((day) => ({

      name: day,

      ventas:
        groupedSales[day],

    }));

  /* =========================================
     EMPTY STATE
  ========================================= */

  if (
    chartData.length === 0
  ) {

    return (

      <div
        className="
          h-[380px]
          flex
          items-center
          justify-center
          text-gray-500
          text-lg
        "
      >
        No hay ventas registradas
      </div>

    );
  }

  /* =========================================
     CHART
  ========================================= */

  return (

    <div
      className="
        w-full
        h-[380px]
        min-h-[380px]
      "
    >

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart
          data={chartData}
        >

          <defs>

            <linearGradient
              id="sales"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="#EAB308"
                stopOpacity={0.8}
              />

              <stop
                offset="95%"
                stopColor="#EAB308"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
          />

          <XAxis
            dataKey="name"
            stroke="#999"
          />

          <YAxis
            stroke="#999"
            tickFormatter={(
              value
            ) =>
              `$${(
                value / 1000
              ).toFixed(0)}k`
            }
          />

          <Tooltip
            formatter={(
              value
            ) => [

              `$${Number(
                value
              ).toLocaleString(
                "es-CO"
              )}`,

              "Ventas",

            ]}
            contentStyle={{
              background:
                "#111",
              border:
                "1px solid rgba(255,255,255,0.1)",
              borderRadius:
                "16px",
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="ventas"
            stroke="#EAB308"
            fillOpacity={1}
            fill="url(#sales)"
            strokeWidth={4}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}

export default SalesChart;