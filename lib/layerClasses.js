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
    ) // parse with geojson.js

    /* Just, no.

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
        'layout': {'visibility': 'visible',
        'text-field': '{Name}',
        },
      }]}
    ]
    */
  }
  add(context) {
    context.addSource(
      this.name,
      {
        "type": "geojson",
        "data": this.geojson,
        "cluster": true,
      }
    );
    context.addLayer({
      "id": this.name,
      "source": this.name,
      "type": "symbol",
      "layout": {
        "visibility": "visible",
        "text-field": "{Name}"
      },
    })
  }

// /* What I'd actually like to do:

  wtf() {(function(){console.log(this)})()}
  odd() {console.log(this);}
    // return (function() {
    //   console.log('Adding layer…', this);
  //     map.addSource.call(context, "Test2",
  //     {
  //       "type": "son",
  //       "data": {
  //         "type": "FeatureCollection",
  //         "features": [
  //           {
  //             "type": "Feature",
  //             "geometry": {
  //               "type": "Point",
  //               "coordinates": [
  //                 13.407984,
  //                 52.520348
  //               ]
  //             },
  //             "properties": {
  //               "Name": "Feature 1",
  //               "Text": "Lorem Ipsum dolor sit amet."
  //             }
  //           },
  //           {
  //             "type": "Feature",
  //             "geometry": {
  //               "type": "Point",
  //               "coordinates": [
  //                 13.408318,
  //                 52.520126
  //               ]
  //             },
  //             "properties": {
  //               "Name": "Feature 2"
  //             }
  //           }
  //         ]
  //       },
  //       "cluster": true
  //     });
  //     map.addLayer({
  //       "id": "Test2",
  //       "source": "Test2",
  //       "type": "symbol",
  //       "layout": {
  //         "visibility": "visible",
  //         "text-field": "{Name}"
  //       },
  //     });
// })()
//   }
// */
}

// let test = new PointLayer(sampleOptionsObject)
//
// for (let method in test) console.log(method);
// console.log(test);
