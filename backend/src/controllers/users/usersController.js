const db = require("../../config/db");

const bcrypt = require("bcryptjs");

// GET USERS
const getUsers = (req, res) => {

  const query = `
    SELECT
      id,
      name,
      email,
      role
    FROM users
    ORDER BY id DESC
  `;

  db.all(
    query,
    [],
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

// CREATE USER
const createUser = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // VALIDATION
    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        error:
          "Todos los campos son obligatorios",
      });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const query = `
      INSERT INTO users (
        name,
        email,
        password,
        role
      )
      VALUES (?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        name,
        email,
        hashedPassword,
        role || "employee",
      ],
      function (err) {

        if (err) {

          return res.status(500).json({
            error: err.message,
          });
        }

        res.status(201).json({
          message:
            "Usuario creado correctamente",
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

// DELETE USER
const deleteUser = (
  req,
  res
) => {

  const { id } = req.params;

  const query = `
    DELETE FROM users
    WHERE id = ?
  `;

  db.run(
    query,
    [id],
    function (err) {

      if (err) {

        return res.status(500).json({
          error: err.message,
        });
      }

      res.json({
        message:
          "Usuario eliminado",
      });
    }
  );
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
};