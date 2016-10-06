/*
  Simple script para mostrar los valos correctos en los distintos 
  modales (ventanas emergentes) pasando los valores mediante 
  data-atributeName
*/

// Modal para modificar atributos
$('#modifyWindow').on('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = $(event.relatedTarget)

    // Extract name
    var name = button.data('name');
    name = name.split('_').join(' ');
    // Extract coordinate
    var lat = button.data('lat');
    var lng = button.data('lng');
    // Extract type of element
    var elemento = button.data('element');
    
    var modal = $(this)
    modal.find('.modal-title').text('Modificar  ' + name)
    modal.find('.modal-body input').val(name)
    modal.find('#showCoord').text('Coordinadas ' + lat + ' ' + lng)

    // onclick event in button
    var request = 'modifyRequest("' + elemento + '",' + lat + ',' + lng + ')';
    document.getElementById('modifyButton').setAttribute('onclick', request)
})

// Modal para eliminar instituciones
$('#deletWindow').on('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = $(event.relatedTarget)

    // Extract name
    var name = button.data('name');
    name = name.split('_').join(' ');
    // Extract coordinate
    var lat = button.data('lat');
    var lng = button.data('lng');
    // Extract type of element
    var elemento = button.data('element');

    var modal = $(this)
    modal.find('.modal-title').text('Eliminar ' + name)
    modal.find('#showCoord').text('Coordinadas ' + + lat + ' ' + lng)

    // onclick event in button
    var request = 'deletRequest("' + elemento + '",' + lat + ',' + lng + ')';
    document.getElementById('deletButton').setAttribute('onclick', request)
})


// Modal agregar una nueva institucion
$('#createWindow').on('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = $(event.relatedTarget)

    // Extract coordinate
    var lat = button.data('lat');
    var lng = button.data('lng');
    var id  = button.data('id');

    var modal = $(this)
    modal.find('#showCoord').text('Coordinadas ' + + lat + ' ' + lng)

    // onclick event in button
    var request = 'createRequest(' + lat + ',' + lng + ',' + id + ')';
    document.getElementById('createButton').setAttribute('onclick', request)
})

// Request para modificar una institucion
function modifyRequest(elemento, lat, lng) {
    var requestJson = {"elemento": elemento,
		       "nombre": document.getElementById("formName").value,
		       "lat": lat,
		       "lng": lng};
    console.log(requestJson);

    // Hide modal and close infoWindow
    $('#modifyWindow').modal('hide');
    closeInfoWindow();
}

// Request para borrar una institucion
function deletRequest(elemento, lat, lng) {
    var requestJson = {"elemento": elemento,
		       "lat": lat,
		       "lng": lng};
    console.log(requestJson);

    // Hide modal and close infoWindow
    $('#deletWindow').modal('hide');
    closeInfoWindow();
}

// Request para crear una institucion
function createRequest(lat, lng, id) {
    var requestJson = {"elemento": document.getElementById("formType").value,
		       "nombre": document.getElementById("formNameCreate").value,
		       "lat": lat,
		       "lng": lng};
    console.log(requestJson);

    // Fix the position of the marker
    fixMarker(id);
    
    // Hide modal and close infoWindow
    $('#createWindow').modal('hide');
    closeInfoWindow();
}
