const db =
  require("./db");

function initBusinessSettings() {

  db.run(`
    CREATE TABLE IF NOT EXISTS business_settings (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      business_name TEXT,
      nit TEXT,
      phone TEXT,
      address TEXT,
      logo TEXT,
      iva REAL DEFAULT 19,
      invoice_prefix TEXT DEFAULT 'FAC'

    )
  `);

  db.get(
    `
      SELECT *
      FROM business_settings
      LIMIT 1
    `,
    [],
    (
      err,
      row
    ) => {

      if (!row) {

        db.run(`
          INSERT INTO business_settings (
            business_name,
            nit,
            phone,
            address,
            logo,
            iva,
            invoice_prefix
          )

          VALUES (
            'CASA MAÍZ',
            '901456789-1',
            '+57 300 000 0000',
            'Bogotá, Colombia',
            '',
            19,
            'FAC'
          )
        `);
      }
    }
  );
}

module.exports =
  initBusinessSettings;