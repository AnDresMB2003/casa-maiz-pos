const db = require("../../config/db");

// GET DASHBOARD STATS
const getDashboardStats = (req, res) => {

  const stats = {};

  // TOTAL SALES
  db.get(
    `
      SELECT COUNT(*) as totalSales
      FROM sales
    `,
    [],
    (err, salesResult) => {

      if (err) {

        return res.status(500).json({
          error: err.message,
        });
      }

      stats.totalSales =
        salesResult.totalSales;

      // TOTAL REVENUE
      db.get(
        `
          SELECT SUM(total) as revenue
          FROM sales
        `,
        [],
        (err, revenueResult) => {

          if (err) {

            return res.status(500).json({
              error: err.message,
            });
          }

          stats.totalRevenue =
            revenueResult.revenue || 0;

          // PRODUCTS
          db.get(
            `
              SELECT COUNT(*) as totalProducts
              FROM products
            `,
            [],
            (err, productResult) => {

              if (err) {

                return res.status(500).json({
                  error: err.message,
                });
              }

              stats.totalProducts =
                productResult.totalProducts;

              // LOW STOCK
              db.get(
                `
                  SELECT COUNT(*) as lowStock
                  FROM products
                  WHERE stock <= 5
                `,
                [],
                (
                  err,
                  lowStockResult
                ) => {

                  if (err) {

                    return res.status(500).json({
                      error: err.message,
                    });
                  }

                  stats.lowStock =
                    lowStockResult.lowStock;

                  // RECENT SALES
                  db.all(
                    `
                      SELECT *
                      FROM sales
                      ORDER BY id DESC
                      LIMIT 5
                    `,
                    [],
                    (
                      err,
                      recentSales
                    ) => {

                      if (err) {

                        return res.status(500).json({
                          error:
                            err.message,
                        });
                      }

                      stats.recentSales =
                        recentSales;

                      res.json(stats);
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