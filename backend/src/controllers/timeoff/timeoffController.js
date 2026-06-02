const db = require("../../config/db");
const { logAudit } = require("../../utils/auditLogger");

const listTimeOff = (req, res) => {
  const query = req.user.role === "admin"
    ? `SELECT * FROM time_off ORDER BY id DESC`
    : `SELECT * FROM time_off WHERE user_id = ? ORDER BY id DESC`;

  db.all(
    query,
    req.user.role === "admin" ? [] : [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: "Error obteniendo solicitudes de personal",
        });
      }
      res.json(rows);
    }
  );
};

const createTimeOff = (req, res) => {
  const {
    type,
    start_date,
    end_date,
    reason,
    notes,
    status,
  } = req.body;

  if (!type || !start_date || !end_date) {
    return res.status(400).json({
      error: "Tipo, fecha inicio y fecha fin son obligatorios",
    });
  }

  db.run(
    `
      INSERT INTO time_off (
        user_id,
        user_name,
        type,
        start_date,
        end_date,
        reason,
        notes,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now','localtime'))
    `,
    [
      req.user.id,
      req.user.name,
      type,
      start_date,
      end_date,
      reason || "",
      notes || "",
      status || "Activo",
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Error creando solicitud de personal",
        });
      }

      logAudit({
        user_id: req.user.id,
        user_name: req.user.name,
        ip: req.ip,
        module: "Recursos Humanos",
        action: "Crear solicitud",
        detail: `Solicitud de ${type} creada desde ${start_date} hasta ${end_date}`,
      });

      res.status(201).json({
        success: true,
        id: this.lastID,
      });
    }
  );
};

const updateTimeOff = (req, res) => {
  const { id } = req.params;
  const {
    type,
    start_date,
    end_date,
    reason,
    notes,
    status,
  } = req.body;

  db.run(
    `
      UPDATE time_off
      SET
        type = ?,
        start_date = ?,
        end_date = ?,
        reason = ?,
        notes = ?,
        status = ?
      WHERE id = ?
    `,
    [
      type,
      start_date,
      end_date,
      reason || "",
      notes || "",
      status || "Activo",
      id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Error actualizando solicitud de personal",
        });
      }

      logAudit({
        user_id: req.user.id,
        user_name: req.user.name,
        ip: req.ip,
        module: "Recursos Humanos",
        action: "Actualizar solicitud",
        detail: `Solicitud ${id} actualizada a estado ${status}`,
      });

      res.json({
        success: true,
      });
    }
  );
};

const deleteTimeOff = (req, res) => {
  const { id } = req.params;

  db.run(
    `DELETE FROM time_off WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Error eliminando solicitud de personal",
        });
      }

      logAudit({
        user_id: req.user.id,
        user_name: req.user.name,
        ip: req.ip,
        module: "Recursos Humanos",
        action: "Eliminar solicitud",
        detail: `Solicitud ${id} eliminada`,
      });

      res.json({
        success: true,
      });
    }
  );
};

module.exports = {
  listTimeOff,
  createTimeOff,
  updateTimeOff,
  deleteTimeOff,
};
