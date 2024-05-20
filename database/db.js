const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cashflex",
});

connection.connect((err) => {
  if (err) {
    console.log("Error: " + err);
    return;
  } else {
    console.log("Conexion Exitosa");
  }
});

module.exports = connection;
