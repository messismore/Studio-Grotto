

let sampleOptionsObject = {
  name: 'sampleOptionsObject',
  icons: [
    {name: 'Name', url:'url'},
  ],
  features: [
    {name: 'Feature 1', latitude: 52.520348, longitude: 13.407984}
  ],
}



import { default as markdown } from '../lib/marked.js';



export class PointLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name      // String
    this.icons = optionsObject.icons    // {name: 'Name', url:'url'},
    this.geojson = GeoJSON.parse(
      optionsObject.features, {Point: ['Latitude', 'Longitude']}
    )
  }

  add(map) {

    console.log('Applying PointLayer');
    console.log('GeoJSON: ', this.geojson);

    map.addSource(this.name, {
        'type': 'geojson',
        'data': this.geojson,
        'cluster': false,
      }
    );

    if (typeof this.icons === 'object') { // …and not 'undefined'
      map.loadImage(this.icons[0].url, function(error, image) {
        if (error) throw error;
        map.addImage(this.icons[0].name, image);
      }.bind(this) );  // bind the execution of the function to PointLayer
    };

    map.addLayer({
      'id': this.name,
      'source': this.name,
      'type': 'symbol',
      'layout': {
        'visibility': 'visible',
        'text-field': ['case', ['has', 'icon'], '', ['get', 'Name'],], // '' if icon property, default: Name property
        'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
        'icon-size': 0.5,
        'icon-allow-overlap': true,
      },
    });

  }
};

export class CardLayer extends PointLayer {
  constructor(optionsObject) {
    super(optionsObject);
  }

  add(map) {
    console.log('Applying CardLayer');
    console.log('GeoJSON: ', this.geojson);

    map.addSource(this.name, {
        'type': 'geojson',
        'data': this.geojson,
        'cluster': false,
      }
    );

    if (typeof this.icons === 'object') { // …and not 'undefined'
      map.loadImage(this.icons[0].url, function(error, image) {
        if (error) throw error;
        map.addImage(this.icons[0].name, image);
      }.bind(this) );  // bind the execution of the function to PointLayer
    };

    map.addLayer({
      'id': this.name,
      'source': this.name,
      'type': 'symbol',
      'layout': {
        'visibility': 'visible',
        'text-field': ['case', ['has', 'icon'], '', ['get', 'Name'],], // '' if icon property, default: Name property
        'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
        'icon-size': 0.5,
        'icon-allow-overlap': true,
      },
    });

    map.on('click', this.name, function (element) {
      // should parse Markdown
      let html = `<h3>${element.features[0].properties.Name}</h3>`;
      // check whether an image exists and put it at the top
      if ('Image' in element.features[0].properties) {
        let image = JSON.parse(element.features[0].properties.Image);
        html = `<img src=${image[0].url} >` + html;
      };
      // if there is a 'Description', parse Mardown and add it
      if ('Description' in element.features[0].properties) {
                 html += markdown(element.features[0].properties.Description);
      };
      new mapboxgl.Popup()
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
