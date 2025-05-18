from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Pokemon6+@mysql/mastercook_auth'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Reserva(db.Model):
    __tablename__ = 'reservas'
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(120), nullable=False)
    taller_id = db.Column(db.Integer, nullable=False)
    estado = db.Column(db.String(50), default='confirmada')
    pagado = db.Column(db.Boolean, default=False)

with app.app_context():
    db.create_all()

@app.route('/db-status', methods=['GET'])
def db_status():
    try:
        tablas = inspect(db.engine).get_table_names()
        return jsonify({"mensaje": "Conectado a DB", "tablas": tablas})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/reservas', methods=['GET'])
def obtener_reservas():
    usuario = request.args.get('usuario')
    if not usuario:
        return jsonify({"error": "Usuario requerido"}), 400
    reservas = Reserva.query.filter_by(usuario=usuario).all()
    return jsonify([
        {
            "id": r.id,
            "usuario": r.usuario,
            "taller_id": r.taller_id,
            "estado": r.estado,
            "pagado": r.pagado
        } for r in reservas
    ])

@app.route('/reservar', methods=['POST'])
def crear_reserva():
    data = request.get_json()
    usuario = data.get('usuario')
    taller_id = data.get('taller_id')

    if not usuario or not taller_id:
        return jsonify({"error": "Datos incompletos"}), 400

    reserva = Reserva(usuario=usuario, taller_id=taller_id)
    db.session.add(reserva)
    db.session.commit()

    return jsonify({"mensaje": "Reserva creada", "reserva_id": reserva.id})

@app.route('/reservas/<int:id>/cancelar', methods=['PUT'])
def cancelar_reserva(id):
    reserva = Reserva.query.get(id)
    if not reserva:
        return jsonify({"error": "Reserva no encontrada"}), 404
    reserva.estado = "cancelada"
    db.session.commit()
    return jsonify({"mensaje": "Reserva cancelada"})

@app.route('/reservas/<int:id>/pagar', methods=['PUT'])
def pagar_reserva(id):
    reserva = Reserva.query.get(id)
    if not reserva:
        return jsonify({"error": "Reserva no encontrada"}), 404
    reserva.pagado = True
    db.session.commit()
    return jsonify({"mensaje": "Pago registrado"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
