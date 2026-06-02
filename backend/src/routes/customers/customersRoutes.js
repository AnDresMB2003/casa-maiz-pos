const express =
  require("express");

const router =
  express.Router();

const db =
  require("../../config/db");

/* GET ALL CUSTOMERS */

router.get("/", (req, res) => {

  const query = `
    SELECT

      customers.*,

      COUNT(sales.id)
      AS total_purchases,

      COALESCE(
        SUM(sales.total),
        0
      ) AS total_spent

    FROM customers

    LEFT JOIN sales
      ON customers.id =
      sales.customer_id

    GROUP BY customers.id

    ORDER BY total_spent DESC
  `;

  db.all(
    query,
    [],
    (err, rows) => {

      if (err) {

        console.log(err);

        return res
          .status(500)
          .json({
            error:
              "Error obteniendo clientes",
          });
      }

      res.json(rows);
    }
  );
});

/* GET CUSTOMER BY DOCUMENT */

router.get(
  "/search/document/:document",
  (req, res) => {

    const document =
      req.params.document;

    const query = `
      SELECT *

      FROM customers

      WHERE document = ?
    `;

    db.get(
      query,
      [document],

      (err, customer) => {

        if (err) {

          console.log(err);

          return res
            .status(500)
            .json({
              error:
                "Error buscando cliente",
            });
        }

        if (!customer) {

          return res
            .status(404)
            .json({
              error:
                "Cliente no encontrado",
            });
        }

        res.json(customer);
      }
    );
  }
);

/* GET CUSTOMER BY EMAIL */

router.get(
  "/search/email/:email",
  (req, res) => {

    const email =
      req.params.email;

    const query = `
      SELECT *

      FROM customers

      WHERE email = ?
    `;

    db.get(
      query,
      [email],

      (err, customer) => {

        if (err) {

          console.log(err);

          return res
            .status(500)
            .json({
              error:
                "Error buscando cliente",
            });
        }

        if (!customer) {

          return res
            .status(404)
            .json({
              error:
                "Cliente no encontrado",
            });
        }

        res.json(customer);
      }
    );
  }
);

/* GET CUSTOMER DETAILS */

router.get(
  "/:id",
  (req, res) => {

    const customerId =
      req.params.id;

    const customerQuery = `
      SELECT *

      FROM customers

      WHERE id = ?
    `;

    db.get(
      customerQuery,
      [customerId],

      (
        customerError,
        customer
      ) => {

        if (
          customerError ||
          !customer
        ) {

          return res
            .status(404)
            .json({
              error:
                "Cliente no encontrado",
            });
        }

        const salesQuery = `
          SELECT *

          FROM sales

          WHERE customer_id = ?

          ORDER BY id DESC
        `;

        db.all(
          salesQuery,
          [customerId],

          (
            salesError,
            sales
          ) => {

            if (
              salesError
            ) {

              return res
                .status(500)
                .json({
                  error:
                    "Error obteniendo ventas",
                });
            }

            customer.sales =
              sales;

            res.json(
              customer
            );
          }
        );
      }
    );
  }
);

module.exports =
  router;