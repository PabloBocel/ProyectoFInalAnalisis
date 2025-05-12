from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/pagar", methods=["POST"])
def procesar_pago():
    data = request.get_json()
    tarjeta = data.get("numero")
    cvv = data.get("cvv")
    vencimiento = data.get("vencimiento")

    if not (tarjeta and cvv and vencimiento):
        return jsonify({"error": "Faltan datos"}), 400

    if tarjeta.startswith("4") and len(tarjeta) == 16:
        tipo = "Visa"
    elif tarjeta.startswith("5") and len(tarjeta) == 16:
        tipo = "MasterCard"
    else:
        return jsonify({"error": "Tarjeta inválida"}), 400

    if len(cvv) != 3 or not cvv.isdigit():
        return jsonify({"error": "CVV inválido"}), 400

    return jsonify({"mensaje": "Pago aprobado", "tipo": tipo})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

