from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    return jsonify({"message": f"Usuario {data['email']} registrado"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    return jsonify({"message": f"Usuario {data['email']} logueado"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
