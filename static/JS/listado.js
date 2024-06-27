// const URL = "http://127.0.0.1:5000/"
const URL = "https://sinost.pythonanywhere.com/";

// Realizamos la solicitud GET al servidor para obtener todos los peliculas.
fetch(URL + "pelicula")
  .then(function (response) {
    if (response.ok) {
      //Si la respuesta es exitosa (response.ok), convierte el cuerpo de la respuesta de formato JSON a un objeto JavaScript y pasa estos datos a la siguiente promesa then.
      return response.json();
    } else {
      // Si hubo un error, lanzar explícitamente una excepción para ser "catcheada" más adelante
      throw new Error("Error al obtener las peliculas.");
    }
  })

  //Esta función maneja los datos convertidos del JSON.
  .then(function (data) {
    let tablaPeliculas = document.getElementById("tablaPeliculas"); //Selecciona el elemento del DOM donde se mostrarán los peliculas.

    // Iteramos sobre cada pelicula y agregamos filas a la tabla
    for (let pelicula of data) {
      let fila = document.createElement("tr"); //Crea una nueva fila de tabla (<tr>) para cada pelicula.
      fila.innerHTML =
        '<td class="elementos">' +
        pelicula.codigo +
        "</td>" +
        "<td>" +
        pelicula.nombre +
        "</td>" +
        "<td>" +
        pelicula.genero +
        "</td>" +
        "<td>" +
        pelicula.duracion +
        "</td>" +
        "<td><img src=https://www.pythonanywhere.com/user/Sinost/files/home/Sinost/mysite/static/imagenes/" +
        pelicula.imagen_url +
        ' alt="Imagen de la pelicula" style="width: 100px;"></td>' +
        "<td>" +
        pelicula.atp +
        "</td>" +
        "<td>" +
        pelicula.detalle +
        "</td>";
      //Una vez que se crea la fila con el contenido del pelicula, se agrega a la tabla utilizando el método appendChild del elemento tablaPeliculas.
      tablaPeliculas.appendChild(fila);
    }
  })

  //Captura y maneja errores, mostrando una alerta en caso de error al obtener los peliculas.
  .catch(function (error) {
    // Código para manejar errores
    alert("Error al obtener los peliculas.");
  });
