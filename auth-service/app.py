from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simulación de base de datos en memoria (más adelante será MySQL)
users = {}

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    
    if email in users:
        return jsonify({"error": "Usuario ya registrado"}), 400
    
    users[email] = password
    return jsonify({"message": f"Usuario {email} registrado"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    
    if users.get(email) != password:
        return jsonify({"error": "Credenciales inválidas"}), 401

    return jsonify({"message": f"Usuario {email} logueado"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
