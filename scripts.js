
mapboxgl.accessToken = 'pk.eyJ1IjoibWVzc2lzbW9yZSIsImEiOiJjamF6aDJiNHEwbXBvMzJvNjUwdDdrbzRsIn0.w0i5lPoQtsBo5yeue9lYeQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [13.41028,  52.52077],
    zoom: 16
 });


map.on('load', function () {

  map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
          "type": "geojson",
          "data": "https://messismore.github.io/Studio-Grotto/samples/Test.geojson"
          // "data": {
          //     "type": "Feature",
          //     "properties": {},
          //     "geometry": {
          //         "type": "LineString",
          //         "coordinates": [
          //           [13.409510850906372, 52.52224008961698],
          //           [13.40506911277771, 52.52002051452143],
          //           [13.407279253005981, 52.518251302292406],
          //           [13.412128686904907, 52.5205950035378],
          //           [13.409510850906372, 52.52224008961698]
          //         ]
          //       }
          //     }
            },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#888",
        "line-width": 8
      }
  });
});
