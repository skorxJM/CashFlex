const express = require("express");
const router = express.Router();

const connection = require("./database/db");
router.get("/editIngreso", (req, res) => {
  res.render("editIngreso");
});
router.get("/editGasto", (req, res) => {
  res.render("editGasto");
});

//eliminar gasto

//eliminar ingreso
router.get("/deleteIngreso/:id", (req, res) => {
  const id = req.params.id;

  connection.query(
    "DELETE FROM ingreso WHERE id_Ingresos = ?",

    [id],

    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/listaIng");
      }
    }
  );
});

//editar ingreso
router.get("/editIngreso/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM ingreso WHERE id_Ingresos = ?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("editIngreso", { ingreso: results[0] });
      }
    }
  );
});

//eliminar gasto
router.get("/deleteGasto/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "DELETE FROM gasto WHERE Id_gastos = ?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/listaGas");
      }
    }
  );
});

router.get("/editGasto/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM gasto WHERE Id_gastos = ?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("editGasto", { gasto: results[0] });
      }
    }
  );
});

module.exports = router;
