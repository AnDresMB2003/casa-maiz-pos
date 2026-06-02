const db = require("../../config/db");
const { logAudit } = require("../../utils/auditLogger");

const modules = [
  "Dashboard",
  "Inventario",
  "Ventas",
  "Clientes",
  "Reportes",
  "Usuarios",
  "Configuración",
];

function ensureRolePermissions(role, callback) {
  db.all(
    `SELECT * FROM module_permissions WHERE role = ?`,
    [role],
    (err, rows) => {
      if (err) {
        return callback(err);
      }

      if (rows.length > 0) {
        return callback(null, rows);
      }

      const insertQuery = `
        INSERT INTO module_permissions (
          role,
          module,
          can_view,
          can_create,
          can_edit,
          can_delete,
          can_export,
          can_print
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const defaultData = modules.map((module) => [
        role,
        module,
        role === "admin" ? 1 : module === "Ventas" ? 1 : 0,
        role === "admin" ? 1 : 0,
        role === "admin" ? 1 : 0,
        role === "admin" ? 1 : 0,
        role === "admin" ? 1 : 0,
        role === "admin" ? 1 : 0,
      ]);

      db.serialize(() => {
        defaultData.forEach((values) => {
          db.run(insertQuery, values);
        });
      });

      db.all(
        `SELECT * FROM module_permissions WHERE role = ?`,
        [role],
        callback
      );
    }
  );
}

const getRolePermissions = (req, res) => {
  const { role } = req.params;

  ensureRolePermissions(role, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Error obteniendo permisos",
      });
    }

    res.json(rows);
  });
};

const saveRolePermissions = (req, res) => {
  const { role } = req.params;
  const { permissions } = req.body;

  if (!Array.isArray(permissions)) {
    return res.status(400).json({
      error: "Permisos inválidos",
    });
  }

  db.serialize(() => {
    const deleteQuery = `DELETE FROM module_permissions WHERE role = ?`;
    db.run(deleteQuery, [role], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).json({
          error: "Error actualizando permisos",
        });
      }

      const insertQuery = `
        INSERT INTO module_permissions (
          role,
          module,
          can_view,
          can_create,
          can_edit,
          can_delete,
          can_export,
          can_print
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      permissions.forEach((perm) => {
        db.run(
          insertQuery,
          [
            role,
            perm.module,
            perm.can_view ? 1 : 0,
            perm.can_create ? 1 : 0,
            perm.can_edit ? 1 : 0,
            perm.can_delete ? 1 : 0,
            perm.can_export ? 1 : 0,
            perm.can_print ? 1 : 0,
          ]
        );
      });

      logAudit({
        user_id: req.user.id,
        user_name: req.user.name,
        ip: req.ip,
        module: "Usuarios",
        action: "Cambio de permisos",
        detail: `Permisos actualizados para el rol ${role}`,
      });

      res.json({ success: true });
    });
  });
};

module.exports = {
  getRolePermissions,
  saveRolePermissions,
  modules,
};
