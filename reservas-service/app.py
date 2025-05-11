from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

RESERVAS_FILE = 'reservas.json'

def leer_reservas():
    if not os.path.exists(RESERVAS_FILE):
        return []
    with open(RESERVAS_FILE, 'r') as f:
        return json.load(f)

def guardar_reservas(data):
    with open(RESERVAS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/reservas', methods=['GET'])
def obtener_reservas():
    usuario = request.args.get('usuario')
    reservas = leer_reservas()
    if usuario:
        reservas = [r for r in reservas if r['usuario'] == usuario]
    return jsonify(reservas)

@app.route('/reservar', methods=['POST'])
def crear_reserva():
    data = request.get_json()
    reservas = leer_reservas()
    nueva_reserva = {
        "id": len(reservas) + 1,
        "usuario": data["usuario"],
        "taller_id": data["taller_id"],
        "estado": "confirmada",
        "pagado": False
    }
    reservas.append(nueva_reserva)
    guardar_reservas(reservas)
    return jsonify({"mensaje": "Reserva creada", "reserva": nueva_reserva}), 201

@app.route('/reservas/<int:id>/cancelar', methods=['PUT'])
def cancelar_reserva(id):
    reservas = leer_reservas()
    for r in reservas:
        if r['id'] == id:
            r['estado'] = 'cancelada'
            guardar_reservas(reservas)
            return jsonify({"mensaje": "Reserva cancelada"})
    return jsonify({"error": "Reserva no encontrada"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)
