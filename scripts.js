
mapboxgl.accessToken = 'pk.eyJ1IjoibWVzc2lzbW9yZSIsImEiOiJjamF6aDJiNHEwbXBvMzJvNjUwdDdrbzRsIn0.w0i5lPoQtsBo5yeue9lYeQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [13.41028,  52.52077],
    zoom: 16
 });


map.on('load', function () {
  map.addSource(
    'test',
    {
      "type": "geojson",
      "data": "https://messismore.github.io/Studio-Grotto/samples/Test.geojson"
    },
  );
  map.addLayer({
      "id": "test",
      "type": "line",
      "source": "test",
      "layout": {
        "visibility": "visible",
        "line-join": "round",
        "line-cap": "round",
      },
      "paint": {
        "line-color": "#888",
        "line-width": 8,
      }
  });
});

var toggleableLayerIds = [ 'test', ];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}
