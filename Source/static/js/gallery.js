/* Gallery page */

$.getJSON("/gallery?location=" + mapOptions.center.lat + ", " + mapOptions.center.lng, function (data) {
    var items = [];
    $.each(data, function (key, val) {

    });
});