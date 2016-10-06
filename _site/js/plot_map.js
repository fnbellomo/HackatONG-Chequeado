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

// General infoWindow variable
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

    // Create a global infowindow
    infoWindow = new google.maps.InfoWindow({
        content: "",
        pixelOffset: new google.maps.Size(0, -30)
    });
    
    // Load GeoJSON with the data of each layer
    cortaderosLayer.loadGeoJson(
	'../data/cortaderos.geojson');
    healthLayer.loadGeoJson(
	'../data/salud.geojson');
    educationLayer.loadGeoJson(
	'../data/educacion.geojson');

    
    // Personal icons for each layer
    var iconBase = '../imgs/';
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


    // Define the diferents infoWindow then the user click in some point
    // -----------------------------------------------------------------
    // Cortaderos infowindow
    cortaderosLayer.addListener('click', function (event) {
	layerInfoWindow(event);
    })
    
    // Healt infowindow
    healthLayer.addListener('click', function (event) {
	layerInfoWindow(event);
    })
    
    // Education infowindow
    educationLayer.addListener('click', function (event) {
	layerInfoWindow(event);
    })

    // Create a new marker
    map.addListener('click', function(event) {
        createMarker(event);
	markerInfoWindow(currentId);
    });
    

    // Define the diferents actions then the user move the mouse over some point
    // -------------------------------------------------------------------------
    cortaderosLayer.addListener('mouseover', function(event) {
	// Set the name
	document.getElementById('nombre').textContent =  event.feature.getProperty('name');
	// Set demografic density
        document.getElementById('densidad').textContent = 'Densidad demográfica: ' +
	    event.feature.getProperty('densidad');

	// Make list with access to water and gas
	displayCortaderoProperty(event, 'accesoGas', 'acceso_gas');
	displayCortaderoProperty(event, 'accesoAgua', 'acceso_agua');
    });


    // Display layers in the map
    cortaderosLayer.setMap(map);
    healthLayer.setMap(map);
    educationLayer.setMap(map);
};


// InfoWindow functions
// ====================

// Display the infoWindow of the diffents layers
function layerInfoWindow(event) {
    // I cant pass data with space to the modal.
    // Replace the space with '_'
    var name = event.feature.getProperty('name').split(' ').join('_');
    var type = event.feature.getProperty('type');
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    
    // Text to show
    infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
			  '<h4>' + event.feature.getProperty('name') + '</h4>' +
			  '<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modifyWindow" ' +
			  'data-name=' + name + ' data-lat=' + lat + ' data-lng=' + lng + ' data-element=' + type + '>' +
			  'Modificar</button>' + 
			  '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deletWindow" ' +
			  'data-name=' + name + ' data-lat=' + lat + ' data-lng=' + lng + ' data-element=' + type + '>' +
			  'Eliminar</button>'  + '</div>');
    // Position of the point
    var anchor = new google.maps.MVCObject();
    anchor.setValues({
        position: event.latLng,
        anchorPoint: new google.maps.Point(0, 0) // Ofset del text-box a las coordenadas
    });
    infoWindow.open(map, anchor);
}

// Display the infoWindow of the markers that the user create
function markerInfoWindow(id) {
    // Coordinate of the new points
    var lat = markers[id].position.lat()
    var lng = markers[id].position.lng()

    // InfoWindow
    // Text to show
    infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
			  '<h4>Nuevo Punto ' + id + '</h4>' +
			  '<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#createWindow" ' +
			  'data-lat=' + lat + ' data-lng=' + lng + '> ' +
			  ' Modificar</button>' +
			  '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#EliminarModal" ' +
			  'data-lat=' + lat + ' data-lng=' + lng + ' onclick="deleteMarker(' + id +')"' + '> ' +
			  ' Eliminar</button>' + '</div>');
    // Position of the point
    var anchor = new google.maps.MVCObject();
    anchor.setValues({
        position: markers[id].position,
        anchorPoint: new google.maps.Point(0, 0) // Ofset del text-box a las coordenadas
    });
    
    infoWindow.open(map, anchor);
}

// dummy function to close infoWindow from other function
var closeInfoWindow = function(){
    infoWindow.close();
}


// New markers function
// ====================

// Create a new marker and display in the map
var createMarker = function(event) {
    var id = uniqueId(); // get new id
    var marker = new google.maps.Marker({ // create a marker and set id
        id: id,
        position: event.latLng,
        map: map,
        draggable: false,
	animation: google.maps.Animation.DROP,
    });    
    
    // Cache created marker to markers object with id as its key
    markers[id] = marker;

    marker.addListener('click', function() {
	markerInfoWindow(id);
    });
    
    // Center the map in the new point
    map.panTo(event.latLng);
}

// Removes a marker that created the user
var deleteMarker = function(id) {
    var marker = markers[id]; // find the marker by given id
    marker.setMap(null);
    infoWindow.close();
}

//

// Show hide the differents layers
function showHideLayers(element) {
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


function displayCortaderoProperty(event, elementId, property) {
    var elementList = document.getElementById(elementId);
    // Remove all element in the list
    while (elementList.firstChild) {
	elementList.removeChild(elementList.firstChild);
    }
    
    // Add new elements
    for (var key in event.feature.getProperty(property)) {
        var number = event.feature.getProperty(property)[key];
	
	var newListItem = document.createElement("li");
        //create new text node
        var elementListValue = document.createTextNode(key + ': ' + number);
        //add text node to li element
        newListItem.appendChild(elementListValue);
        //add new list element built in previous steps to unordered list
        //called elementList
        elementList.appendChild(newListItem);
    }
}
