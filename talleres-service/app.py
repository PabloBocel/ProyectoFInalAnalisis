from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Pokemon6+@mysql/mastercook_auth'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

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

@app.route('/db-status', methods=['GET'])
def db_status():
    try:
        tablas = inspect(db.engine).get_table_names()
        return jsonify({"mensaje": "Conectado a DB", "tablas": tablas})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/talleres', methods=['GET'])
def listar_talleres():
    talleres = Taller.query.all()
    return jsonify([
        {
            "id": t.id,
            "nombre": t.nombre,
            "categoria": t.categoria,
            "descripcion": t.descripcion,
            "fecha": t.fecha,
            "duracion": t.duracion,
            "precio": t.precio,
            "cupo": t.cupo,
            "cupo_total": t.cupo_total
        } for t in talleres
    ])

@app.route('/talleres', methods=['POST'])
def crear_taller():
    data = request.get_json()

    nuevo = Taller(
        nombre=data['nombre'],
        categoria=data['categoria'],
        descripcion=data.get('descripcion', ''),
        fecha=data.get('fecha', ''),
        duracion=data.get('duracion', ''),
        precio=data.get('precio', 0),
        cupo=data.get('cupo', 0),
        cupo_total=data.get('cupo_total', 0)
    )
    db.session.add(nuevo)
    db.session.commit()

    return jsonify({"mensaje": "Taller creado", "id": nuevo.id}), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
