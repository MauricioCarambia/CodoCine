const URL = "http://127.0.0.1:5000/"
//const URL = "https://sinost.pythonanywhere.com/";

// Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
//const URL = "https://USUARIO.pythonanywhere.com/"

// Funcion para convertir la fecha al mismo formato y se muestre correctamente en el formulario
function convertirFecha(fecha) {
  const date = new Date(fecha);
  const año = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}
// Variables de estado para controlar la visibilidad y los datos del formulario
let codigo = "";
let nombre = "";
let apellido = "";
let email = "";
let contraseña = "";
let celular = "";
let genero = "";
let fecha_nacimiento = "";
let mostrarDatosProducto = false;

document.getElementById("form-obtener-usuario").addEventListener("submit", obtenerUsuario);
document.getElementById("form-guardar-cambios").addEventListener("submit", guardarCambios);


// Se ejecuta cuando se envía el formulario de consulta. Realiza una solicitud GET a la API y obtiene los datos del producto correspondiente al código ingresado.
function obtenerUsuario(event) {
  event.preventDefault();
  codigo = document.getElementById("codigo").value;
  fetch(URL + "usuario/" + codigo)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al obtener los datos del usuario.");
      }
    })
    .then((data) => {
      nombre = data.nombre;
      apellido = data.apellido;
      email = data.email;
      contraseña = data.contraseña;
      celular = data.celular;
      genero = data.genero;
      fecha_nacimiento = data.fecha_nacimiento;
      mostrarDatosProducto = true; //Activa la vista del segundo formulario
      mostrarFormulario();
    })
    .catch((error) => {
      let mensajeErrorElemento = document.getElementById("mensajeError");

      if (mensajeErrorElemento) {
        mensajeErrorElemento.textContent = "No se encontro la pelicula";
        mensajeErrorElemento.style.color = "red"; // Opcional: estilo para el mensaje de error
        mensajeErrorElemento.style.textAlign = "center"; // Opcional: estilo para el mensaje de error
      }
    });
}

// Muestra el formulario con los datos del producto
function mostrarFormulario() {
  if (mostrarDatosProducto) {
    document.getElementById("nombreModificar").value = nombre;
    document.getElementById("apellidoModificar").value = apellido;
    document.getElementById("emailModificar").value = email;
    document.getElementById("passModificar").value = contraseña;
    document.getElementById("celularModificar").value = celular;
    document.getElementById("generoModificar").value = genero;
    document.getElementById("fecnacModificar").value = convertirFecha(fecha_nacimiento);;

    document.getElementById("datos-producto").style.display = "block";
  } else {
    document.getElementById("datos-producto").style.display = "none";
  }
}

// Se usa para enviar los datos modificados del producto al servidor.
function guardarCambios(event) {
  event.preventDefault();

  if (!validarModificacionUser()) {
    return; // Detener la ejecución si la validación falla
  }
  
  const formData = new FormData();
  formData.append("codigo", codigo);
  formData.append("nombre", document.getElementById("nombreModificar").value);
  formData.append("apellido", document.getElementById("apellidoModificar").value);
  formData.append("email", document.getElementById("emailModificar").value);
  formData.append("password", document.getElementById("passModificar").value);
  formData.append("celular", document.getElementById("celularModificar").value);
  formData.append("genero", document.getElementById("generoModificar").value);
  formData.append("fecha_nacimiento", document.getElementById("fecnacModificar").value);

  // Imprimir los datos del formulario antes de enviarlos
  for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
  }

  fetch(URL + "usuario/" + codigo, {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al guardar los cambios del usuario.");
      }
    })
    .then((data) => {
      let mensajeErrorElemento = document.getElementById("mensajeError");
      if (mensajeErrorElemento) {
        mensajeErrorElemento.textContent = "Usuario modificado";
        mensajeErrorElemento.style.color = "red"; // Opcional: estilo para el mensaje de error
        mensajeErrorElemento.style.textAlign = "center"; // Opcional: estilo para el mensaje de error
      }
      limpiarFormulario();
    })
    .catch(function (error) {
      // Código para manejar errores
      console.error("Error al obtener los usuarios:", error);

      // Obtener el elemento por su ID y mostrar el mensaje de error
      let mensajeErrorElemento = document.getElementById("mensajeError");

      if (mensajeErrorElemento) {
        mensajeErrorElemento.textContent = "No se pudo modificar el usuario";
        mensajeErrorElemento.style.color = "red"; // Opcional: estilo para el mensaje de error
        mensajeErrorElemento.style.textAlign = "center"; // Opcional: estilo para el mensaje de error
      } else {
        console.error("Elemento con id 'mensajeError' no encontrado en el DOM.");
      }
    });
}

// Restablece todas las variables relacionadas con el formulario a sus valores iniciales, lo que efectivamente "limpia" el formulario.
function limpiarFormulario() {
  document.getElementById("codigo").value = "";
  document.getElementById("nombreModificar").value = "";
  document.getElementById("apellidoModificar").value = "";
  document.getElementById("emailModificar").value = "";
  document.getElementById("passModificar").value = "";
  document.getElementById("celularModificar").value = "";
  document.getElementById("generoModificar").value = "";
  document.getElementById("fecnacModificar").value = "";

  codigo = "";
  nombre = "";
  apellido = "";
  email = "";
  contraseña = "";
  celular = "";
  genero = "";
  fecha_nacimiento = "";
  mostrarDatosProducto = false;

  document.getElementById("datos-producto").style.display = "none";
}
