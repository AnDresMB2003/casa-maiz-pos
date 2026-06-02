const express =
  require("express");

const path =
  require("path");

const router =
  express.Router();

const db =
  require("../../config/db");

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const dbPath = path.resolve(
  __dirname,
  "../../database/casamaiz.db"
);

/* =========================================
   GET SETTINGS
========================================= */

router.get(
  "/",
  (req, res) => {

    db.get(
      `
        SELECT *
        FROM business_settings
        LIMIT 1
      `,
      [],
      (err, row) => {

        if (err) {

          console.log(err);

          return res
            .status(500)
            .json({
              error:
                "Error obteniendo configuración",
            });
        }

        if (!row) {

          return res.json({
            business_name:
              "CASA MAÍZ",

            nit:
              "",

            phone:
              "",

            address:
              "",

            iva:
              19,

            logo:
              "",

            currency:
              "COP",

            theme:
              "dark",

            invoice_prefix:
              "FAC",
          });
        }

        res.json(row);
      }
    );
  }
);

/* =========================================
   SAVE SETTINGS
========================================= */

router.post(
  "/",
  (req, res) => {

    const {
      business_name,
      nit,
      phone,
      address,
      iva,
      logo,
      currency,
      theme,
      invoice_prefix,
    } = req.body;

    db.get(
      `
        SELECT id
        FROM business_settings
        LIMIT 1
      `,
      [],
      (
        err,
        existing
      ) => {

        if (err) {

          console.log(err);

          return res
            .status(500)
            .json({
              error:
                "Error verificando configuración",
            });
        }

        /* UPDATE */

        if (existing) {

          db.run(
            `
              UPDATE business_settings
              SET
                business_name = ?,
                nit = ?,
                phone = ?,
                address = ?,
                iva = ?,
                logo = ?,
                currency = ?,
                theme = ?,
                invoice_prefix = ?
              WHERE id = ?
            `,
            [
              business_name,
              nit,
              phone,
              address,
              iva,
              logo,
              currency,
              theme,
              invoice_prefix,
              existing.id,
            ],
            (updateErr) => {

              if (updateErr) {

                console.log(updateErr);

                return res
                  .status(500)
                  .json({
                    error:
                      "Error actualizando configuración",
                  });
              }

              return res.json({
                success: true,
                message:
                  "Configuración actualizada correctamente",
              });
            }
          );

        } else {

          /* CREATE */

          db.run(
            `
              INSERT INTO business_settings (
                business_name,
                nit,
                phone,
                address,
                logo,
                iva,
                currency,
                theme,
                invoice_prefix
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              business_name,
              nit,
              phone,
              address,
              logo,
              iva,
              currency,
              theme,
              invoice_prefix,
            ],
            (insertErr) => {

              if (insertErr) {

                console.log(insertErr);

                return res
                  .status(500)
                  .json({
                    error:
                      "Error creando configuración",
                  });
              }

              return res.json({
                success: true,
                message:
                  "Configuración guardada correctamente",
              });
            }
          );
        }
      }
    );
  }
);

module.exports =
  router;