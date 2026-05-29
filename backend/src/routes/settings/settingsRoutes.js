const express =
  require("express");

const router =
  express.Router();

const db =
  require("../../config/db");

/* =========================================
   GET SETTINGS
========================================= */

router.get(
  "/",
  (req, res) => {

    db.get(
      `
        SELECT *

        FROM settings

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
    } = req.body;

    db.get(
      `
        SELECT id

        FROM settings

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
              UPDATE settings

              SET
                business_name = ?,
                nit = ?,
                phone = ?,
                address = ?,
                iva = ?,
                logo = ?

              WHERE id = ?
            `,
            [
              business_name,
              nit,
              phone,
              address,
              iva,
              logo,
              existing.id,
            ],

            function (
              updateError
            ) {

              if (
                updateError
              ) {

                console.log(
                  updateError
                );

                return res
                  .status(500)
                  .json({
                    error:
                      "Error actualizando configuración",
                  });
              }

              res.json({
                success:
                  true,
              });
            }
          );

        } else {

          /* CREATE */

          db.run(
            `
              INSERT INTO settings (
                business_name,
                nit,
                phone,
                address,
                iva,
                logo
              )

              VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
              business_name,
              nit,
              phone,
              address,
              iva,
              logo,
            ],

            function (
              insertError
            ) {

              if (
                insertError
              ) {

                console.log(
                  insertError
                );

                return res
                  .status(500)
                  .json({
                    error:
                      "Error guardando configuración",
                  });
              }

              res.json({
                success:
                  true,
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