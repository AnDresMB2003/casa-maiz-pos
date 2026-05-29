const express =
  require("express");

const router =
  express.Router();

const db =
  require("../../database/db");

router.get(
  "/",
  (req, res) => {

    db.all(
      `
      SELECT *
      FROM products
      ORDER BY id DESC
      `,
      [],
      (err, rows) => {

        if (err) {

          return res
            .status(500)
            .json({
              message:
                "Error obteniendo productos",
            });
        }

        res.json(rows);
      }
    );
  }
);

router.post(
  "/",
  (req, res) => {

    const {
      name,
      price,
      stock,
      category,
      image,
    } = req.body;

    db.run(
      `
      INSERT INTO products (
        name,
        price,
        stock,
        category,
        image
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        name,
        price,
        stock,
        category,
        image,
      ],
      function (err) {

        if (err) {

          console.log(err);

          return res
            .status(500)
            .json({
              message:
                "Error creando producto",
            });
        }

        res.json({
          id: this.lastID,
          name,
          price,
          stock,
          category,
          image,
        });
      }
    );
  }
);

router.put(
  "/:id",
  (req, res) => {

    const {
      name,
      price,
      stock,
      category,
      image,
    } = req.body;

    db.run(
      `
      UPDATE products
      SET
        name = ?,
        price = ?,
        stock = ?,
        category = ?,
        image = ?
      WHERE id = ?
      `,
      [
        name,
        price,
        stock,
        category,
        image,
        req.params.id,
      ],
      function (err) {

        if (err) {

          console.log(err);

          return res
            .status(500)
            .json({
              message:
                "Error actualizando producto",
            });
        }

        res.json({
          id: req.params.id,
          name,
          price,
          stock,
          category,
          image,
        });
      }
    );
  }
);

router.delete(
  "/:id",
  (req, res) => {

    db.run(
      `
      DELETE FROM products
      WHERE id = ?
      `,
      [req.params.id],
      function (err) {

        if (err) {

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