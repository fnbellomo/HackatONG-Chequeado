/*
  Script to resize dinamicaly the map
*/
$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 120; // Calculate the top offset

    $('#map').css('height', (h - offsetTop));
}).resize();
