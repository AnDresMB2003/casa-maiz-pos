const express =
  require("express");

const router =
  express.Router();

const db =
  require("../../config/db");

/* =========================================
   GET ALL MOVEMENTS
========================================= */

router.get(
  "/movements",
  (req, res) => {

    const query = `
      SELECT

        inventory_movements.*,

        products.name
        AS product_name,

        products.image
        AS product_image,

        products.category
        AS product_category

      FROM inventory_movements

      LEFT JOIN products
        ON inventory_movements.product_id =
        products.id

      ORDER BY inventory_movements.id DESC
    `;

    db.all(
      query,
      [],
      (err, rows) => {

        if (err) {

          console.log(err);

          return res.status(500).json({
            error:
              "Error obteniendo movimientos",
          });
        }

        res.json(rows);
      }
    );
  }
);

/* =========================================
   CREATE MOVEMENT
========================================= */

router.post(
  "/movement",
  (req, res) => {

    const {
      productId,
      quantity,
      type,
      note,
    } = req.body;

    if (
      !productId ||
      !quantity ||
      !type
    ) {

      return res.status(400).json({
        error:
          "Datos incompletos",
      });
    }

    db.get(
      `
      SELECT *
      FROM products
      WHERE id = ?
    `,
      [productId],

      (
        err,
        product
      ) => {

        if (
          err ||
          !product
        ) {

          console.log(err);

          return res.status(404).json({
            error:
              "Producto no encontrado",
          });
        }

        const previousStock =
          Number(product.stock);

        let newStock =
          previousStock;

        /* ================================
           ENTRADA
        ================================= */

        if (
          type === "entrada"
        ) {

          newStock =
            previousStock +
            Number(quantity);
        }

        /* ================================
           SALIDA
        ================================= */

        if (
          type === "salida"
        ) {

          newStock =
            previousStock -
            Number(quantity);

          if (
            newStock < 0
          ) {

            return res.status(400).json({
              error:
                "Stock insuficiente",
            });
          }
        }

        /* ================================
           UPDATE PRODUCT
        ================================= */

        db.run(
          `
          UPDATE products

          SET stock = ?

          WHERE id = ?
        `,
          [
            newStock,
            productId,
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

              return res.status(500).json({
                error:
                  "Error actualizando stock",
              });
            }

            /* ================================
               SAVE MOVEMENT
            ================================= */

            db.run(
              `
              INSERT INTO inventory_movements (
                product_id,
                type,
                quantity,
                previous_stock,
                new_stock,
                note,
                created_at
              )

              VALUES (?, ?, ?, ?, ?, ?, datetime('now','localtime'))
            `,
              [
                productId,
                type,
                quantity,
                previousStock,
                newStock,
                note || "",
              ],

              function (
                movementError
              ) {

                if (
                  movementError
                ) {

                  console.log(
                    movementError
                  );

                  return res.status(500).json({
                    error:
                      "Error creando movimiento",
                  });
                }

                res.json({
                  success: true,

                  movementId:
                    this.lastID,

                  previousStock,

                  newStock,
                });
              }
            );
          }
        );
      }
    );
  }
);

module.exports =
  router;