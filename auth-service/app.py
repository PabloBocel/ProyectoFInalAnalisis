from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# 🔧 Inicializar Flask correctamente ANTES de usar 'app'
app = Flask(__name__)
CORS(app)

# 🔌 Configurar conexión a MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Pokemon6+@mysql/mastercook_auth'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 🧠 Inicializar SQLAlchemy
db = SQLAlchemy(app)

# 🧾 Modelo de usuario
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

# 🛠️ Crear las tablas si no existen
with app.app_context():
    db.create_all()

# 🔐 Ruta para registro
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

# 🔓 Ruta para login
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

