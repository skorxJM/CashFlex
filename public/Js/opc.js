window.addEventListener("load", function () {
  // Obtener la fecha actual
  const today = new Date();

  // Asignar la fecha actual al campo de fecha
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  // Formatear el mes y el día para que tengan dos dígitos
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }

  // Crear una cadena con la fecha en formato YYY-MM-DD
  const formattedDate = `${year}-${month}-${day}`;

  // Asignar la fecha formateada al campo de fecha
  document.getElementById("fecha").value = formattedDate;
});




