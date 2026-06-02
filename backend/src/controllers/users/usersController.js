const db = require("../../config/db");
const bcrypt = require("bcryptjs");
const { logAudit } = require("../../utils/auditLogger");

const getUsers = (req, res) => {
  const query = `
    SELECT
      id,
      name,
      username,
      email,
      document,
      phone,
      role,
      status,
      position,
      image,
      created_at,
      last_access,
      active
    FROM users
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

const createUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      document,
      phone,
      password,
      role,
      status,
      position,
      active,
      image,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "Todos los campos obligatorios deben completarse",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (
        name,
        username,
        email,
        document,
        phone,
        password,
        role,
        status,
        position,
        active,
        image,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now','localtime'))
    `;

    db.run(
      query,
      [
        name,
        username || null,
        email,
        document || null,
        phone || null,
        hashedPassword,
        role,
        status || "Activo",
        position || "",
        active === false ? 0 : 1,
        image || null,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({
            error: err.message,
          });
        }

        logAudit({
          user_id: req.user?.id,
          user_name: req.user?.name,
          ip: req.ip,
          module: "Usuarios",
          action: "Crear usuario",
          detail: `Usuario ${email} creado con rol ${role}`,
        });

        res.status(201).json({
          message: "Usuario creado correctamente",
          id: this.lastID,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const {
    name,
    username,
    email,
    document,
    phone,
    role,
    status,
    position,
    active,
    image,
  } = req.body;

  const query = `
    UPDATE users
    SET
      name = ?,
      username = ?,
      email = ?,
      document = ?,
      phone = ?,
      role = ?,
      status = ?,
      position = ?,
      active = ?,
      image = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [
      name,
      username || null,
      email,
      document || null,
      phone || null,
      role,
      status || "Activo",
      position || "",
      active === false ? 0 : 1,
      image || null,
      id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      logAudit({
        user_id: req.user?.id,
        user_name: req.user?.name,
        ip: req.ip,
        module: "Usuarios",
        action: "Editar usuario",
        detail: `Usuario ${id} actualizado`,
      });

      res.json({
        success: true,
      });
    }
  );
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM users
    WHERE id = ?
  `;

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    logAudit({
      user_id: req.user?.id,
      user_name: req.user?.name,
      ip: req.ip,
      module: "Usuarios",
      action: "Eliminar usuario",
      detail: `Usuario ${id} eliminado`,
    });

    res.json({
      message: "Usuario eliminado",
    });
  });
};

const toggleUserStatus = (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  db.run(
    `
      UPDATE users
      SET active = ?
      WHERE id = ?
    `,
    [active ? 1 : 0, id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      logAudit({
        user_id: req.user?.id,
        user_name: req.user?.name,
        ip: req.ip,
        module: "Usuarios",
        action: active ? "Activar usuario" : "Desactivar usuario",
        detail: `Usuario ${id} ${active ? "activado" : "desactivado"}`,
      });

      res.json({
        success: true,
      });
    }
  );
};

const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const newPassword = password || "CasaMaiz123";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.run(
      `
        UPDATE users
        SET password = ?
        WHERE id = ?
      `,
      [hashedPassword, id],
      function (err) {
        if (err) {
          return res.status(500).json({
            error: err.message,
          });
        }

        logAudit({
          user_id: req.user?.id,
          user_name: req.user?.name,
          ip: req.ip,
          module: "Usuarios",
          action: "Restablecer contraseña",
          detail: `Contraseña restablecida para usuario ${id}`,
        });

        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: "Se requieren contraseña actual y nueva",
    });
  }

  db.get(`SELECT password FROM users WHERE id = ?`, [id], async (err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      return res.status(401).json({
        error: "Contraseña actual incorrecta",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.run(
      `
        UPDATE users
        SET password = ?
        WHERE id = ?
      `,
      [hashedPassword, id],
      function (updateError) {
        if (updateError) {
          return res.status(500).json({
            error: updateError.message,
          });
        }

        logAudit({
          user_id: req.user?.id,
          user_name: req.user?.name,
          ip: req.ip,
          module: "Usuarios",
          action: "Cambiar contraseña",
          detail: `Contraseña cambiada para usuario ${id}`,
        });

        res.json({
          success: true,
        });
      }
    );
  });
};

const getUserActivity = (req, res) => {
  const { id } = req.params;
  db.all(
    `SELECT * FROM audits WHERE user_id = ? ORDER BY id DESC`,
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json(rows);
    }
  );
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetPassword,
  changePassword,
  getUserActivity,
};
