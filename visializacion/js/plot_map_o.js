

function initMap() {
    // Create the map
    var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 8,
	center: {lat: -31.45, lng: -64.18}
    });

    // Initialize 2 variable that will take 2 layers
    var cortaderosLayer = new google.maps.Data();
    var hospitalesLayer = new google.maps.Data();

    cortaderosLayer.setMap(map);
    
    // Load GeoJSON with cortaderos data
    cortaderosLayer.loadGeoJson(
	'cortaderos.geojson');

    
    // Set personal img to cortaderos
    cortaderosLayer.setStyle({
	icon: 'imgs/factory.png'
    });

    
    // global infowindow
    var infoWindow = new google.maps.InfoWindow({
        content: "",
        pixelOffset: new google.maps.Size(0, -30)
    });

    
    // When the user clicks, open an infowindow
    cortaderosLayer.addListener('click', function (event) {
	// Text to show
        infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' +
			      '<h3>' + event.feature.getProperty('name') + '</h3>' +
			      'Densidad: ' + event.feature.getProperty('densidad'));
	
	// Position of the point
        var anchor = new google.maps.MVCObject();
        anchor.setValues({
            position: event.latLng,
            anchorPoint: new google.maps.Point(0, 0) // Ofset del text-box a las coordenadas
        });

        infoWindow.open(map, anchor);
    });

    
    // Set mouseover event for each feature.
    cortaderosLayer.addListener('mouseover', function(event) {
        document.getElementById('info-box').textContent = event.feature.getProperty('densidad');
    });


};
