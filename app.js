const exp = require("constants");
const express = require("express");
const app = express();

app.use("/", require("./router"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

app.use(
  "/editIngreso/resources",
  express.static("public", { extensions: ["css", "js"] })
);
app.use(
  "/editGasto/resources",
  express.static("public", { extensions: ["css", "js"] })
);

app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

app.set("view engine", "ejs");

const bcryptjs = require("bcryptjs");

const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

const connection = require("./database/db");

app.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.render("home", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      login: false,
      name: "Debe iniciar Sesión",
    });
  }
});
app.get("/index", (req, res) => {
  res.render("index", {
    login: req.session.loggedin,
    name: req.session.name,
    email: req.session.email,
  });
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/ingresos", (req, res) => {
  res.render("ingresos");
});
app.get("/gastos", (req, res) => {
  res.render("gastos");
});
app.get("/metas", (req, res) => {
  res.render("metas");
});
app.get("/register-or-home", (req, res) => {
  if (req.session.loggedin) {
    res.redirect("/home");
  } else {
    res.redirect("/register");
  }
});

// Registro
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  let passwordHash = await bcryptjs.hash(password, 8);
  connection.query(
    "INSERT INTO usuario SET ?",
    {
      username: username,
      email: email,
      password: passwordHash,
    },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render("register", {
          alert: true,
          alertTitle: "Registro",
          alertMessage: "¡Registro exitoso!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1000,
          ruta: "",
        });
      }
    }
  );
});

// Autentificacion
app.post("/auth", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let passwordHash = await bcryptjs.hash(password, 8);
  if (username && password) {
    connection.query(
      "SELECT * FROM usuario WHERE username = ?",
      [username],
      async (error, results) => {
        if (
          results.length == 0 ||
          !(await bcryptjs.compare(password, results[0].password))
        ) {
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o contraseña incorrectos",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "login",
          });
        } else {
          req.session.loggedin = true;
          req.session.id_usu = results[0].id_usu;
          req.session.name = results[0].username;
          req.session.email = results[0].email;
          res.render("login", {
            alert: true,
            alertTitle: "Ingreso",
            alertMessage: "¡Ingreso Exitoso!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1000,
            ruta: "home",
          });
        }
      }
    );
  }
});

// Registro de ingreso
app.post("/registrarIngreso", async (req, res) => {
  const fecha = req.body.fecha;
  const descripcion = req.body.descripcion;
  const cantidad = req.body.cantidad;
  const id_usu = req.session.id_usu;

  connection.query(
    "INSERT INTO ingreso SET ?",
    {
      fecha: fecha,
      Descripcion: descripcion,
      cantidad: cantidad,
      Usuario_id_usu: id_usu,
    },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render("ingresos", {
          alert: true,
          alertTitle: "Ingreso",
          alertMessage: "¡Ingreso registrado correctamente!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "ingresos",
        });
      }
    }
  );
});

//lista de ingresos
app.get("/listaIng", (req, res) => {
  const id_usu = req.session.id_usu;
  const sql = "SELECT * FROM ingreso WHERE Usuario_id_usu = ?";
  connection.query(sql, [id_usu], (err, results) => {
    if (err) {
      // Manejo de errores
      return res.status(500).send("Error al obtener el historial");
    }
    // Renderizar la página HTML con los resultados
    res.render("listaIng", { ingresos: results });
  });
});

app.post("/updateIngreso", async (req, res) => {
  const fecha = req.body.fecha;
  const descripcion = req.body.descripcion;
  const cantidad = req.body.cantidad;
  const id_Ingresos = req.body.id_Ingresos;

  connection.query(
    "UPDATE ingreso SET ? WHERE id_Ingresos = ?",
    [
      { fecha: fecha, Descripcion: descripcion, cantidad: cantidad },
      id_Ingresos,
    ],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/listaIng");
      }
    }
  );
});

// Registro de gasto
app.post("/registrarGasto", async (req, res) => {
  const fecha = req.body.fecha;
  const descripcion = req.body.descripcion;
  const cantidad = req.body.cantidad;
  const id_usu = req.session.id_usu;

  connection.query(
    "INSERT INTO gasto SET ?",
    {
      fecha: fecha,
      Descripcion: descripcion,
      cantidad: cantidad,
      Usuario_id_usu: id_usu,
    },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render("gastos", {
          alert: true,
          alertTitle: "Gasto",
          alertMessage: "¡Gasto registrado correctamente!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "gastos",
        });
      }
    }
  );
});

//lista gastos
app.get("/listaGas", (req, res) => {
  const id_usu = req.session.id_usu;
  const sql = "SELECT * FROM gasto WHERE Usuario_id_usu = ?";
  connection.query(sql, [id_usu], (err, results) => {
    if (err) {
      // Manejo de errores
      return res.status(500).send("Error al obtener el historial");
    }
    // Renderizar la página HTML con los resultados
    res.render("listaGas", { gastos: results });
  });
});

app.post("/updateGasto", async (req, res) => {
  const fecha = req.body.fecha;
  const descripcion = req.body.descripcion;
  const cantidad = req.body.cantidad;
  const Id_gastos = req.body.id_gastos;

  connection.query(
    "UPDATE gasto SET ? WHERE id_gastos = ?",
    [{ fecha: fecha, Descripcion: descripcion, cantidad: cantidad }, Id_gastos],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/listaGas");
      }
    }
  );
});

// Get total ingresos and total gastos
app.get("/informes", async (req, res) => {
  if (!req.session.id_usu) {
    return res.redirect("/login"); // Redirige al usuario al login si no está autenticado
  }

  const id_usu = req.session.id_usu;

  const totalIngresos = await new Promise((resolve, reject) => {
    connection.query(
      "SELECT SUM(cantidad) as total FROM ingreso WHERE Usuario_id_usu = ?",
      [id_usu],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].total || 0);
        }
      }
    );
  });

  const totalGastos = await new Promise((resolve, reject) => {
    connection.query(
      "SELECT SUM(cantidad) as total FROM gasto WHERE Usuario_id_usu = ?",
      [id_usu],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].total || 0);
        }
      }
    );
  });

  const dailyIngresos = await new Promise((resolve, reject) => {
    connection.query(
      "SELECT fecha, SUM(cantidad) as total FROM ingreso WHERE Usuario_id_usu = ? GROUP BY fecha",
      [id_usu],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });

  const dailyGastos = await new Promise((resolve, reject) => {
    connection.query(
      "SELECT fecha, SUM(cantidad) as total FROM gasto WHERE Usuario_id_usu = ? GROUP BY fecha",
      [id_usu],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });

  const dailyIncomeDates = dailyIngresos.map((row) => row.fecha);
  const dailyIncomeAmounts = dailyIngresos.map((row) => row.total);
  const dailyExpenseDates = dailyGastos.map((row) => row.fecha);
  const dailyExpenseAmounts = dailyGastos.map((row) => row.total);

  console.log("Daily Ingresos Results: ", dailyIngresos);
  console.log("Daily Gastos Results: ", dailyGastos);
  console.log("Daily Income Dates: ", dailyIncomeDates);
  console.log("Daily Income Amounts: ", dailyIncomeAmounts);
  console.log("Daily Expense Dates: ", dailyExpenseDates);
  console.log("Daily Expense Amounts: ", dailyExpenseAmounts);

  res.render("informes", {
    totalIngresos,
    totalGastos,
    dailyIncomeDates,
    dailyIncomeAmounts,
    dailyExpenseDates,
    dailyExpenseAmounts,
  });
});

app.get("/home", (req, res) => {
  if (req.session.loggedin) {
    res.render("home", {
      login: true,
      name: req.session.name,
      email: req.session.email,
    });
  } else {
    res.render("home", {
      login: false,
      name: "Debe iniciar Sesión",
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(3000, (req, res) => {
  console.log("Servidor creado http://localhost:3000");
});
