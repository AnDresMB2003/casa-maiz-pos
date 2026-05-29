const db = require("../../config/db");

// CREATE SALE
const createSale = (req, res) => {

  const { items, total } = req.body;

  if (!items || items.length === 0) {

    return res.status(400).json({
      error: "No hay productos",
    });
  }

  // CREATE SALE
  const saleQuery = `
    INSERT INTO sales (total)
    VALUES (?)
  `;

  db.run(
    saleQuery,
    [total],
    function (err) {

      if (err) {

        return res.status(500).json({
          error: err.message,
        });
      }

      const saleId = this.lastID;

      // INSERT ITEMS
      items.forEach((item) => {

        const itemQuery = `
          INSERT INTO sale_items
          (
            sale_id,
            product_id,
            quantity,
            price
          )
          VALUES (?, ?, ?, ?)
        `;

        db.run(
          itemQuery,
          [
            saleId,
            item.id,
            item.quantity,
            item.price,
          ]
        );

        // UPDATE STOCK
        const stockQuery = `
          UPDATE products
          SET stock = stock - ?
          WHERE id = ?
        `;

        db.run(
          stockQuery,
          [
            item.quantity,
            item.id,
          ]
        );
      });

      res.status(201).json({
        message: "Venta registrada",
        saleId,
      });
    }
  );
};

// GET SALES
const getSales = (req, res) => {

  const query = `
    SELECT *
    FROM sales
    ORDER BY id DESC
  `;

  db.all(query, [], (err, rows) => {

    if (err) {

      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(rows);
  });
};

module.exports = {
  createSale,
  getSales,
};