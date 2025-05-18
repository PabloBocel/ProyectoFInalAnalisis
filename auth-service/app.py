from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simulación de base de datos (se reemplazará con MySQL luego)
users = {}

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")

    if not all([nombre and nombre.strip(), email and email.strip(), password and password.strip()]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    email = email.strip().lower()

    if email in users:
        return jsonify({"error": "Usuario ya registrado"}), 400

    users[email] = {
        "nombre": nombre.strip(),
        "password": password.strip()
    }

    return jsonify({"message": f"Usuario {nombre.strip()} registrado con éxito"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Faltan campos"}), 400

    usuario = users.get(email)
    if not usuario or usuario["password"] != password:
        return jsonify({"error": "Credenciales inválidas"}), 401

    return jsonify({"message": f"Bienvenido {usuario['nombre']}"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
