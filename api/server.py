"""
API simple para visualizar los ladrilleros de cordoba
desarrollado en el hack(at)ONG 2016
"""

from __future__ import print_function, division
import json
from math import sqrt
from datetime import datetime

from flask import Flask, jsonify, make_response, request, abort

from utils import read4json, save2json


# creacion del server
app = Flask(__name__)


@app.route("/api/v1.0/datos/<elemento>/", methods=['GET'])
def get_datos(elemento):
    """
    Retorna un GeoJSON con los datos de alguno de los
    elementos posibles (cortaderos, salud o educacion).

    Parameter
    ---------
    elemento: str
      Elemento a obtener. Puede ser cortaderos, salud, educacion

    Return
    ------
    data: geojson
      GeoJSON con los datos sobre el elemento.
    """
    elementos_posibles = ['cortaderos', 'salud', 'educacion']
    elemento = elemento.lower()

    if elemento not in elementos_posibles:
        abort(404)

    path = "../datos/{0}.geojson".format(elemento)
    data = read4json(path)

    return jsonify(data)


@app.route("/api/v1.0/datos/modificar/", methods=['POST'])
def nuevo_elemento():
    """
    Crear un nuevo elemento.

    Request
    -------
    elemento: str
      Tipo de elemento: cortaderos, salud o educacion.
    lat: float
      Latidud del nuevo elemento.
    lng: float
      Longitud del nuevo elemento.
    nombre: str
      Nombre del elemento.

    TODO
    ----
    * Chequear que los typos de los elementos del request
      sean correctos.
    """
    elementos_posibles = ['cortaderos', 'salud', 'educacion']

    if not request.json:
        abort(400)
    if 'elemento' not in request.json:
        abort(400)

    elemento = request.json['elemento']
    elemento = elemento.lower()
    if elemento not in elementos_posibles:
        abort(400)
    if 'lat' not in request.json:
        abort(400)
    if 'lng' not in request.json:
        abort(400)
    if 'nombre' not in request.json:
        abort(400)

    # Leo todos los elementos tentativos
    # y realizo un append sobre estos
    data_path = "../datos/tentativos/{0}.json".format(elemento)
    data = read4json(data_path)[elemento]

    # nuevo dato
    value = {'coordinadas': [float(request.json['lat']),
                             float(request.json['lng'])],
             'nombre': request.json['nombre'],
             'fecha': str(datetime.now()),
             'ip': request.remote_addr}
    data.append(value)

    data = {elemento: data}
    save2json(data_path, data)

    return jsonify({'status': 201})


@app.route("/api/v1.0/datos/modificar/", methods=['DELET'])
def borrar_elemento():
    """
    Borra un elemento existente

    Request
    -------
    elemento: str
      Tipo de elemento: cortaderos, salud o educacion.
    lat: float
      Latidud del nuevo elemento.
    lng: float
      Longitud del nuevo elemento.

    TODO
    ----
    * Chequear que los typos de los elementos del request
      sean correctos.
    """
    elementos_posibles = ['cortaderos', 'salud', 'educacion']

    if not request.json:
        abort(400)
    if 'elemento' not in request.json:
        abort(400)

    elemento = request.json['elemento']
    elemento = elemento.lower()
    if elemento not in elementos_posibles:
        abort(400)
    if 'lat' not in request.json:
        abort(400)
    if 'lng' not in request.json:
        abort(400)

    # Leo todos los elementos tentativos
    # y realizo un append sobre estos
    data_path = "../datos/tentativos/{0}_borrar.json".format(elemento)
    data = read4json(data_path)[elemento]

    # nuevo dato
    value = {'coordinadas': [float(request.json['lat']),
                             float(request.json['lng'])],
             'fecha': str(datetime.now()),
             'ip': request.remote_addr}
    data.append(value)

    data = {elemento: data}
    save2json(data_path, data)

    return jsonify({'status': 201})


@app.route("/api/v1.0/datos/modificar/", methods=['PUT'])
def actualizar_elemento():
    """
    Actualizar un elemento.

    Request
    -------
    elemento: str
      Tipo de elemento: cortaderos, salud o educacion.
    lat: float
      Latidud del nuevo elemento.
    lng: float
      Longitud del nuevo elemento.
    nombre: str
      Nombre del elemento.

    TODO
    ----
    * Chequear que los typos de los elementos del request
      sean correctos.
    """
    elementos_posibles = ['cortaderos', 'salud', 'educacion']

    if not request.json:
        abort(400)
    if 'elemento' not in request.json:
        abort(400)

    elemento = request.json['elemento']
    elemento = elemento.lower()
    if elemento not in elementos_posibles:
        abort(400)
    if 'lat' not in request.json:
        abort(400)
    if 'lng' not in request.json:
        abort(400)
    if 'nombre' not in request.json:
        abort(400)

    # Leo todos los elementos tentativos
    # y realizo un append sobre estos
    data_path = "../datos/tentativos/{0}.json".format(elemento)
    data = read4json(data_path)[elemento]

    # nuevo dato
    value = {'coordinadas': [float(request.json['lat']),
                             float(request.json['lng'])],
             'nombre': request.json['nombre'],
             'fecha': str(datetime.now()),
             'ip': request.remote_addr}
    data.append(value)

    data = {elemento: data}
    save2json(data_path, data)

    return jsonify({'status': 201})




@app.route("/api/coordinate/")
def coordinate():
    """
    Retorna todos los datos dentro de un radio

    Request
    -------
    lat: float
      Latidud del centro de la circunferencia
    lng: float
      Longitud del centro de la circunferencia
    radio: float
      Radio de la circunferencia
    """
    if not request.json:
        abort(400)
    if 'lat' not in request.json:
        abort(400)
    if 'lng' not in request.json:
        abort(400)
    if 'radio' not in request.json:
        abort(400)

    latitude = request.json['lat']
    longitude = request.json['lng']
    radio = request.json['radio']

    cortadero = read4json('../datos/cortaderos.geojson')
    dispensarios = read4json('../datos/salud.geojson')
    esculas = read4json('../datos/educacion.geojson')

    # Datos para los cortadores
    corta_counts = []
    for count, element in enumerate(cortadero['Cortadores']):
        diff1 = (element['coordenada'][0] - latitude)**2
        diff2 = (element['coordenada'][1] - longitude)**2
        dist = sqrt(diff1 + diff2)

        if dist < radio:
            corta_counts.append(count)

    data_corta = []
    for i in corta_counts:
        data_corta.append(cortadero['Cortadores'][i])

    # Datos para los dispensarios
    disp_counts = []
    for count, element in enumerate(dispensarios['Dispensarios']):
        diff1 = (element['coordenadas'][0] - latitude)**2
        diff2 = (element['coordenadas'][1] - longitude)**2
        dist = sqrt(diff1 + diff2)

        if dist < radio:
            disp_counts.append(count)

    data_disp = []
    for i in disp_counts:
        data_disp.append(dispensarios['Dispensarios'][i])

    # Datos para las escuelas
    escu_counts = []
    for count, element in enumerate(esculas['Escuelas']):
        diff1 = (element['coordenadas'][0] - latitude)**2
        diff2 = (element['coordenadas'][1] - longitude)**2
        dist = sqrt(diff1 + diff2)

        if dist < radio:
            escu_counts.append(count)

    data_escu = []
    for i in escu_counts:
        data_escu.append(dispensarios['Dispensarios'][i])

    data = {'cortaderos': data_corta,
            'dispensarios': data_disp,
            'escuelas': data_escu}

    return json.dumps(data)


# Http Errors
@app.errorhandler(400)
def bad_request(error):
    """
    Error 400 for Bad Request.
    The body request is empy or with a bad key
    For example `new_name` in side of `name`.
    """
    return make_response(jsonify({'error': 'Bad request'}), 400)


@app.errorhandler(401)
def unauthorized(error):
    """
    Error 401 for Unauthorized.
    """
    return make_response(jsonify({'error': 'Unauthorized'}), 401)


@app.errorhandler(404)
def not_found(error):
    """
    Error 404 for Resource Not Found.
    The id in the URI don't exist.
    """
    return make_response(jsonify({'error': 'Not found'}), 404)


if __name__ == "__main__":
    app.run(debug=True)
    app.run()
