// const URL = "http://127.0.0.1:5000/"
const URL = "https://sinost.pythonanywhere.com/";

// Obtiene el contenido del inventario
function obtenerProductos() {
  fetch(URL + "pelicula") // Realiza una solicitud GET al servidor y obtener la lista de productos.
    .then((response) => {
      // Si es exitosa (response.ok), convierte los datos de la respuesta de formato JSON a un objeto JavaScript.
      if (response.ok) {
        return response.json();
      }
    })
    // Asigna los datos de los productos obtenidos a la propiedad productos del estado.
    .then((data) => {
      const productosTable = document.getElementById("productos-table").getElementsByTagName("tbody")[0];
      productosTable.innerHTML = ""; // Limpia la tabla antes de insertar nuevos datos
      data.forEach((pelicula) => {
        const row = productosTable.insertRow();
        row.innerHTML = `
                     <td class="elementos">${pelicula.codigo}</td>
                     <td class="elementos">${pelicula.nombre}</td>
                     <td class="elementos">${pelicula.genero}</td>
                     <td class="elementos">${pelicula.duracion}</td>
                     <td class="elementos formulario"><button class="formulario-input volver" onclick="eliminarProducto('${pelicula.codigo}')">Eliminar</button></td>
                 `;
      });
    })
    // Captura y maneja errores, mostrando una alerta en caso de error al obtener los productos.
    .catch((error) => {
      console.log("Error:", error);
      alert("Error al obtener los productos.");
    });
}

// Se utiliza para eliminar un producto.
function eliminarProducto(codigo) {
  // Se muestra un diálogo de confirmación. Si el usuario confirma, se realiza una solicitud DELETE al servidor a través de fetch(URL + 'productos/${codigo}', {method: 'DELETE' }).
  if (confirm("¿Estás seguro de que quieres eliminar esta pelicula?")) {
    fetch(URL + `pelicula/${codigo}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          // Si es exitosa (response.ok), elimina el producto y da mensaje de ok.
          obtenerProductos(); // Vuelve a obtener la lista de productos para actualizar la tabla.
          alert("Pelicula eliminada correctamente.");
        }
      })
      // En caso de error, mostramos una alerta con un mensaje de error.
      .catch((error) => {
        alert(error.message);
      });
  }
}

// Cuando la página se carga, llama a obtenerProductos para cargar la lista de productos.
document.addEventListener("DOMContentLoaded", obtenerProductos);
