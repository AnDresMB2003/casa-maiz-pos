const db =
  require("./config/db");

db.serialize(() => {

  db.run(`
    DROP TABLE IF EXISTS sale_items
  `);

  db.run(`
    CREATE TABLE sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER,
      product_id INTEGER,
      product_name TEXT,
      quantity INTEGER,
      price REAL
    )
  `);

  console.log(
    "✅ sale_items fixed"
  );
});

db.close();