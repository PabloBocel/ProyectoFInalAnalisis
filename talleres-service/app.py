from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/talleres', methods=['GET'])
def obtener_talleres():
    with open('talleres.json') as f:
        talleres = json.load(f)
    return jsonify(talleres)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
