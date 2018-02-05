/*
{
  name: 'Layer Name',
  methods: [
    {addSource: []},
    {addLayer: []},
    {on: []},
    {on: []},
  ],
  geojson: {
    'type': 'FeatureCollection',
    'features': [
      {feature},
      {…}
    ]
  },
  etc: { // schlechter Name
         // ev. für Daten, die nicht in GeoJSON passen (Piktos, …)
  }
}
*/
// import('/geojson.min.js');

// let sampleOptionsObject = {
//   name: 'sampleOptionsObject',
//   features: [
//     {name: 'Feature 1', latitude: 52.520348, longitude: 13.407984}
//   ],
// }

export class PointLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name
    this.geojson = GeoJSON.parse(
      optionsObject.features, {Point: ['Latitude', 'Longitude']}
    ), // parse with geojson.js
    this.methods = [
      {addSource: [this.name, {
        'type': 'geojson',
        'data': this.geojson,
        'cluster': true,
      }]},
      {addLayer: [{
        'id': this.name,
        'source': this.name,
        'type': 'symbol',
        'layout': {'visibility': 'visible'},
        'text-field': '{Name}'
      }]}
    ]
  }
}

// let test = new PointLayer(sampleOptionsObject)
//
// for (let method in test) console.log(method);
// console.log(test);
