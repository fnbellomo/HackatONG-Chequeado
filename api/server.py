"""
API simple para visualizar los ladrilleros de cordoba
desarrollado en el hack(at)ONG 2016
"""
from __future__ import print_function, division
import json
from math import sqrt

from flask import Flask


def read4json(file_path):
    "Read configuration data form json file and return a list"
    with open(file_path, 'r') as data_file:
        data = json.load(data_file)
    return data


def save2json(file_path, data):
    "Save configuration data to a json file"
    with open(file_path, 'w') as data_file:
        json.dump(data, data_file, indent=4)


# path to the data
cortaderos_path = "../datos/cortaderos.json"
dispensarios_path = "../datos/dispensarios.json"
escuelas_path = "../datos/escuelas.json"


# initialization the server
app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/api/data", methods=['GET'])
def all():
    """
    Retorna todos los json en uno solo

    Return
    ------
    data: json
    """
    cortadero = read4json(cortaderos_path)
    dispensarios = read4json(dispensarios_path)
    esculas = read4json(escuelas_path)

    data = {'cortaderos': cortadero['Cortadores'],
            'dispensarios': dispensarios['Dispensarios'],
            'escuelas': esculas['Escuelas']}
    data = json.dumps(data)

    return data


@app.route("/api/coordinate/<latitude>/<longitude>/<radio>")
def coordinate(latitude, longitude, radio):
    """
    Retorna todos los datos dentro de un radio

    Parameters
    ----------
    latitude: float
      Latidud del centro de la circunferencia
    longitude: float
      Longitud del centro de la circunferencia
    radio: float
      Radio de la circunferencia
    """
    latitude = float(latitude)
    longitude = float(longitude)
    radio = float(radio)

    cortadero = read4json(cortaderos_path)
    dispensarios = read4json(dispensarios_path)
    esculas = read4json(escuelas_path)

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


@app.route("/api/nuevo/cortaderos/<latitude>/<longitude>")
def nueva_cortadero(latitude, longitude):
    """
    Agregar un nuevo cortadero
    """
    nuevos_cortaderos = "../datos/cortaderos_nuevos.json"
    cortadero = read4json(nuevos_cortaderos)["cortaderos"]
    value = {'coordinate': [float(latitude), float(longitude)]}
    cortadero.append(value)

    data = {'cortaderos': cortadero}
    save2json(nuevos_cortaderos, data)

    return "ok"


@app.route("/api/nuevo/escuela/<latitude>/<longitude>/<nombre>")
def nueva_escuela(latitude, longitude, nombre):
    """
    Agregar una nueva escuela
    """
    nueva_escuela = "../datos/escuela_nueva.json"
    escuela = read4json(nueva_escuela)["Escuelas"]
    value = {'coordinate': [float(latitude), float(longitude)],
             'nombre': nombre}
    escuela.append(value)

    data = {'Escuelas': escuela}
    save2json(nueva_escuela, data)

    return "ok"


if __name__ == "__main__":
    app.run(debug=True)
    app.run()
