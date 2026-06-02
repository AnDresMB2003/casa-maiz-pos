const db = require("../config/db");

function logAudit({
  user_id,
  user_name,
  ip,
  module,
  action,
  detail,
}) {
  const query = `
    INSERT INTO audits (
      user_id,
      user_name,
      ip,
      module,
      action,
      detail,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now','localtime'))
  `;

  db.run(
    query,
    [
      user_id || null,
      user_name || "Sistema",
      ip || "-",
      module || "General",
      action || "Desconocida",
      detail || "",
    ],
    (err) => {
      if (err) {
        console.error("Error guardando auditoría:", err.message);
      }
    }
  );
}

module.exports = {
  logAudit,
};
