const NotesLayer = new Promise(function(resolve, reject){

  add(map) {
    $(document).ready(function () {
      getLocaxflStorage()
    })

    map.addControl(new mapboxgl.FullscreenControl());




// add draggable points


    var isDragging;

    // Is the cursor over a point? if this
    // flag is active, we listen for a mousedown event.
    
    var isCursorOverPoint;

    var coordinates = document.getElementById('coordinates');

    var canvas = map.getCanvasContainer();

    var geojsonDraggable = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [13.409280, 52.520920]
            },
        }]
    };

    function mouseDown() {
        if (!isCursorOverPoint) return;

        isDragging = true;

        // Set a cursor indicator
        canvas.style.cursor = 'grab';

        // Mouse events
        map.on('mousemove', onMove);
        map.once('mouseup', onUp);
    }

    function onMove(e) {
        if (!isDragging) return;
        var coords = e.lngLat;

        // Set a UI indicator for dragging.
        canvas.style.cursor = 'grabbing';

        // Update the Point feature in `geojson` coordinates
        // and call setData to the source layer `point` on it.
        geojsonDraggable.features[0].geometry.coordinates = [coords.lng, coords.lat];
        map.getSource('point').setData(geojsonDraggable);
    }

    function onUp(e) {
        if (!isDragging) return;
        var coords = e.lngLat;

        // Print the coordinates of where the point had
        // finished being dragged to on the map.
        coordinates.style.display = 'block';
        coordinates.innerHTML = 'Longitude: ' + coords.lng + '<br />Latitude: ' + coords.lat;
        canvas.style.cursor = '';
        isDragging = false;

        // Unbind mouse events
        map.off('mousemove', onMove);
    }

    function dataToStorage() {
        localStorage.setItem("dataLocal", JSON.stringify(geojson3));
    }

    function getLocaxflStorage() {
        geojson3 = JSON.parse(localStorage.getItem("dataLocal"));
        if (geojson3 === null) {
            geojson3 = {};
            geojson3['type'] = 'FeatureCollection';
            geojson3['features'] = [];
        }
        else {
            geojson3 = geojson3
        }
        return geojson3
    }



    map.on('load', function() {

        // Add a single point to the map
        map.addSource('point', {
            "type": "geojson",
            "data": geojsonDraggable
        });

        map.addLayer({
            "id": "point",
            "type": "circle",
            "source": "point",
            "paint": {
                "circle-radius": 10,
                "circle-color": "#d80000"
            }
        });


        // When the cursor enters a feature in the point layer, prepare for dragging.
        map.on('mouseenter', 'point', function() {
            map.setPaintProperty('point', 'circle-color', '#ff6262');
            canvas.style.cursor = 'move';
            isCursorOverPoint = true;
            map.dragPan.disable();
        });

        map.on('mouseleave', 'point', function() {
            map.setPaintProperty('point', 'circle-color', '#d80000');
            canvas.style.cursor = '';
            isCursorOverPoint = false;
            map.dragPan.enable();
        });

        map.on('mousedown', mouseDown);

            map.on('click', 'point', function (e) {
                new mapboxgl.Popup(keepInView = true)
                    .setLngLat(e.features[0].geometry.coordinates)
                    .setHTML('<form id="usernote"> Deine Notiz: <br><input type="text" name="note"><br><input type="submit" value="Senden"></form>')
                    .addTo(map);
                $( "#usernote" ).submit(function( event ) {
                    event.preventDefault();
                    console.log($("input:first").val());
                    var newFeature3 = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]]
                        },
                        "properties": {
            //			"title": "Hallo",
                        "description": $("input:first").val(),
                        "icon": "post"
                    }
                    }
                geojson3['features'].push(newFeature3);
                dataToStorage()
                getLocaxflStorage()
                event.preventDefault();
                $(".mapboxgl-popup-content").add(".mapboxgl-popup-tip").remove();
                map.getSource('pointsuser').setData(geojson3);
    //            geojsonDraggable.features[0].geometry.coordinates = [13.409280, 52.520920];
                map.getSource('point').setData(geojsonDraggable)
                geojsonDraggable.features[0].geometry.coordinates = [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]];

    });
            });

            map.addSource('pointsuser', {
            "type": "geojson",
            "data": geojson3
        });
                map.addLayer({
                "id": "pointsuser",
                "type": "circle",
                "source": "pointsuser",
                "paint": {
                    "circle-radius": 10,
                    "circle-color": "#258ffb"
                }
            });


            map.on('click', 'pointsuser', function (e) {
                new mapboxgl.Popup(keepInView = true)
                    .setLngLat(e.features[0].geometry.coordinates)
                    .setHTML(e.features[0].properties.description)
                    .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'pointsuser', function () {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'pointsuser', function () {
                map.getCanvas().style.cursor = '';
            });

    });
  }
});

export default NotesLayer;
