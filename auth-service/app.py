from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

app = Flask(__name__)
CORS(app)

# Configuración de conexión a MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Pokemon6+@mysql/mastercook_auth'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo de Usuario
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

# Crear la tabla si no existe
with app.app_context():
    db.create_all()

# 🛠 Ruta para verificar conexión y ver tablas
@app.route('/db-status', methods=['GET'])
def verificar_db():
    try:
        inspector = inspect(db.engine)
        tablas = inspector.get_table_names()
        return jsonify({
            "mensaje": "Conexión exitosa a la base de datos",
            "tablas": tablas
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Error al conectar con la base de datos",
            "detalle": str(e)
        }), 500

# 🔎 Obtener todos los usuarios registrados
@app.route('/usuarios', methods=['GET'])
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([
        {
            "id": u.id,
            "nombre": u.nombre,
            "email": u.email
        } for u in usuarios
    ])

# 🔐 Registro de usuario
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    nombre = data.get("nombre", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not all([nombre, email, password]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"error": "Usuario ya registrado"}), 400

    nuevo_usuario = Usuario(nombre=nombre, email=email, password=password)
    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({"message": f"Usuario {nombre} registrado con éxito"}), 201

# 🔓 Inicio de sesión
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Faltan campos"}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or usuario.password != password:
        return jsonify({"error": "Credenciales inválidas"}), 401

    return jsonify({"message": f"Bienvenido {usuario.nombre}"}), 200

# 🚀 Iniciar la app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
