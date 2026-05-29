import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "Lun",
    ventas: 400,
  },
  {
    name: "Mar",
    ventas: 300,
  },
  {
    name: "Mié",
    ventas: 500,
  },
  {
    name: "Jue",
    ventas: 700,
  },
  {
    name: "Vie",
    ventas: 650,
  },
  {
    name: "Sáb",
    ventas: 900,
  },
  {
    name: "Dom",
    ventas: 750,
  },
];

function SalesChart() {

  return (

    <div
      className="
        w-full
        min-w-0
        h-[380px]
        min-h-[380px]
      "
      style={{
        minWidth: 0,
      }}
    >

      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
      >

        <AreaChart data={data}>

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

          <XAxis
            dataKey="name"
            stroke="#999"
          />

          <Tooltip />

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