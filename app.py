#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import Flask, request, jsonify

# Instalar con pip install flask-cors
from flask_cors import CORS, cross_origin

# Instalar con pip install mysql-connector-python
import mysql.connector

# Si es necesario, pip install Werkzeug
from werkzeug.utils import secure_filename

# No es necesario instalar, es parte del sistema standard de Python
import os
import time
#--------------------------------------------------------------------

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})  # Esto habilitará CORS para todas las rutas

class Catalogo:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        self.cursor = self.conn.cursor()
        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            # Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS pelicula (
            codigo INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            genero VARCHAR(255) NOT NULL,
            duracion int NOT NULL,
            imagen_url VARCHAR(255),
            atp VARCHAR(255),
            detalle VARCHAR(255))''')
        self.conn.commit()

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def listar_pelicula(self):
        self.cursor.execute("SELECT * FROM pelicula")
        pelicula = self.cursor.fetchall()
        return pelicula
    
    def consultar_pelicula(self, codigo):
        # Consultamos un producto a partir de su código
        self.cursor.execute(f"SELECT * FROM pelicula WHERE codigo = {codigo}")
        return self.cursor.fetchone()

    def agregar_pelicula(self, nombre, genero, duracion, imagen, atp, detalle):
        sql = "INSERT INTO pelicula (nombre, genero, duracion, imagen_url, atp, detalle) VALUES (%s, %s, %s, %s, %s, %s)"
        valores = (nombre, genero, duracion, imagen, atp, detalle)
        self.cursor.execute(sql,valores)
        self.conn.commit()
        return self.cursor.lastrowid

    def modificar_pelicula(self, codigo, nueva_nombre, nueva_genero, nuevo_duracion, nueva_imagen, nuevo_atp, nuevo_detalle):
        sql = "UPDATE pelicula SET nombre = %s, genero = %s, duracion = %s, imagen_url = %s, atp = %s, detalle = %s WHERE codigo = %s"
        valores = (nueva_nombre, nueva_genero, nuevo_duracion, nueva_imagen, nuevo_atp, nuevo_detalle, codigo)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    def eliminar_pelicula(self, codigo):
        # Eliminamos un producto de la tabla a partir de su código
        self.cursor.execute(f"DELETE FROM pelicula WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0

#----------------------------------------------------------------------------
# Usuarios test
#----------------------------------------------------------------------------
class Usuario:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
        )
        self.cursor = self.conn.cursor(dictionary=True)
        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            # Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS usuario (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            apellido VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            contraseña VARCHAR(255) NOT NULL,
            celular INT NOT NULL,
            genero ENUM('Masculino', 'Femenino', 'Otro', 'Noindica'),
            fecha_nacimiento DATE NOT NULL)''')
        self.conn.commit()

        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def listar_usuarios(self):
        self.cursor.execute("SELECT * FROM usuario")
        usuarios = self.cursor.fetchall()
        return usuarios
    
    def consultar_usuario(self, id):
        self.cursor.execute(f"SELECT * FROM usuario WHERE id = {id}")
        return self.cursor.fetchone()

    def agregar_usuario(self, nombre, apellido, email, contraseña, celular, genero, fecha_nacimiento):
        sql = "INSERT INTO usuario (nombre, apellido, email, contraseña, celular, genero, fecha_nacimiento) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        valores = (nombre, apellido, email, contraseña, celular, genero, fecha_nacimiento)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid

    def modificar_usuario(self, id, nuevo_nombre, nuevo_apellido, nuevo_email, nuevo_password, nuevo_celular, nuevo_genero, nuevo_fecha_nacimiento):
        sql = "UPDATE usuario SET nombre = %s, apellido = %s, email = %s, contraseña = %s, celular = %s, genero = %s, fecha_nacimiento = %s WHERE id = %s"
        valores = (nuevo_nombre, nuevo_apellido, nuevo_email, nuevo_password, nuevo_celular, nuevo_genero, nuevo_fecha_nacimiento, id)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    def eliminar_usuario(self, id):
        self.cursor.execute(f"DELETE FROM usuario WHERE id = {id}")
        self.conn.commit()
        return self.cursor.rowcount > 0

#--------------------------------------------------------------------
# Cuerpo del programa
#--------------------------------------------------------------------
# Crear una instancia de la clase Catalogo
catalogo = Catalogo(host="localhost", user="root", password="", database="pelicula")
# catalogo = Catalogo(host='Sinost.mysql.pythonanywhere-services.com', user='Sinost', password='cinemaCodo', database='Sinost$cinema')

# Carpeta para guardar las imagenes
ruta_destino = './static/imagenes/'
#ruta_destino = '/home/Sinost/mysite/static/imagenes/'

@app.route("/pelicula", methods=["GET"])
def listar_pelicula():
    pelicula = catalogo.listar_pelicula()
    return jsonify(pelicula)

@app.route("/pelicula/<int:codigo>", methods=["GET"])
def mostrar_pelicula(codigo):
    pelicula = catalogo.consultar_pelicula(codigo)
    if pelicula:
        return jsonify(pelicula)
    else:
        return "Pelicula no encontrado", 404

@app.route("/pelicula", methods=["POST"])
def agregar_pelicula():
    #Recojo los datos del form
    nombre = request.form['nombre']
    genero = request.form['genero']
    duracion = request.form['duracion']
    imagen = request.files['imagen']
    atp = request.form['atp']
    detalle = request.form['detalle']
    nombre_imagen = ""

    # Genero el nombre de la imagen
    nombre_imagen = secure_filename(imagen.filename) 
    nombre_base, extension = os.path.splitext(nombre_imagen) 
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" 

    nuevo_codigo = catalogo.agregar_pelicula(nombre, genero, duracion, nombre_imagen, atp, detalle)
    if nuevo_codigo:    
        imagen.save(os.path.join(ruta_destino, nombre_imagen))
        return jsonify({"mensaje": "Pelicula agregada correctamente.", "codigo": nuevo_codigo, "imagen": nombre_imagen}), 201
    else:
        return jsonify({"mensaje": "Error al agregar la pelicula."}), 500

@app.route("/pelicula/<int:codigo>", methods=["PUT"])
def modificar_pelicula(codigo):
    #Se recuperan los nuevos datos del formulario
    nueva_nombre = request.form.get("nombre")
    nueva_genero = request.form.get("genero")
    nuevo_duracion = request.form.get("duracion")
    nuevo_atp = request.form.get("atp")
    nuevo_detalle = request.form.get("detalle")
    
    # Verifica si se proporcionó una nueva imagen
    if 'imagen' in request.files:
        imagen = request.files['imagen']
        # Procesamiento de la imagen
        nombre_imagen = secure_filename(imagen.filename) 
        nombre_base, extension = os.path.splitext(nombre_imagen) 
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" 

        # Guardar la imagen en el servidor
        imagen.save(os.path.join(ruta_destino, nombre_imagen))
        
        # Busco el producto guardado
        pelicula = catalogo.consultar_pelicula(codigo)
        if pelicula: # Si existe el producto...
            imagen_vieja = pelicula["imagen_url"]
            # Armo la ruta a la imagen
            ruta_imagen = os.path.join(ruta_destino, imagen_vieja)

            # Y si existe la borro.
            if os.path.exists(ruta_imagen):
                os.remove(ruta_imagen)
    else:     
        pelicula = catalogo.consultar_pelicula(codigo)
        if pelicula:
            nombre_imagen = pelicula["imagen_url"]

# Se llama al método modificar_producto pasando el codigo del producto y los nuevos datos.
    if catalogo.modificar_pelicula(codigo, nueva_nombre, nueva_genero, nuevo_duracion, nombre_imagen, nuevo_atp, nuevo_detalle):
        return jsonify({"mensaje": "pelicula modificada"}), 200
    else:
        return jsonify({"mensaje": "pelicula no encontrada"}), 403

@app.route("/pelicula/<int:codigo>", methods=["DELETE"])
def eliminar_pelicula(codigo):
    # Primero, obtiene la información del producto para encontrar la imagen
    pelicula = catalogo.consultar_pelicula(codigo)
    if pelicula:
        # Eliminar la imagen asociada si existe
        ruta_imagen = os.path.join(ruta_destino, pelicula['imagen_url'])
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

        # Luego, elimina el producto del catálogo
        if catalogo.eliminar_pelicula(codigo):
            return jsonify({"mensaje": "pelicula eliminada"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar la pelicula"}), 500
    else:
        return jsonify({"mensaje": "pelicula no encontrada"}), 404

#----------------------------------------------------------------------------
# Usuarios test
#----------------------------------------------------------------------------
usuario = Usuario(host="localhost", user="root", password="", database="usuario")
@app.route("/usuario", methods=["GET"])
@cross_origin()
def listar_usuarios():
    usuarios = usuario.listar_usuarios()
    return jsonify(usuarios)

@app.route("/usuario/<int:id>", methods=["GET"])
@cross_origin()
def mostrar_usuario(id):
    usuario_data = usuario.consultar_usuario(id)
    if usuario_data:
        return jsonify(usuario_data)
    else:
        return "Usuario no encontrado", 404

@app.route("/usuario", methods=["POST"])
@cross_origin()
def agregar_usuario():
    print(request.form)
    nombre = request.form['nombre']
    apellido = request.form['apellido']
    email = request.form['email']
    contraseña = request.form['pass']
    celular = request.form['celular']
    genero = request.form['genero']
    fecha_nacimiento = request.form['fecnac']
    nuevo_id = usuario.agregar_usuario(nombre, apellido, email, contraseña, celular, genero, fecha_nacimiento)
    if nuevo_id:
        return jsonify({"mensaje": "Usuario agregado correctamente.", "id": nuevo_id}), 201
    else:
        return jsonify({"mensaje": "Error al agregar el usuario."}), 500

@app.route("/usuario/<int:id>", methods=["PUT"])
@cross_origin()
def modificar_usuario(id):
    nuevo_nombre = request.form.get("nombre")
    nuevo_apellido = request.form.get("apellido")
    nuevo_email = request.form.get("email")
    nuevo_password = request.form.get("password")
    nuevo_celular = request.form.get("celular")
    nuevo_genero = request.form.get("genero")
    nuevo_fecha_nacimiento = request.form.get("fecha_nacimiento")
    if usuario.modificar_usuario(id, nuevo_nombre, nuevo_apellido, nuevo_email, nuevo_password, nuevo_celular, nuevo_genero, nuevo_fecha_nacimiento):
        return jsonify({"mensaje": "Usuario modificado"}), 200
    else:
        return jsonify({"mensaje": "Usuario no encontrado"}), 403

@app.route("/usuario/<int:id>", methods=["DELETE"])
@cross_origin()
def eliminar_usuario(id):
    if usuario.eliminar_usuario(id):
        return jsonify({"mensaje": "Usuario eliminado"}), 200
    else:
        return jsonify({"mensaje": "Usuario no encontrado"}), 404




if __name__ == "__main__":
    app.run(debug=True)