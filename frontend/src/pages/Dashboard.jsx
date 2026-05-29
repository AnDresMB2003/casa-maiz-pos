import {
  useEffect,
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
  Crown,
  TrendingUp,
  Box,
} from "lucide-react";

import api from "../services/api";

import toast from "react-hot-toast";

function Dashboard() {

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =========================================
     LOAD DASHBOARD
  ========================================= */

  useEffect(() => {

    loadStats();

  }, []);

  async function loadStats() {

    try {

      setLoading(true);

      const response =
        await api.get(
          "/dashboard"
        );

      setStats(
        response.data
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Error cargando dashboard"
      );

    } finally {

      setLoading(false);
    }
  }

  /* =========================================
     DASHBOARD CARDS
  ========================================= */

  const cards =
    useMemo(() => {

      if (!stats)
        return [];

      return [

        {
          title:
            "Ingresos",
          value:
            `$${Number(
              stats.totalRevenue || 0
            ).toLocaleString(
              "es-CO"
            )}`,
          icon: (
            <DollarSign
              size={36}
            />
          ),
          color:
            "#EAB308",
          percentage:
            "Total",
        },

        {
          title:
            "Ventas",
          value:
            stats.totalSales || 0,
          icon: (
            <ShoppingCart
              size={36}
            />
          ),
          color:
            "#22C55E",
          percentage:
            "Registradas",
        },

        {
          title:
            "Productos",
          value:
            stats.totalProducts || 0,
          icon: (
            <Package
              size={36}
            />
          ),
          color:
            "#3B82F6",
          percentage:
            "Activos",
        },

        {
          title:
            "Stock Bajo",
          value:
            stats.lowStock || 0,
          icon: (
            <AlertTriangle
              size={36}
            />
          ),
          color:
            "#EF4444",
          percentage:
            "Crítico",
        },

        {
          title:
            "Ventas Hoy",
          value:
            `$${Number(
              stats.todaySales || 0
            ).toLocaleString(
              "es-CO"
            )}`,
          icon: (
            <TrendingUp
              size={36}
            />
          ),
          color:
            "#F97316",
          percentage:
            "Hoy",
        },

        {
          title:
            "Mejor Cliente",
          value:
            stats
              .topCustomer
              ?.name ||
            "Sin ventas",
          icon: (
            <Crown
              size={36}
            />
          ),
          color:
            "#8B5CF6",
          percentage:
            `$${Number(
              stats
                .topCustomer
                ?.total || 0
            ).toLocaleString(
              "es-CO"
            )}`,
        },

        {
          title:
            "Producto TOP",
          value:
            stats
              .bestProduct
              ?.product_name ||
            "Sin ventas",
          icon: (
            <Box
              size={36}
            />
          ),
          color:
            "#06B6D4",
          percentage:
            `${
              stats
                .bestProduct
                ?.sold || 0
            } vendidos`,
        },

      ];

    }, [stats]);

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

      <MainLayout>

        <div
          className="
            flex
            items-center
            justify-center
            h-[70vh]
          "
        >

          <div
            className="
              text-3xl
              font-black
              text-[#EAB308]
            "
          >
            Cargando dashboard...
          </div>

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

          <p
            className="
              text-gray-400
              text-xl
              mt-4
            "
          >
            Sistema administrativo premium
            para ventas, inventario y
            gestión empresarial.
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
            (
              card,
              index
            ) => (

              <StatsCard
                key={card.title}
                title={
                  card.title
                }
                value={
                  card.value
                }
                icon={
                  card.icon
                }
                color={
                  card.color
                }
                delay={
                  0.1 *
                  (
                    index + 1
                  )
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

              <div>

                <h2
                  className="
                    text-4xl
                    font-bold
                  "
                >
                  Resumen Financiero
                </h2>

                <p
                  className="
                    text-gray-400
                    mt-2
                  "
                >
                  Ventas registradas
                  en tiempo real
                </p>

              </div>

              <button
                onClick={
                  loadStats
                }
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/[0.06]
                  hover:bg-white/[0.08]
                  transition
                "
              >
                Actualizar
              </button>

            </div>

            <SalesChart
              sales={
                stats.chartData || []
              }
            />

          </div>

          {/* RECENT SALES */}

          <RecentSales
            sales={
              stats.recentSales || []
            }
          />

        </div>

      </div>

    </MainLayout>
  );
}

export default Dashboard;