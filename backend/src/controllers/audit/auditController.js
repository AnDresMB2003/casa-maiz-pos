const db = require("../../config/db");

const getAudits = (req, res) => {
  const { user, query } = req;
  const filters = [];
  let sql = `SELECT * FROM audits`;

  if (query.user_id) {
    sql += ` WHERE user_id = ?`;
    filters.push(query.user_id);
  }

  if (query.module) {
    sql += filters.length ? ` AND module = ?` : ` WHERE module = ?`;
    filters.push(query.module);
  }

  sql += ` ORDER BY id DESC`;

  db.all(sql, filters, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Error obteniendo auditoría",
      });
    }

    res.json(rows);
  });
};

module.exports = {
  getAudits,
};
