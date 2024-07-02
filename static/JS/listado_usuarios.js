const URL = "http://127.0.0.1:5000/"
//const URL = "https://sinost.pythonanywhere.com/";

// Realizamos la solicitud GET al servidor para obtener todos los peliculas.
fetch(URL + "usuario")
  .then(function (response) {
    if (response.ok) {
      //Si la respuesta es exitosa (response.ok), convierte el cuerpo de la respuesta de formato JSON a un objeto JavaScript y pasa estos datos a la siguiente promesa then.
      return response.json();
    } else {
      // Si hubo un error, lanzar explícitamente una excepción para ser "catcheada" más adelante
      throw new Error("Error al obtener los usuarios.");
    }
  })

  //Esta función maneja los datos convertidos del JSON.
  .then(function (data) {
    let tablaUsuarios = document.getElementById("tablaUsuarios"); //Selecciona el elemento del DOM donde se mostrarán los peliculas.

    // Iteramos sobre cada pelicula y agregamos filas a la tabla
    for (let usuario of data) {
      let fila = document.createElement("tr"); //Crea una nueva fila de tabla (<tr>) para cada pelicula.
      fila.innerHTML =
        '<td class="elementos">' +
        usuario.id +
        "</td>" +
        "<td>" +
        usuario.nombre +
        "</td>" +
        "<td>" +
        usuario.apellido +
        "</td>" +
        "<td>" +
        usuario.email +
        "</td>" +
        "<td>" +
        usuario.contraseña +
        "</td>" +
        "<td>" +
        usuario.celular +
        "</td>" +
        "<td>" +
        usuario.genero +
        "</td>" +
        "<td>" +
        formatearFecha(usuario.fecha_nacimiento) +
        "</td>"
      //Una vez que se crea la fila con el contenido del pelicula, se agrega a la tabla utilizando el método appendChild del elemento tablaPeliculas.
      tablaUsuarios.appendChild(fila);
    }
  })

  //Captura y maneja errores, mostrando una alerta en caso de error al obtener los peliculas.
  .catch(function (error) {
    // Código para manejar errores
    console.error("Error al obtener las usuarios:", error);

    // Obtener el elemento por su ID y mostrar el mensaje de error
    let mensajeErrorElemento = document.getElementById("mensajeError");

    if (mensajeErrorElemento) {
      mensajeErrorElemento.textContent = "No se pudieron cargar los usuarios.";
      mensajeErrorElemento.style.color = "red"; // Opcional: estilo para el mensaje de error
      mensajeErrorElemento.style.textAlign = "center"; // Opcional: estilo para el mensaje de error
    } else {
      console.error("Elemento con id 'mensajeError' no encontrado en el DOM.");
    }
  });
