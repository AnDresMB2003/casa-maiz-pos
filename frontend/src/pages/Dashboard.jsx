import {
  useMemo,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import StatsCard from "../components/dashboard/StatsCard";

import SalesChart from "../components/dashboard/SalesChart";

import RecentSales from "../components/dashboard/RecentSales";

import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
} from "lucide-react";

import api from "../services/api";

import toast from "react-hot-toast";

function Dashboard() {

  const [stats, setStats] =
    useState(null);

  // LOAD STATS
  async function loadStats() {

    try {

      const response =
        await api.get("/dashboard");

      setStats(response.data);

    } catch {

      toast.error(
        "Error cargando dashboard"
      );
    }
  }

  // AUTO LOAD
  if (!stats) {
    loadStats();
  }

  // CARDS
  const cards = useMemo(() => {

    if (!stats) return [];

    return [

      {
        title: "Ingresos",
        value: `$${Number(
          stats.totalRevenue
        ).toLocaleString()}`,
        icon: (
          <DollarSign size={36} />
        ),
        color: "#EAB308",
        percentage: "12.5%",
      },

      {
        title: "Ventas",
        value: stats.totalSales,
        icon: (
          <ShoppingCart size={36} />
        ),
        color: "#22C55E",
        percentage: "8.2%",
      },

      {
        title: "Productos",
        value: stats.totalProducts,
        icon: (
          <Package size={36} />
        ),
        color: "#3B82F6",
        percentage: "3.1%",
      },

      {
        title: "Stock Bajo",
        value: stats.lowStock,
        icon: (
          <AlertTriangle size={36} />
        ),
        color: "#EF4444",
        percentage: "2.4%",
      },

    ];

  }, [stats]);

  if (!stats) {

    return (
      <MainLayout>

        <div className="text-2xl">
          Cargando dashboard...
        </div>

      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="space-y-10">

        {/* HERO */}
        <div>

          <h1
            className="
              text-6xl
              font-black
              tracking-tight
              text-[#EAB308]
            "
          >
            Bienvenido a CASA MAÍZ 🌽
          </h1>

          <p className="text-gray-400 text-xl mt-4">
            Sistema administrativo premium para ventas,
            inventario y gestión empresarial.
          </p>

        </div>

        {/* STATS */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            2xl:grid-cols-4
            gap-7
          "
        >

          {cards.map(
            (card, index) => (

              <StatsCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                delay={
                  0.1 * (index + 1)
                }
                percentage={
                  card.percentage
                }
              />

            )
          )}

        </div>

        {/* CONTENT */}
        <div
          className="
            grid
            grid-cols-1
            2xl:grid-cols-3
            gap-8
          "
        >

          {/* CHART */}
          <div
            className="
              2xl:col-span-2
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

            <div
              className="
                flex
                items-center
                justify-between
                mb-8
              "
            >

              <h2
                className="
                  text-4xl
                  font-bold
                "
              >
                Resumen Financiero
              </h2>

              <button
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/[0.06]
                "
              >
                Tiempo Real
              </button>

            </div>

            <SalesChart
              sales={
                stats.recentSales
              }
            />

          </div>

          {/* RECENT SALES */}
          <RecentSales
            sales={
              stats.recentSales
            }
          />

        </div>

      </div>

    </MainLayout>
  );
}

export default Dashboard;