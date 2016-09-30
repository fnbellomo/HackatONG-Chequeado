/*
  Visualizacion de los datos

  Desarrollador: Franco N. Bellomo - @fnbellomo
 */

function initMap() {
    // Create the map
    var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 12,
	center: {lat: -31.45, lng: -64.18}
    });

    // Initialize 3 variable that will take 3 diffetents layers
    var cortaderosLayer = new google.maps.Data();
    var healthLayer     = new google.maps.Data();
    var educationLayer  = new google.maps.Data();


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
        div.innerHTML = '<img src="' + icon + '"> ' + name;
        legend.appendChild(div);
    }
    // Push the legend
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

    
    // Global infowindow
    var infoWindow = new google.maps.InfoWindow({
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
	var coord = event.latLng.toString().split(' ').join('_');

	// Text to show
        infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
			      '<h4>' + event.feature.getProperty('name') + '</h4>' +
			      'Densidad: ' + event.feature.getProperty('densidad') + '<br/>' +
			      '<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#ModificarModal" ' +
			      'data-name=' + name + ' data-coord=' + coord + '>' +
			      'Modificar</button>' + 
			      '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#EliminarModal" ' +
			      'data-name=' + name + ' data-coord=' + coord + '>' +
			      'Eliminar</button>');

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
	var coord = event.latLng.toString().split(' ').join('_');

	// Text to show
        infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
			      '<h4>' + event.feature.getProperty('name') + '</h4>' +
			      '<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#ModificarModal" ' +
			      'data-name=' + name + ' data-coord=' + coord + '>' +
			      'Modificar</button>' + 
			      '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#EliminarModal" ' +
			      'data-name=' + name + ' data-coord=' + coord + '>' +
			      'Eliminar</button>');
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
	var coord = event.latLng.toString().split(' ').join('_');
	
	// Text to show
        infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
			      '<h4>' + event.feature.getProperty('name') + '</h4>' +
			      '<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#ModificarModal" ' +
			      'data-name=' + name + ' data-coord=' + coord + '>' +
			      'Modificar</button>' + 
			      '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#EliminarModal" ' +
			      'data-name=' + name + ' data-coord=' + coord + '>' +
			      'Eliminar</button>');
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
};
