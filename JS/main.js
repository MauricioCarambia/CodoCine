const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
  nav.classList.add("visible");
});

cerrar.addEventListener("click", () => {
  nav.classList.remove("visible");
});

function mostrarInfo(){
  let pelicula =  document.getElementById("selection-peli").value;
  let info = document.getElementById("compraInfo");
  let portadaImg = document.getElementById("portadaImagen");
  let titulo = document.getElementById("tituloFilm");
  switch(pelicula){
    case "Film 1":
      titulo.textContent = "Forest Gump";
      info.style.display = "grid";
      portadaImg.src = "/img/forest.jpg";
      break;
    case "Film 2":
      info.style.display = "grid";
      portadaImg.src = "/img/gladiador.jpg";
      titulo.textContent = "Gladiador";
      break;
    case "Film 3":
      info.style.display = "grid";
      titulo.textContent = "Rapidos Y Furiosos";
      portadaImg.src = "/img/rapido.webp";
      break;
      
  }
}