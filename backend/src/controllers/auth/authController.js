const db = require("../../config/db");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// LOGIN
async function login(
  req,
  res
) {

  try {

    const {
      email,
      password,
    } = req.body;

    // VALIDATION
    if (
      !email ||
      !password
    ) {

      return res.status(400).json({
        error:
          "Todos los campos son obligatorios",
      });
    }

    // FIND USER
    db.get(

      `
      SELECT *
      FROM users
      WHERE email = ?
      `,

      [email],

      async (err, user) => {

        // DB ERROR
        if (err) {

          return res.status(500).json({
            error: err.message,
          });
        }

        // USER NOT FOUND
        if (!user) {

          return res.status(401).json({
            error:
              "Credenciales incorrectas",
          });
        }

        // CHECK PASSWORD
        const validPassword =
          await bcrypt.compare(
            password,
            user.password
          );

        if (!validPassword) {

          return res.status(401).json({
            error:
              "Credenciales incorrectas",
          });
        }

        // TOKEN
        const token = jwt.sign(

          {
            id: user.id,
            email: user.email,
            role: user.role,
          },

          "casamaiz_secret",

          {
            expiresIn: "7d",
          }
        );

        // SUCCESS
        return res.json({

          token,

          user: {

            id: user.id,

            name: user.name,

            email: user.email,

            role: user.role,

          },

        });
      }
    );

  } catch (error) {

    return res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = {
  login,
};