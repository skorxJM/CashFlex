var mysql = require("mysql");


var conexion  = mysql.createConnection({
    host: "localhost",
    database: "CashFlex",
    user: "root",
    password: ""

});

conexion.connect(function(error){

if(error){

    throw error;

}  else{
    console.log("conexion exitosa");
} 


});
