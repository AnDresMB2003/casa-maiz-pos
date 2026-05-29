const express =
  require("express");

const router =
  express.Router();

const db =
  require("../config/db");

// GET PRODUCTS
router.get(
  "/",
  (
    req,
    res
  ) => {

    db.all(
      `
      SELECT *
      FROM products
      ORDER BY id DESC
      `,
      [],
      (
        err,
        rows
      ) => {

        if (err) {

          console.log(
            err
          );

          return res
            .status(500)
            .json({
              message:
                "Error obteniendo productos",
            });
        }

        res.json(
          rows
        );
      }
    );
  }
);

// CREATE PRODUCT
router.post(
  "/",
  (
    req,
    res
  ) => {

    const {
      name,
      category,
      price,
      stock,
      image,
    } = req.body;

    if (
      !name ||
      !price
    ) {

      return res
        .status(400)
        .json({
          message:
            "Nombre y precio requeridos",
        });
    }

    db.run(
      `
      INSERT INTO products (
        name,
        category,
        price,
        stock,
        image
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        name,
        category,
        price,
        stock,
        image,
      ],
      function (
        err
      ) {

        if (
          err
        ) {

          console.log(
            err
          );

          return res
            .status(500)
            .json({
              message:
                "Error creando producto",
            });
        }

        res.json({

          id:
            this.lastID,

          name,

          category,

          price,

          stock,

          image,
        });
      }
    );
  }
);

// UPDATE PRODUCT
router.put(
  "/:id",
  (
    req,
    res
  ) => {

    const {
      name,
      category,
      price,
      stock,
      image,
    } = req.body;

    db.run(
      `
      UPDATE products
      SET
        name = ?,
        category = ?,
        price = ?,
        stock = ?,
        image = ?
      WHERE id = ?
      `,
      [
        name,
        category,
        price,
        stock,
        image,
        req.params.id,
      ],
      function (
        err
      ) {

        if (
          err
        ) {

          console.log(
            err
          );

          return res
            .status(500)
            .json({
              message:
                "Error actualizando producto",
            });
        }

        res.json({
          id:
            req.params.id,
          name,
          category,
          price,
          stock,
          image,
        });
      }
    );
  }
);

// DELETE PRODUCT
router.delete(
  "/:id",
  (
    req,
    res
  ) => {

    db.run(
      `
      DELETE FROM products
      WHERE id = ?
      `,
      [
        req.params.id,
      ],
      function (
        err
      ) {

        if (
          err
        ) {

          console.log(
            err
          );

          return res
            .status(500)
            .json({
              message:
                "Error eliminando producto",
            });
        }

        res.json({
          success: true,
        });
      }
    );
  }
);

module.exports =
  router;