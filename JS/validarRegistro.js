function validarRegistro() {
  var nombre = document.getElementById("nombre").value;
  var apellido = document.getElementById("apellido").value;
  var email = document.getElementById("email").value;
  var pass = document.getElementById("pass").value;
  var pass_confirm = document.getElementById("pass_confirm").value;
  var celular = document.getElementById("celular").value;
  var fecnac = document.getElementById("fecnac").value;
  var genero = document.getElementById("genero").value;

  var errorNombre = document.getElementById("errorNombre");
  var errorApellido = document.getElementById("errorApellido");
  var errorEmail = document.getElementById("errorEmail");
  var errorPass = document.getElementById("errorPass");
  var errorConfPass = document.getElementById("errorConfPass");
  var errorCelular = document.getElementById("errorCelular");
  var errorNac = document.getElementById("errorNac");
  var errorGenero = document.getElementById("errorGenero");

  var Valid = true;

  // Limpiar mensajes de error previos
  errorNombre.textContent = "";
  errorApellido.textContent = "";
  errorEmail.textContent = "";
  errorPass.textContent = "";
  errorConfPass.textContent = "";
  errorCelular.textContent = "";
  errorNac.textContent = "";
  errorGenero.textContent = "";

  // Validar el campo de nombre
  if (nombre === "") {
    errorNombre.textContent = "Por favor, ingrese su nombre.";
    Valid = false;
  }

  if (apellido === "") {
    errorApellido.textContent = "Por favor, ingrese su apellido.";
    Valid = false;
  }

  // Validar el campo de correo electrónico
  if (email === "") {
    errorEmail.textContent = "Por favor, ingrese su correo electrónico.";
    Valid = false;
  } else if (!validarEmail(email)) {
    errorEmail.textContent = "Por favor, ingrese una dirección de correo electrónico válida.";
    Valid = false;
  }
  if (pass === "") {
    errorPass.textContent = "Por favor, ingrese una contraseña.";
    Valid = false;
  }
  if (pass_confirm === "") {
    errorConfPass.textContent = "Por favor, confirme su contraseña.";
    Valid = false;
  } else if (pass_confirm !== pass) {
    errorConfPass.textContent = "Las contraseñas no coinciden.";
    Valid = false;
  }
  if (celular === "") {
    errorCelular.textContent = "Por favor, ingrese un celular.";
    Valid = false;
  }
  if (fecnac === "") {
    errorNac.textContent = "Por favor, ingrese su fecha de nacimiento.";
    Valid = false;
  }
  if (genero === "") {
    errorGenero.textContent = "Por favor, selecciones su genero.";
    Valid = false;
  }

  return Valid;
}
function validarEmail(email) {
  // Expresión regular para validar el formato de una dirección de correo electrónico
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
