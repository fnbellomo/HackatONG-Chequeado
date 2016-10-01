/*
  Simple script para mostrar los valos correctos en el modal
  pasando los valores mediante data-name y data-coord
*/

// Modal para modificar atributos
$('#ModificarModal').on('show.bs.modal', function (event) {
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
    modal.find('#recipient-coord').text('Coordinadas ' + lat + ' ' + lng)

    // onclick event in button
    var summitFunc = 'summitModificar("' + elemento + '",' + lat + ',' + lng + ')';
    document.getElementById('buttonModificar').setAttribute('onclick', summitFunc)
})


// Modal para eliminar instituciones
$('#EliminarModal').on('show.bs.modal', function (event) {
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
    modal.find('#recipient-coord').text('Coordinadas ' + + lat + ' ' + lng)

    // onclick event in button
    var summitFunc = 'summitEliminar("' + elemento + '",' + lat + ',' + lng + ')';
    document.getElementById('buttonEliminar').setAttribute('onclick', summitFunc)
})


function summitModificar(elemento, lat, lng) {
    var requestJson = {"elemento": elemento,
		       "nombre": document.getElementById("recipient-name").value,
		       "lat": lat,
		       "lng": lng};
    console.log(requestJson);

    $('#ModificarModal').modal('hide');
}


function summitEliminar(elemento, lat, lng) {
    var requestJson = {"elemento": elemento,
		       "lat": lat,
		       "lng": lng};
    console.log(requestJson);

    $('#EliminarModal').modal('hide');
}
