const express =
  require("express");

const cors =
  require("cors");

const bcrypt =
  require("bcryptjs");

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

const settingsRoutes =
  require("./routes/settings/settingsRoutes");

const permissionsRoutes =
  require("./routes/permissions/permissionsRoutes");

const notificationsRoutes =
  require("./routes/notifications/notificationsRoutes");

const auditRoutes =
  require("./routes/audit/auditRoutes");

const timeoffRoutes =
  require("./routes/timeoff/timeoffRoutes");

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
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/permissions",
  permissionsRoutes
);

app.use(
  "/api/notifications",
  notificationsRoutes
);

app.use(
  "/api/audit",
  auditRoutes
);

app.use(
  "/api/timeoff",
  timeoffRoutes
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

  /* BUSINESS SETTINGS */

  db.run(`
    CREATE TABLE IF NOT EXISTS business_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name TEXT,
      nit TEXT,
      phone TEXT,
      address TEXT,
      logo TEXT,
      iva REAL DEFAULT 19,
      currency TEXT DEFAULT 'COP',
      theme TEXT DEFAULT 'dark',
      invoice_prefix TEXT DEFAULT 'FAC'
    )
  `);

  /* MODULE PERMISSIONS */

  db.run(`
    CREATE TABLE IF NOT EXISTS module_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT,
      module TEXT,
      can_view INTEGER DEFAULT 0,
      can_create INTEGER DEFAULT 0,
      can_edit INTEGER DEFAULT 0,
      can_delete INTEGER DEFAULT 0,
      can_export INTEGER DEFAULT 0,
      can_print INTEGER DEFAULT 0
    )
  `);

  /* NOTIFICATIONS */

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      type TEXT,
      title TEXT,
      message TEXT,
      read INTEGER DEFAULT 0,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* AUDITS */

  db.run(`
    CREATE TABLE IF NOT EXISTS audits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      ip TEXT,
      module TEXT,
      action TEXT,
      detail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* TIME OFF */

  db.run(`
    CREATE TABLE IF NOT EXISTS time_off (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      type TEXT,
      start_date TEXT,
      end_date TEXT,
      reason TEXT,
      notes TEXT,
      status TEXT DEFAULT 'Activo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  db.run(`
    ALTER TABLE users
    ADD COLUMN document TEXT
  `, () => {});

  db.run(`
    ALTER TABLE users
    ADD COLUMN phone TEXT
  `, () => {});

  db.run(`
    ALTER TABLE users
    ADD COLUMN status TEXT DEFAULT 'Activo'
  `, () => {});

  db.run(`
    ALTER TABLE users
    ADD COLUMN position TEXT
  `, () => {});

  db.run(`
    ALTER TABLE users
    ADD COLUMN username TEXT
  `, () => {});

  db.run(`
    ALTER TABLE users
    ADD COLUMN image TEXT
  `, (err) => {
    if (err && !err.message.includes("duplicate column name")) {
      console.error("Error agregando columna image a users:", err.message);
    }
  });

  db.run(`
    ALTER TABLE users
    ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  `, () => {});

  db.run(`
    ALTER TABLE users
    ADD COLUMN last_access DATETIME
  `, () => {});

  db.run(`
    ALTER TABLE users
    ADD COLUMN active INTEGER DEFAULT 1
  `, () => {});

  db.run(`
    ALTER TABLE sales
    ADD COLUMN user_id INTEGER
  `, () => {});

  db.run(`
    ALTER TABLE sales
    ADD COLUMN user_name TEXT
  `, () => {});

  db.run(
    `
      DELETE FROM users
      WHERE role = 'admin'
    `,
    (deleteErr) => {
      if (deleteErr) {
        console.error("Error eliminando admin antiguo:", deleteErr.message);
        return;
      }

      const defaultPassword = "CasaMaiz2026!";
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

      db.run(
        `
          INSERT INTO users (
            name,
            username,
            email,
            password,
            role,
            status,
            active,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now','localtime'))
        `,
        [
          "Admin",
          "admin",
          "admin@casamaiz.local",
          hashedPassword,
          "admin",
          "Activo",
          1,
        ],
        function (insertErr) {
          if (insertErr) {
            console.error("Error creando admin por defecto:", insertErr.message);
            return;
          }

          console.log(
            "✅ Usuario administrador recreado: admin@casamaiz.local / CasaMaiz2026!"
          );
        }
      );
    }
  );

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