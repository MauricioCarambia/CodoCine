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
    let container = document.getElementById("tablaPeliculas");

    // Iteramos sobre cada película y generamos un elemento <figure> dinámicamente
    for (let pelicula of data) {
      let figure = document.createElement("figure");
      figure.className = "cartelera-figure";

      figure.innerHTML = `
        <a href="#">
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
  .catch((error) => {
    alert("Error al obtener las películas.");
    console.error("Error:", error);
  });
