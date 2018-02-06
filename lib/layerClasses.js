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
    )
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

/* What I'd actually like to do:

  wtf() {(function(){console.log(this)})()}
  odd() {console.log(this)}

*/
};

export class CardLayer extends PointLayer {
  constructor(optionsObject) {
    super(optionsObject);
  }
  add(context) {
    console.log('Applying CardLayer');
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
    });
    context.on('click', this.name, function (e) {
        new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.Description)
            .addTo(context);
    })

    // Change the cursor to a pointer when the mouse is over the places layer.
    context.on('mouseenter', this.name, function () {
        context.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    context.on('mouseleave', this.name, function () {
        context.getCanvas().style.cursor = '';
    });
  }
}
