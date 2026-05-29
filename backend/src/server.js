const express =
  require("express");

const cors =
  require("cors");

const db =
  require("./config/db");

const authRoutes =
  require("./routes/auth/authRoutes");

const productRoutes =
  require("./routes/productRoutes");

const salesRoutes =
  require("./routes/sales/salesRoutes");

const dashboardRoutes =
  require("./routes/dashboard/dashboardRoutes");

const usersRoutes =
  require("./routes/users/usersRoutes");

const customersRoutes =
  require("./routes/customers/customersRoutes");

const app =
  express();

/* CORS */

app.use(cors());

/* FIX PAYLOAD */

app.use(
  express.json({
    limit: "25mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "25mb",
  })
);

/* ROUTES */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/sales",
  salesRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/users",
  usersRoutes
);

app.use(
  "/api/customers",
  customersRoutes
);

/* DATABASE */

db.serialize(() => {

  /* USERS */

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  /* PRODUCTS */

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      description TEXT,
      price REAL,
      stock INTEGER,
      image TEXT
    )
  `);

  /* CUSTOMERS */

  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      document TEXT,
      phone TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* SALES */

  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      subtotal REAL,
      iva REAL,
      total REAL,
      invoice_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* SALE ITEMS */

  db.run(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER,
      product_id INTEGER,
      product_name TEXT,
      quantity INTEGER,
      price REAL
    )
  `);

  /* SAFE MIGRATIONS */

  db.run(`
    ALTER TABLE sales
    ADD COLUMN customer_id INTEGER
  `, () => {});

  db.run(`
    ALTER TABLE sales
    ADD COLUMN subtotal REAL
  `, () => {});

  db.run(`
    ALTER TABLE sales
    ADD COLUMN iva REAL
  `, () => {});

  db.run(`
    ALTER TABLE sales
    ADD COLUMN invoice_number TEXT
  `, () => {});

  db.run(`
    ALTER TABLE customers
    ADD COLUMN phone TEXT
  `, () => {});

  db.run(`
    ALTER TABLE customers
    ADD COLUMN email TEXT
  `, () => {});

  console.log(
    "✅ Database ready"
  );
});

const PORT =
  4000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );
});