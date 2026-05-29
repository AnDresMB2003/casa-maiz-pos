const db = require("../config/db");

// GET PRODUCTS
const getProducts = (req, res) => {
  const query = `
    SELECT * FROM products
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

// CREATE PRODUCT
const createProduct = (req, res) => {
  const {
    name,
    category,
    price,
    stock,
    image,
  } = req.body;

  const query = `
    INSERT INTO products
    (name, category, price, stock, image)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      name,
      category,
      price,
      stock,
      image,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Producto creado",
        id: this.lastID,
      });
    }
  );
};

// DELETE PRODUCT
const deleteProduct = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM products
    WHERE id = ?
  `;

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json({
      message: "Producto eliminado",
    });
  });
};

// UPDATE PRODUCT
const updateProduct = (req, res) => {
  const { id } = req.params;

  const {
    name,
    category,
    price,
    stock,
    image,
  } = req.body;

  const query = `
    UPDATE products
    SET
      name = ?,
      category = ?,
      price = ?,
      stock = ?,
      image = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [
      name,
      category,
      price,
      stock,
      image,
      id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json({
        message: "Producto actualizado",
      });
    }
  );
};

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};