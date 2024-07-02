// Funcion para dar formato a las fechas mostradas en Read(listado_usuarios) y Delete(eliminar_usuario)
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0-11
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  }