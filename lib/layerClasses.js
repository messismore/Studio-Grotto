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

import { default as markdown } from '../lib/marked.js';



export class PointLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name
    this.geojson = GeoJSON.parse(
      optionsObject.features, {Point: ['Latitude', 'Longitude']}
    )
  }
  add(map) {
    map.addSource(
      this.name,
      {
        "type": "geojson",
        "data": this.geojson,
        "cluster": true,
      }
    );
    map.addLayer({
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
  add(map) {
    console.log('Applying CardLayer');
    console.log('GeoJSON: ', this.geojson);
    map.addSource(
      this.name,
      {
        "type": "geojson",
        "data": this.geojson,
        "cluster": true,
      }
    );
    map.addLayer({
      "id": this.name,
      "source": this.name,
      "type": "symbol",
      "layout": {
        "visibility": "visible",
        "text-field": "{Name}",
        // "text-font": ['DIN Offc Pro Regular', 'Arial Unicode MS Regular'],
      },
    });
    map.on('click', this.name, function (element) {
      // should parse Markdown
      let html = markdown('### Wird noch schöner, mit Titel und Bildern…\n' +
        element.features[0].properties.Description);
        console.log(html);
      if ('Image' in element.features[0].properties) {
        //   html = html + e.features[0].properties.Image[0].url
        let image = JSON.parse(element.features[0].properties.Image);
        console.log(image, image[0].id,);
        // .features["0"].properties.Image["0"].id
      } else {console.log('No image here…');}
        //(if e.features[0].properties.Image[0].url)
      new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(element.features[0].geometry.coordinates)
        .setHTML(html)
        .addTo(map);
    })

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', this.name, function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', this.name, function () {
      map.getCanvas().style.cursor = '';
    });
  }
}
