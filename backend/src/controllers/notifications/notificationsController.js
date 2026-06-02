const db = require("../../config/db");
const { logAudit } = require("../../utils/auditLogger");

const getNotifications = (req, res) => {
  const userId = req.user.id;
  const query = req.user.role === "admin"
    ? `SELECT * FROM notifications ORDER BY id DESC`
    : `SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC`;

  db.all(
    query,
    req.user.role === "admin" ? [] : [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: "Error obteniendo notificaciones",
        });
      }

      res.json(rows);
    }
  );
};

const markNotificationRead = (req, res) => {
  const { id } = req.params;

  db.run(
    `UPDATE notifications SET read = 1 WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Error marcando la notificación como leída",
        });
      }

      logAudit({
        user_id: req.user.id,
        user_name: req.user.name,
        ip: req.ip,
        module: "Notificaciones",
        action: "Marcar como leída",
        detail: `Notificación ${id} marcada como leída`,
      });

      res.json({
        success: true,
      });
    }
  );
};

const markAllNotificationsRead = (req, res) => {
  const userId = req.user.id;
  const query = req.user.role === "admin"
    ? `UPDATE notifications SET read = 1`
    : `UPDATE notifications SET read = 1 WHERE user_id = ?`;

  db.run(
    query,
    req.user.role === "admin" ? [] : [userId],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Error marcando todas las notificaciones como leídas",
        });
      }

      logAudit({
        user_id: req.user.id,
        user_name: req.user.name,
        ip: req.ip,
        module: "Notificaciones",
        action: "Marcar todas como leídas",
        detail: `Notificaciones marcadas como leídas`,
      });

      res.json({
        success: true,
      });
    }
  );
};

const deleteNotification = (req, res) => {
  const { id } = req.params;

  db.run(
    `DELETE FROM notifications WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Error eliminando la notificación",
        });
      }

      logAudit({
        user_id: req.user.id,
        user_name: req.user.name,
        ip: req.ip,
        module: "Notificaciones",
        action: "Eliminar notificación",
        detail: `Notificación ${id} eliminada`,
      });

      res.json({
        success: true,
      });
    }
  );
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};
