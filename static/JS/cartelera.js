// URL base de la API
const URL = "https://sinost.pythonanywhere.com/";

// Realizamos la solicitud GET al servidor para obtener todas las películas.
fetch(URL + "pelicula")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error al obtener las películas.");
    }
  })
  .then((data) => {
    let container = document.getElementById("peliculas-container");

    // Iteramos sobre cada película y generamos un elemento <figure> dinámicamente
    for (let pelicula of data) {
      let figure = document.createElement("figure");
      figure.className = "cartelera-figure";

      figure.innerHTML = `
        <a href="https://codocinema.netlify.app/${pelicula.detalle}.html">
            <img src=https://www.pythonanywhere.com/user/Sinost/files/home/Sinost/mysite/static/imagenes/${pelicula.imagen_url} />
            <figcaption>Nombre: ${pelicula.nombre}</figcaption>
            <p>Genero: ${pelicula.genero}</p>
            <p>Duracion: ${pelicula.duracion}min</p>
            <p>ATP: ${pelicula.atp}</p>
            
        </a>
        `;

      // Añadimos la nueva figura al contenedor
      container.appendChild(figure);
    }
  })
  .catch(function (error) {
    // Código para manejar errores
    console.error("Error al obtener las películas:", error);

    // Obtener el elemento por su ID y mostrar el mensaje de error
    let mensajeErrorElemento = document.getElementById("mensajeError");

    if (mensajeErrorElemento) {
      mensajeErrorElemento.textContent = "No se pudieron cargar las películas.";
      mensajeErrorElemento.style.color = "red"; // Opcional: estilo para el mensaje de error
      mensajeErrorElemento.style.textAlign = "center"; // Opcional: estilo para el mensaje de error
    } else {
      console.error("Elemento con id 'mensajeError' no encontrado en el DOM.");
    }
  });
