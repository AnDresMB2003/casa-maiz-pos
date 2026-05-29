const db =
  require("../../config/db");

/* =========================================
   GET DASHBOARD STATS
========================================= */

const getDashboardStats =
  (req, res) => {

    const stats = {};

    /* =========================================
       TOTAL SALES
    ========================================= */

    db.get(
      `
        SELECT COUNT(*) as totalSales
        FROM sales
      `,
      [],

      (
        err,
        salesResult
      ) => {

        if (err) {

          return res
            .status(500)
            .json({
              error:
                err.message,
            });
        }

        stats.totalSales =
          salesResult.totalSales || 0;

        /* =========================================
           TOTAL REVENUE
        ========================================= */

        db.get(
          `
            SELECT
              SUM(total) as revenue

            FROM sales
          `,
          [],

          (
            err,
            revenueResult
          ) => {

            if (err) {

              return res
                .status(500)
                .json({
                  error:
                    err.message,
                });
            }

            stats.totalRevenue =
              revenueResult.revenue || 0;

            /* =========================================
               PRODUCTS
            ========================================= */

            db.get(
              `
                SELECT
                  COUNT(*) as totalProducts

                FROM products
              `,
              [],

              (
                err,
                productResult
              ) => {

                if (err) {

                  return res
                    .status(500)
                    .json({
                      error:
                        err.message,
                    });
                }

                stats.totalProducts =
                  productResult.totalProducts || 0;

                /* =========================================
                   LOW STOCK
                ========================================= */

                db.get(
                  `
                    SELECT
                      COUNT(*) as lowStock

                    FROM products

                    WHERE stock <= 5
                  `,
                  [],

                  (
                    err,
                    lowStockResult
                  ) => {

                    if (err) {

                      return res
                        .status(500)
                        .json({
                          error:
                            err.message,
                        });
                    }

                    stats.lowStock =
                      lowStockResult.lowStock || 0;

                    /* =========================================
                       TODAY SALES
                    ========================================= */

                    db.get(
                      `
                        SELECT
                          SUM(total) as todaySales

                        FROM sales

                        WHERE date(created_at) =
                        date('now','localtime')
                      `,
                      [],

                      (
                        err,
                        todayResult
                      ) => {

                        if (err) {

                          return res
                            .status(500)
                            .json({
                              error:
                                err.message,
                            });
                        }

                        stats.todaySales =
                          todayResult.todaySales || 0;

                        /* =========================================
                           TOP CUSTOMER
                        ========================================= */

                        db.get(
                          `
                            SELECT

                              customers.name,

                              SUM(sales.total)
                              as total

                            FROM sales

                            LEFT JOIN customers
                              ON sales.customer_id =
                              customers.id

                            GROUP BY customers.id

                            ORDER BY total DESC

                            LIMIT 1
                          `,
                          [],

                          (
                            err,
                            topCustomer
                          ) => {

                            if (err) {

                              return res
                                .status(500)
                                .json({
                                  error:
                                    err.message,
                                });
                            }

                            stats.topCustomer =
                              topCustomer || null;

                            /* =========================================
                               BEST PRODUCT
                            ========================================= */

                            db.get(
                              `
                                SELECT

                                  product_name,

                                  SUM(quantity)
                                  as sold

                                FROM sale_items

                                GROUP BY product_name

                                ORDER BY sold DESC

                                LIMIT 1
                              `,
                              [],

                              (
                                err,
                                bestProduct
                              ) => {

                                if (err) {

                                  return res
                                    .status(500)
                                    .json({
                                      error:
                                        err.message,
                                    });
                                }

                                stats.bestProduct =
                                  bestProduct || null;

                                /* =========================================
                                   CHART DATA
                                ========================================= */

                                db.all(
                                  `
                                    SELECT

                                      date(created_at)
                                      as date,

                                      SUM(total)
                                      as total

                                    FROM sales

                                    GROUP BY date(created_at)

                                    ORDER BY date(created_at) ASC

                                    LIMIT 7
                                  `,
                                  [],

                                  (
                                    err,
                                    chartData
                                  ) => {

                                    if (err) {

                                      return res
                                        .status(500)
                                        .json({
                                          error:
                                            err.message,
                                        });
                                    }

                                    stats.chartData =
                                      chartData || [];

                                    /* =========================================
                                       RECENT SALES
                                    ========================================= */

                                    db.all(
                                      `
                                        SELECT

                                          sales.*,

                                          customers.name
                                          AS customer_name

                                        FROM sales

                                        LEFT JOIN customers
                                          ON sales.customer_id =
                                          customers.id

                                        ORDER BY sales.id DESC

                                        LIMIT 5
                                      `,
                                      [],

                                      (
                                        err,
                                        recentSales
                                      ) => {

                                        if (err) {

                                          return res
                                            .status(500)
                                            .json({
                                              error:
                                                err.message,
                                            });
                                        }

                                        stats.recentSales =
                                          recentSales || [];

                                        res.json(
                                          stats
                                        );
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  };

module.exports = {
  getDashboardStats,
};