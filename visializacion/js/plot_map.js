/*
  Visualizacion de los datos en un mapa de google

  Desarrollador: Franco N. Bellomo - @fnbellomo
*/

// General map variable
var map;

// Name of the 3 differents layers
var cortaderosLayer;
var healthLayer;
var educationLayer;

// Variables used to show or hide the different layers
var showCortaderosLayer = true;
var showHealtLayer = true;
var showEducationLayer = true;

// Variables used with the new markers
var markers = {};
var currentId = 0;
var uniqueId = function() {
    return ++currentId;
}

// infoWindow variable
var infoWindow;


function initMap() {
    // Create the map
    map = new google.maps.Map(document.getElementById('map'), {
	zoom: 12,
	center: {lat: -31.45, lng: -64.18}
    });

    
    // Initialize all the layers
    cortaderosLayer = new google.maps.Data();
    healthLayer     = new google.maps.Data();
    educationLayer  = new google.maps.Data();

    
    // Load GeoJSON with the data of each layer
    cortaderosLayer.loadGeoJson(
	'cortaderos.geojson');
    healthLayer.loadGeoJson(
	'salud.geojson');
    educationLayer.loadGeoJson(
	'educacion.geojson');


    // Personal icons for each layer
    var iconBase = 'imgs/';
    var icons = {
        Cortadero: {
            name: 'Cortaderos',
	    icon: iconBase + 'plastering-icon.png'
        },
        Healt: {
            name: 'Centro de Salud',
	    icon: iconBase + 'health.png'
        },
        Education: {
            name: 'Instituto Educativo',
	    icon: iconBase + 'university.png'
        }
    };

    // Set the style for each layer
    cortaderosLayer.setStyle(icons['Cortadero']);
    healthLayer.setStyle(icons['Healt']);
    educationLayer.setStyle(icons['Education']);


    // Generate map legend
    var legend = document.getElementById('legend');
    for (var key in icons) {
        var type = icons[key];
        var name = type.name;
        var icon = type.icon;
        var div = document.createElement('div');
	div.className = "legend-item";
        div.innerHTML = '<img src="' + icon + '"> ' + '<p onclick="showHideLayers(' + "'" + name + "'" + ');">' + name + '</p>';
        legend.appendChild(div);
    }
    // Push the legend
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

    
    // Create a global infowindow
    infoWindow = new google.maps.InfoWindow({
        content: "",
        pixelOffset: new google.maps.Size(0, -30)
    });


    // Define the diferents infoWindow then the user click in some point
    // -----------------------------------------------------------------
    // Cortadero infowindow
    cortaderosLayer.addListener('click', function (event) {
	// I cant pass data with space to the modal.
	// Replace the space with '_'
	var name = event.feature.getProperty('name').split(' ').join('_');
	var lat = event.latLng.lat();
	var lng = event.latLng.lng();

	// Text to show
        infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
			      '<h4>' + event.feature.getProperty('name') + '</h4>' +
			      'Densidad demográfica: ' + event.feature.getProperty('densidad') + '<br/>' +
			      '<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modifyWindow" ' +
			      'data-name=' + name + ' data-lat=' + lat + ' data-lng=' + lng + ' data-element="cortaderos">' +
			      'Modificar</button>' + 
			      '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deletWindow" ' +
			      'data-name=' + name + ' data-lat=' + lat + ' data-lng=' + lng + ' data-element="cortaderos">' +
			      'Eliminar</button>' + '</div>');

	// Position of the point
        var anchor = new google.maps.MVCObject();
        anchor.setValues({
            position: event.latLng,
            anchorPoint: new google.maps.Point(0, 0) // Ofset del text-box a las coordenadas
        });
        infoWindow.open(map, anchor);
    });

    // Health infowindow
    healthLayer.addListener('click', function (event) {
	// I cant pass data with space to the modal.
	// Replace the space with '_'
	var name = event.feature.getProperty('name').split(' ').join('_');
	var lat = event.latLng.lat();
	var lng = event.latLng.lng();

	// Text to show
        infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
			      '<h4>' + event.feature.getProperty('name') + '</h4>' +
			      '<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modifyWindow" ' +
			      'data-name=' + name + ' data-lat=' + lat + ' data-lng=' + lng + ' data-element="salud">' +
			      'Modificar</button> ' + 
			      '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deletWindow" ' +
			      'data-name=' + name + ' data-lat=' + lat + ' data-lng=' + lng + ' data-element="salud">' +
			      'Eliminar</button>' + '</div>');
	// Position of the point
        var anchor = new google.maps.MVCObject();
        anchor.setValues({
            position: event.latLng,
            anchorPoint: new google.maps.Point(0, 0) // Ofset del text-box a las coordenadas
        });
        infoWindow.open(map, anchor);
    });

    // Education infowindow
    educationLayer.addListener('click', function (event) {
	// I cant pass data with space to the modal.
	// Replace the space with '_'
	var name = event.feature.getProperty('name').split(' ').join('_');
	var lat = event.latLng.lat();
	var lng = event.latLng.lng();
	
	// Text to show
        infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
			      '<h4>' + event.feature.getProperty('name') + '</h4>' +
			      '<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modifyWindow" ' +
			      'data-name=' + name + ' data-lat=' + lat + ' data-lng=' + lng + ' data-element="educacion">' +
			      'Modificar</button>' + 
			      '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deletWindow" ' +
			      'data-name=' + name + ' data-lat=' + lat + ' data-lng=' + lng + ' data-element="educacion">' +
			      'Eliminar</button>'  + '</div>');
	// Position of the point
        var anchor = new google.maps.MVCObject();
        anchor.setValues({
            position: event.latLng,
            anchorPoint: new google.maps.Point(0, 0) // Ofset del text-box a las coordenadas
        });
        infoWindow.open(map, anchor);
    });


    // Define the diferents actions then the user mouseover some point
    // ---------------------------------------------------------------
    cortaderosLayer.addListener('mouseover', function(event) {
        document.getElementById('info-box').textContent = event.feature.getProperty('densidad');
    });


    cortaderosLayer.setMap(map);
    healthLayer.setMap(map);
    educationLayer.setMap(map);

    

    map.addListener('click', function(event) {
        createMarker(event);

	// Coordinate of the new points
	var lat = event.latLng.lat();
	var lng = event.latLng.lng();

	// InfoWindow
	// Text to show
	infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
			      '<h4>Nuevo Punto</h4>' +
			      '<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#createWindow" ' +
			      'data-lat=' + lat + ' data-lng=' + lng + '> ' +
			      ' Modificar</button>' +
			      '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#EliminarModal" ' +
			      'data-lat=' + lat + ' data-lng=' + lng + ' onclick="deleteMarker(' + currentId +')"' + '> ' +
			      ' Eliminar</button>' + '</div>');
	// Position of the point
	var anchor = new google.maps.MVCObject();
	anchor.setValues({
            position: event.latLng,
            anchorPoint: new google.maps.Point(0, -30) // Ofset del text-box a las coordenadas
	});
	infoWindow.open(map, anchor);
    });

};




var createMarker = function(event) {
    // Create a new marker and display in the map
    
    var id = uniqueId(); // get new id
    var marker = new google.maps.Marker({ // create a marker and set id
        id: id,
        position: event.latLng,
        map: map,
        draggable: true,
	animation: google.maps.Animation.DROP
    });
    // Cache created marker to markers object with id as its key
    markers[id] = marker;

    // Center the map in the new point
    map.panTo(event.latLng);
}

var deleteMarker = function(id) {
    // Removes a marker that created the user
    
    var marker = markers[id]; // find the marker by given id
    marker.setMap(null);
    infoWindow.close();
}

var closeInfoWindow = function(){
    // dummy function to close infoWindow from other function
    infoWindow.close();
}

function showHideLayers(element) {
    // Show hide the differents layers
    
    if (element == 'Cortaderos') {
	showCortaderosLayer = !showCortaderosLayer
	if (showCortaderosLayer) {
	    cortaderosLayer.setMap(map);
	} else {
	    cortaderosLayer.setMap(null);
	}

    } else if (element == 'Centro de Salud') {
	showHealtLayer = !showHealtLayer;
	if (showHealtLayer) {
	    healthLayer.setMap(map);
	} else {
	    healthLayer.setMap(null);
	}

    } else if (element == 'Instituto Educativo') {
	showEducationLayer = !showEducationLayer;
	if (showEducationLayer) {
	    educationLayer.setMap(map);
	} else {
	    educationLayer.setMap(null);
	}
    }
}
