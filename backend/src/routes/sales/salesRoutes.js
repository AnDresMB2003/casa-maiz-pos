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

  const {
    search = "",
    startDate,
    endDate,
  } = req.query;

  let query = `
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

    WHERE 1 = 1
  `;

  const params = [];

  /* SEARCH */

  if (search.trim()) {

    query += `
      AND (
        customers.name LIKE ?
        OR customers.document LIKE ?
        OR sales.invoice_number LIKE ?
      )
    `;

    params.push(
      `%${search}%`,
      `%${search}%`,
      `%${search}%`
    );
  }

  /* DATE FILTER */

  if (startDate) {

    query += `
      AND DATE(sales.created_at)
      >= DATE(?)
    `;

    params.push(startDate);
  }

  if (endDate) {

    query += `
      AND DATE(sales.created_at)
      <= DATE(?)
    `;

    params.push(endDate);
  }

  query += `
    ORDER BY sales.id DESC
  `;

  db.all(
    query,
    params,

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

    /* =========================================
       VALIDATE STOCK FIRST
    ========================================= */

    const productIds =
      cart.map(
        (item) => item.id
      );

    const placeholders =
      productIds
        .map(() => "?")
        .join(",");

    db.all(
      `
      SELECT
        id,
        name,
        stock
      FROM products
      WHERE id IN (${placeholders})
    `,
      productIds,

      (
        stockError,
        products
      ) => {

        if (
          stockError
        ) {

          console.log(
            stockError
          );

          return res
            .status(500)
            .json({
              error:
                "Error validando stock",
            });
        }

        for (
          const item of cart
        ) {

          const product =
            products.find(
              (p) =>
                p.id ===
                item.id
            );

          if (
            !product
          ) {

            return res
              .status(404)
              .json({
                error:
                  `Producto no encontrado: ${item.name}`,
              });
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
              .status(400)
              .json({
                error:
                  `Stock insuficiente para ${product.name}`,
              });
          }
        }

        /* =========================================
           CUSTOMER DATA
        ========================================= */

        const hasCustomerData =

          customer?.name?.trim() ||
          customer?.document?.trim() ||
          customer?.phone?.trim() ||
          customer?.email?.trim();

        const customerName =
          hasCustomerData
            ? customer?.name?.trim()
            : "Consumidor final";

        const customerDocument =
          hasCustomerData
            ? customer?.document?.trim()
            : `CF-${Date.now()}`;

        const customerPhone =
          hasCustomerData
            ? customer?.phone?.trim()
            : "";

        const customerEmail =
          hasCustomerData
            ? customer?.email?.trim()
            : "";

        const invoiceNumber =
          `FAC-${Date.now()}`;

        /* =========================================
           FIND CUSTOMER
        ========================================= */

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

            /* =========================================
               CREATE SALE FUNCTION
            ========================================= */

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

                  let completed =
                    0;

                  cart.forEach(
                    (
                      item
                    ) => {

                      /* INSERT ITEM */

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
                        ],

                        (
                          itemError
                        ) => {

                          if (
                            itemError
                          ) {

                            console.log(
                              itemError
                            );
                          }
                        }
                      );

                      /* UPDATE STOCK */

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
                        }
                      );

                      /* INVENTORY MOVEMENT */

                      db.run(
                        `
                        INSERT INTO inventory_movements (
                          product_id,
                          type,
                          quantity,
                          reference,
                          created_at
                        )

                        VALUES (?, ?, ?, ?, datetime('now','localtime'))
                      `,
                        [
                          item.id,
                          "SALE",
                          item.quantity,
                          invoiceNumber,
                        ],

                        (
                          movementError
                        ) => {

                          if (
                            movementError
                          ) {

                            console.log(
                              movementError
                            );
                          }
                        }
                      );

                      completed++;

                      if (
                        completed ===
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

            /* =========================================
               UPDATE CUSTOMER
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
  }
);

module.exports =
  router;