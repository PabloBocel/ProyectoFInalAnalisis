from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Configuración MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Pokemon6+@mysql/mastercook_auth'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa DB
db = SQLAlchemy(app)

# Modelos
class Reserva(db.Model):
    __tablename__ = 'reservas'
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(120), nullable=False)
    taller_id = db.Column(db.Integer, nullable=False)
    estado = db.Column(db.String(50), default='confirmada')
    pagado = db.Column(db.Boolean, default=False)

class Taller(db.Model):
    __tablename__ = 'talleres'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    descripcion = db.Column(db.String(255))
    fecha = db.Column(db.String(20))
    duracion = db.Column(db.String(20))
    precio = db.Column(db.Float)
    cupo = db.Column(db.Integer)
    cupo_total = db.Column(db.Integer)

with app.app_context():
    db.create_all()

# Endpoints
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

    taller = Taller.query.get(taller_id)
    if not taller:
        return jsonify({"error": "Taller no encontrado"}), 404

    if taller.cupo >= taller.cupo_total:
        return jsonify({"error": "No hay cupos disponibles"}), 400

    # Verifica si el usuario ya reservó este taller
    existente = Reserva.query.filter_by(usuario=usuario, taller_id=taller_id).first()
    if existente and existente.estado != 'cancelada':
        return jsonify({"error": "Ya tienes una reserva activa para este taller"}), 400


    reserva = Reserva(usuario=usuario, taller_id=taller_id, estado="confirmada", pagado=True)
    taller.cupo += 1

    db.session.add(reserva)
    db.session.commit()

    return jsonify({"mensaje": "Reserva creada", "reserva_id": reserva.id}), 201

@app.route('/reservas/<int:id>/cancelar', methods=['PUT'])
def cancelar_reserva(id):
    reserva = Reserva.query.get(id)
    if not reserva:
        return jsonify({"error": "Reserva no encontrada"}), 404

    reserva.estado = "cancelada"
    taller = Taller.query.get(reserva.taller_id)
    if taller and taller.cupo > 0:
        taller.cupo -= 1

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
