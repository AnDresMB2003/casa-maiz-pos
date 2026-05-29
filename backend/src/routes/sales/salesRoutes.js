/* backend/src/routes/sales/salesRoutes.js */

const express =
  require("express");

const router =
  express.Router();

const db =
  require("../../config/db");

/* =========================================
   GET ALL SALES
========================================= */

router.get("/", (req, res) => {

  const query = `
    SELECT

      sales.*,

      customers.name
      AS customer_name,

      customers.document
      AS customer_document

    FROM sales

    LEFT JOIN customers
      ON sales.customer_id =
      customers.id

    ORDER BY sales.id DESC
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
              "Error obteniendo ventas",
          });
      }

      res.json(rows);
    }
  );
});

/* =========================================
   GET SALE DETAILS
========================================= */

router.get(
  "/:id",
  (req, res) => {

    const saleId =
      req.params.id;

    const saleQuery = `
      SELECT

        sales.*,

        customers.name
        AS customer_name,

        customers.document
        AS customer_document,

        customers.phone
        AS customer_phone,

        customers.email
        AS customer_email

      FROM sales

      LEFT JOIN customers
        ON sales.customer_id =
        customers.id

      WHERE sales.id = ?
    `;

    db.get(
      saleQuery,
      [saleId],

      (
        err,
        sale
      ) => {

        if (
          err ||
          !sale
        ) {

          console.log(err);

          return res
            .status(404)
            .json({
              error:
                "Venta no encontrada",
            });
        }

        db.all(
          `
          SELECT

            sale_items.*,

            products.name
            AS product_name

          FROM sale_items

          LEFT JOIN products
            ON sale_items.product_id =
            products.id

          WHERE sale_items.sale_id = ?
        `,
          [saleId],

          (
            itemsError,
            items
          ) => {

            if (
              itemsError
            ) {

              console.log(
                itemsError
              );

              return res
                .status(500)
                .json({
                  error:
                    "Error obteniendo items",
                });
            }

            sale.items =
              items;

            res.json(
              sale
            );
          }
        );
      }
    );
  }
);

/* =========================================
   CREATE SALE
========================================= */

router.post(
  "/",
  (req, res) => {

    const {
      customer,
      cart,
      subtotal,
      iva,
      total,
    } = req.body;

    if (
      !cart ||
      cart.length === 0
    ) {

      return res
        .status(400)
        .json({
          error:
            "Carrito vacío",
        });
    }

    const customerName =
      customer?.name ||
      "Consumidor final";

    const customerDocument =
      customer?.document ||
      "222222222";

    const customerPhone =
      customer?.phone ||
      "";

    const customerEmail =
      customer?.email ||
      "";

    const invoiceNumber =
      `FAC-${Date.now()}`;

    db.get(
      `
      SELECT *

      FROM customers

      WHERE document = ?
    `,
      [customerDocument],

      (
        customerErr,
        existingCustomer
      ) => {

        if (
          customerErr
        ) {

          console.log(
            customerErr
          );

          return res
            .status(500)
            .json({
              error:
                "Error buscando cliente",
            });
        }

        function createSale(
          customerId
        ) {

          db.run(
            `
            INSERT INTO sales (
              customer_id,
              subtotal,
              iva,
              total,
              invoice_number,
              created_at
            )

            VALUES (?, ?, ?, ?, ?, datetime('now','localtime'))
          `,
            [
              customerId,
              subtotal,
              iva,
              total,
              invoiceNumber,
            ],

            function (
              saleError
            ) {

              if (
                saleError
              ) {

                console.log(
                  saleError
                );

                return res
                  .status(500)
                  .json({
                    error:
                      "Error creando venta",
                  });
              }

              const saleId =
                this.lastID;

              let processed =
                0;

              cart.forEach(
                (
                  item
                ) => {

                  db.get(
                    `
                    SELECT stock

                    FROM products

                    WHERE id = ?
                  `,
                    [item.id],

                    (
                      stockError,
                      product
                    ) => {

                      if (
                        stockError ||
                        !product
                      ) {

                        console.log(
                          stockError
                        );

                        return;
                      }

                      if (
                        Number(
                          item.quantity
                        ) >
                        Number(
                          product.stock
                        )
                      ) {

                        return res
                          .status(
                            400
                          )
                          .json({
                            error:
                              `Stock insuficiente para ${item.name}`,
                          });
                      }

                      db.run(
                        `
                        INSERT INTO sale_items (
                          sale_id,
                          product_id,
                          product_name,
                          quantity,
                          price
                        )

                        VALUES (?, ?, ?, ?, ?)
                      `,
                        [
                          saleId,
                          item.id,
                          item.name,
                          item.quantity,
                          item.price,
                        ]
                      );

                      db.run(
                        `
                        UPDATE products

                        SET stock =
                        stock - ?

                        WHERE id = ?
                      `,
                        [
                          item.quantity,
                          item.id,
                        ]
                      );

                      processed++;

                      if (
                        processed ===
                        cart.length
                      ) {

                        res.json({
                          success:
                            true,

                          saleId,

                          invoiceNumber,
                        });
                      }
                    }
                  );
                }
              );
            }
          );
        }

        /* =========================================
           EXISTING CUSTOMER
        ========================================= */

        if (
          existingCustomer
        ) {

          db.run(
            `
              UPDATE customers

              SET
                name = ?,
                phone = ?,
                email = ?

              WHERE id = ?
            `,
            [
              customerName,
              customerPhone,
              customerEmail,
              existingCustomer.id,
            ],

            (
              updateError
            ) => {

              if (
                updateError
              ) {

                console.log(
                  updateError
                );
              }

              createSale(
                existingCustomer.id
              );
            }
          );

        } else {

          /* =========================================
             CREATE CUSTOMER
          ========================================= */

          db.run(
            `
            INSERT INTO customers (
              name,
              document,
              phone,
              email
            )

            VALUES (?, ?, ?, ?)
          `,
            [
              customerName,
              customerDocument,
              customerPhone,
              customerEmail,
            ],

            function (
              insertError
            ) {

              if (
                insertError
              ) {

                console.log(
                  insertError
                );

                return res
                  .status(500)
                  .json({
                    error:
                      "Error creando cliente",
                  });
              }

              createSale(
                this.lastID
              );
            }
          );
        }
      }
    );
  }
);

module.exports =
  router;