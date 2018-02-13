

let sampleOptionsObject = {
  name: 'sampleOptionsObject',
  mapLayers: [],
  icons: [
    {name: 'Name', url:'url'},
  ],
  features: [
    {name: 'Feature 1', latitude: 52.520348, longitude: 13.407984}
  ],
}



import { default as markdown } from '../lib/marked.js';

let globalMaxImageDimension = 50;


let setImageDimensions = (image, maxDimension) => {

  // Take an image and a value to resize its longest side to.

  image.height = (image.naturalWidth <= maxDimension && image.naturalHeight <= maxDimension)
  ? image.naturalHeight
  : image.naturalHeight > image.naturalWidth
  ? maxDimension
  : maxDimension * image.naturalHeight/image.naturalWidth;
image.width = (image.naturalWidth <= maxDimension && image.naturalHeight <= maxDimension)
  ? image.naturalWidth
  : image.naturalWidth > image.naturalHeight
  ? maxDimension
  : maxDimension * image.naturalWidth/image.naturalHeight;
};

let addIcons = (context, map, maxImageDimension = globalMaxImageDimension) => {
  // console.log('adding icons…', maxImageDimension);
  if (typeof context.icons === 'object' && context.icons.length > 0) {
  context.icons.map(icon => {
      let image = new Image()
      image.crossOrigin="anonymous";
      image.onload = () => {
        setImageDimensions(image, maxImageDimension)
        map.addImage(icon.name, image);
      };
      image.src = icon.url;
    })
  };
};

let createElementHTML = (element) => {
  let html = '';
  if ('Name' in element.features[0].properties) {
    html += `<h3>${element.features[0].properties.Name}</h3>`;
  };
  // check whether an image exists and put it at the top
  if ('Image' in element.features[0].properties) {
    let image = JSON.parse(element.features[0].properties.Image);
    html = `<img src=${image[0].url} >` + html;
  };
  // if there is a 'Description', parse Mardown and add it
  if ('Description' in element.features[0].properties) {
             html += markdown(element.features[0].properties.Description);
  };
  return html;
}



export class PointLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name      // String
    this.icons = optionsObject.icons    // {name: 'Name', url:'url'},
    this.mapLayers = []
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

    addIcons(this, map, 100);


    map.addLayer({
      'id': this.name,
      'source': this.name,
      'type': 'symbol',
      'layout': {
        'visibility': 'none',
        'text-field': ['case', ['has', 'icon'], '', ['get', 'Name'],], // '' if icon property, default: Name property
        'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
        'icon-size': 0.5,
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
      },
    });
    this.mapLayers.push(this.name);

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

    addIcons(this, map);

    map.addLayer({
      'id': this.name,
      'source': this.name,
      'type': 'symbol',
      'layout': {
        'visibility': 'none',
        'text-field': ['case', ['has', 'icon'], '', ['get', 'Name'],], // '' if icon property, default: Name property
        'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
        'icon-size': 0.5,
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
      },
    });
    this.mapLayers.push(this.name);

    map.on('click', this.name, function (element) {

      let html = createElementHTML(element);
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
};


export class SidebarLayer extends PointLayer {
  constructor(optionsObject) {
    super(optionsObject);
  }

  add(map) {
    console.log('Applying SidebarLayer');
    console.log('GeoJSON: ', this.geojson);

    map.addSource(this.name, {
        'type': 'geojson',
        'data': this.geojson,
        'cluster': false,
      }
    );

    addIcons(this, map);

    map.addLayer({
      'id': this.name,
      'source': this.name,
      'type': 'symbol',
      'layout': {
        'visibility': 'none',
        'text-field': ['case', ['has', 'icon'], '', ['get', 'Name'],], // '' if icon property, default: Name property
        'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
        'icon-size': 0.5,
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
      },
    });
    this.mapLayers.push(this.name);

    map.on('click', this.name, function (element) {

      let html = createElementHTML(element);
      const sidebarContent = document.getElementById('content');
      sidebarContent.innerHTML = '<div class="contentCard">' + html + '</div>';

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
};


export class NetworkLayer extends SidebarLayer {
  constructor(optionsObject) {
    super(optionsObject);
  }

  add(map) {
    console.log('Applying NetworkLayer');
    console.log('GeoJSON: ', this.geojson);

    map.addSource(this.name, {
        'type': 'geojson',
        'data': this.geojson,
        'cluster': false,
      }
    );

    addIcons(this, map, (globalMaxImageDimension * 2));

    map.addLayer({
      'id': this.name,
      'source': this.name,
      'type': 'symbol',
      'layout': {
        'visibility': 'none',
        'text-field': ['case', ['has', 'icon'], '', ['get', 'Name'],], // '' if icon property, default: Name property
        'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
        'icon-size': 0.5,
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
      },
    });
    this.mapLayers.push(this.name);

    map.on('click', this.name, function (element) {

      let html = createElementHTML(element);
      const sidebarContent = document.getElementById('content');
      sidebarContent.innerHTML = '<div class="contentCard">' + html + '</div>';

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
};


export class ImageLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name      // String
    this.features = optionsObject.features
    this.mapLayers = []
    this.optionsObject = optionsObject
  }

  add(map) {

    console.log('Applying ImageLayer');
    console.log('optionsObject', this.optionsObject);

    const upperLeft = {
      latitude: this.features[0]['↖︎ Latitude'],
      longitude: this.features[0]['↖︎ Longitude']
    };
    const lowerRight = {
      latitude: this.features[0]['↘︎ Latitude'],
      longitude: this.features[0]['↘︎ Longitude']
    };
    const upperRight = {
      latitude:this.features[0]['↖︎ Latitude'],
      longitude: this.features[0]['↘︎ Longitude'],
        };
    const lowerLeft = {
      latitude:this.features[0]['↘︎ Latitude'],
      longitude: this.features[0]['↖︎ Longitude']
        };
    map.addSource(this.name, {
      'type': 'image',
        'url': this.features[0].Image[0].url,
        'coordinates': [
          [upperLeft.longitude, upperLeft.latitude],
          [upperRight.longitude, upperRight.latitude],
          [lowerRight.longitude, lowerRight.latitude],
          [lowerLeft.longitude, lowerLeft.latitude],
        ],
    });

    map.addLayer({
      'id': this.name,
      'source': this.name,
      'type': 'raster',
    }, 'Historizität');
    this.mapLayers.push(this.name);

  }
};


export class Image4PtLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name      // String
    this.features = optionsObject.features
    this.mapLayers = []
    this.optionsObject = optionsObject
  }

  add(map) {

    console.log('Applying Image4PtLayer');
    console.log('optionsObject', this.optionsObject);

    const upperLeft = {
      latitude: this.features[0]['↖︎ Latitude'],
      longitude: this.features[0]['↖︎ Longitude']
    };
    const lowerRight = {
      latitude: this.features[0]['↘︎ Latitude'],
      longitude: this.features[0]['↘︎ Longitude']
    };
    const upperRight = {
      latitude:this.features[0]['↗︎ Latitude'],
      longitude: this.features[0]['↗︎ Longitude'],
        };
    const lowerLeft = {
      latitude:this.features[0]['↙︎ Latitude'],
      longitude: this.features[0]['↙︎ Longitude']
        };
    map.addSource(this.name, {
      'type': 'image',
        'url': this.features[0].Image[0].url,
        'coordinates': [
          [upperLeft.longitude, upperLeft.latitude],
          [upperRight.longitude, upperRight.latitude],
          [lowerRight.longitude, lowerRight.latitude],
          [lowerLeft.longitude, lowerLeft.latitude],
        ],
    });

    map.addLayer({
      'id': this.name,
      'source': this.name,
      'type': 'raster',
    }, 'Historizität');
    this.mapLayers.push(this.name);

  }
};

export class GeoJSONLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name      // String
    this.geoJSON = optionsObject.geoJSON
    this.mapLayers = []
    this.optionsObject = optionsObject
  }

  add(map) {

    console.log('Applying GeoJSONLayer');
    console.log('optionsObject', this.optionsObject);

    map.addSource(this.name, {
        'type': 'geojson',
        'data': this.geoJSON,
        'cluster': false,
      }
    );

    console.log(this.geoJSON);

    map.addLayer({
      'id': this.name+'LineString',
      'source': this.name,
      'type': 'line',
      'layout': {
        'visibility': 'none',
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
          'line-color': [
                'match',
                ['get', 'Colour'],
                'blau', '#00f',
                'braun', '#f08',
                'gelb', '#fc0',
                'rot', '#f00',
                'lila', '#80c',
                'grün', '#060',
                /* other */ ['get', 'Colour'],
              ],
          'line-width': 4,
          'line-opacity': 0.75,
      },
      'filter': ['==', '$type', 'LineString']
    }, 'Historizität');
    this.mapLayers.push(this.name+'LineString');
    // (map.getLayer(this.name + 'LineString') == typeof 'Object')
    //   ? this.mapLayers.push(this.name + 'LineString')
    //   : console.log('No lines in '+ this.name);

      map.addLayer({
        'id': this.name + 'Polygon',
        'source': this.name,
        'type': 'fill',
        'layout': {
          'visibility': 'none',
        },
        'paint': {
            'fill-color': [
                  'match',
                  ['get', 'Colour'],
                  'blau', '#00f',
                  'braun', '#f08',
                  'gelb', '#fc0',
                  'rot', '#f00',
                  'lila', '#80c',
                  'grün', '#060',
                  /* other */ ['get', 'Colour'],
                ],
            'fill-opacity': 0.5,
        },
        'filter': ['==', '$type', 'Polygon']
      }, 'Historizität');
      this.mapLayers.push(this.name + 'Polygon');

      map.addLayer({
        'id': this.name + 'PolygonBorder',
        'source': this.name,
        'type': 'line',
        'layout': {
          'visibility': 'none',
          'line-join': 'round',
          'line-cap': 'round',
        },
        'paint': {
            'line-color': [
                  'match',
                  ['get', 'Colour'],
                  'blau', '#00f',
                  'braun', '#f08',
                  'gelb', '#fc0',
                  'rot', '#f00',
                  'lila', '#80c',
                  'grün', '#060',
                  /* other */ ['get', 'Colour'],
                ],
            'line-width': 1,
            'line-opacity': 1,
        },
        'filter': ['==', '$type', 'Polygon']
      }, 'Historizität');
      this.mapLayers.push(this.name + 'PolygonBorder');
  }
};
