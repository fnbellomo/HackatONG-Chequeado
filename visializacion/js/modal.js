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
    var coord = button.data('coord');
    coord = coord.split('_').join(' ');
    
    var modal = $(this)
    modal.find('.modal-title').text('Modificar  ' + name)
    modal.find('.modal-body input').val(name)
    modal.find('#recipient-coord').text('Coordinadas ' + coord)
})


// Modal para eliminar instituciones
$('#EliminarModal').on('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = $(event.relatedTarget)

    // Extract name
    var name = button.data('name');
    name = name.split('_').join(' ');
    // Extract coordinate
    var coord = button.data('coord');
    coord = coord.split('_').join(' ');

    var modal = $(this)
    modal.find('.modal-title').text('Eliminar ' + name)
    modal.find('#recipient-coord').text('Coordinadas ' + coord)
})
