/*
{
  name: 'Layer Name',
  methods: {
    'addSource': [arg1, arg2, arg3]
    …
  },
  geojson: {
    'type': 'FeatureCollection',
    'features': [
      {feature},
      {…}
    ]
  },
  etc: { // schlechter Name
         // ev. für Daten, die nicht in GeoJSON passen (Pikts, …)
  }
}
*/


class PointLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name
    this.methods = [
      {'addSource': []},
      {'addLayer': []},
<<<<<<< HEAD
      // {'on': ['click', 'test', function (e) {
      //  new mapboxgl.Popup(keepInView = true)
      //      .setLngLat(e.features[0].geometry.coordinates)
      //      .setHTML(e.features[0].properties.Text)
      //      .addTo(map);
      //    }]},
      // {'on': []},
    ]
    this.geojson = {} // parse with geojson.js
=======
      {'on': []},
      {'on': []},
    ]
    this.geojson = {}
>>>>>>> 1bd46e44509d766d81b5f52c3db0b91286589f2c
  }
}

let test = new PointLayer({name: 'Test'})

for (let method in test) console.log(method);
