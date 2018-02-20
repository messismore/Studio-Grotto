

export const sampleOptionsObject = {
  id: 'sampleOptionsObjectId',
  name: 'sampleOptionsObject',
  mapLayers: [],
  icons: [
    {id: 'id', name: 'Name', url:'url', height: 100, width: 1000},
  ],
  description: 'Lorem Ipsum',
  images: [
    {id: 'id', url: 'url', height: 1000, width: 1000}
  ],
  // geoJSON: {"type": "Point", "coordinates": [125.6, 10.1]}, // as well, methinks.
  features: [
    {
      id: 'featureID',
      latitude: 52.520348,
      longitude: 13.407984,
      //
      '↙︎ longitude': '',       //
      '↙︎ latitude': '',        //
      '↗︎ longitude': '',        //
      '↗︎ latitude': '',       //      geoJSON parser should ignore these,
      '↘︎ longitude': '',       //      if they have a value, the first image is
      '↘︎ latitude': '',        //      put directly on the map
      '↖︎ longitude': '',        //
      '↖︎ latitude': '',        //
      name: 'Feature 1',
      icon: 'iconID',
      description: 'Ipsum Lorem',
      images: [
        {id: 'id', url: 'url', height: 1000, width: 1000},
      ],
      // geoJSON: {"type": "Point", "coordinates": [125.6, 10.2]},
      colour: 'blau',
      // …and more with spread operator
    }
  ],
}



import { default as markdown } from '../lib/marked.js';
import { fitRectangleTwoPoint } from '../lib/analysis.js';

const globalMaxImageDimension = 50;
const globalMaxIconDimension = 50;
const colourSet = ['match', ['get', 'Colour'],
                              'blau', '#00f',
                              'braun', '#f08',
                              'gelb', '#fc0',
                              'rot', '#f00',
                              'lila', '#80c',
                              'grün', '#2afd8d',
                  /* other */ ['get', 'Colour'],
                ]




// Base class. Accepts all kinds of content. Subclasses change behaviour.
// eg. SidebarLayer
export class Layer {
  constructor(optionsObject) {
    this.mapLayers        = []
    this.visibility       = 'none'
    this.id               = optionsObject.id
    this.name             = optionsObject.name
    this.description      = optionsObject.description
    this.icons            = optionsObject.icons
    this.maxIconDimension = globalMaxIconDimension
    this.images           = optionsObject.images
    this.geoJSON          = optionsObject.geoJSON
    // If there is GeoJSON, this.latitude and this.longitude will be ignored
    // To do: make sure this.features.geometry is an array and push the point
    // specified by this.latitude and this.longitude.
    this.geoJSON     = GeoJSON.parse(optionsObject.features,
                                      {
                                        Point: ['latitude', 'longitude'],
                                        GeoJSON: 'geoJSON',
                                        exclude: [
                                          // 'GeoJSON',
                                          '↙︎ longitude',
                                          '↙︎ latitude',
                                          '↗︎ longitude',
                                          '↗︎ latitude',
                                          '↘︎ longitude',
                                          '↘︎ latitude',
                                          '↖︎ longitude',
                                          '↖︎ latitude'
                                        ],
                                      }
                                    )
    // this.geoJSON.features[0].geometry = this.geoJSON.features[0].geometry[0]
  }


  _setImageDimensions(image, maxDimension) {

    // Take an image and a value to resize its longest side to.

    image.height = (image.naturalWidth <= maxDimension
                    && image.naturalHeight <= maxDimension)
    ? image.naturalHeight
    : image.naturalHeight > image.naturalWidth
    ? maxDimension
    : maxDimension * image.naturalHeight/image.naturalWidth;
    image.width = (image.naturalWidth <= maxDimension
                   && image.naturalHeight <= maxDimension)
    ? image.naturalWidth
    : image.naturalWidth > image.naturalHeight
    ? maxDimension
    : maxDimension * image.naturalWidth/image.naturalHeight;
  };


  _addIcons(context, map, maxDimension = this.maxIconDimension) {
   // iterates of all icons, scales them and adds them to the map.

    if (typeof context.icons === 'object' && context.icons.length > 0) {
    // ^ To do: I should propably check, whether icons is an Array…
    context.icons.forEach(icon => {
        const image = new Image()
        image.crossOrigin="anonymous";
        image.onload = () => {
          setImageDimensions(image, maxDimension)
          map.addImage(icon.id, image);
        };
        image.src = icon.url;
      })
    };
  };


  _setMouseHover(map, layer) {
    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', layer, function () {
      map.getCanvas().style.cursor = 'pointer';
    });
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', layer, function () {
      map.getCanvas().style.cursor = '';
    })
  }


  _setMouseClick(map, layer, action) {
    this._setMouseHover(map, layer)
    map.on('click', layer, action.bind(this))
  }


  _createElementHTML(context) {
    console.log('_createElementHTML()', context);
    let html = '';
    if (context.name !== undefined) {
      html += `<h3>${context.name}</h3>`;
    };
    // check whether an image exists and put it at the top
    if (context.images !== undefined) {
      if (typeof context.images === 'string') {
      context.images = JSON.parse(context.images)
      }
      html = `<img src=${context.images[0].url} >` + html;
    };
    // if there is a 'Description', parse Mardown and add it
    if (context.description !== undefined) {
      html += markdown(context.description);
    };
    console.log('html: ', html);
    return html;
  }


  _setSidebar(content, container) {
    const sidebarContent = document.getElementById(container);
    sidebarContent.innerHTML = `<div class="contentCard ${this.id}">
                                ${(content !== '')
                                ?'<button class="mapboxgl-sidebar-close-button" type="button">×</button>'
                                :''}
                                ${content}</div>`
      $(".mapboxgl-sidebar-close-button").click(function(){
      sidebarContent.innerHTML = ''
      })

  }


  _addGeoJSONSource(map) {
    console.log('_addGeoJSONSource()', this.geoJSON);
    map.addSource(this.name+'-GeoJSON', {
        'type': 'geojson',
        'data': this.geoJSON,
        'cluster': false,
    })
  }


  _drawGeoJSONSymbolLayer(map) {
    this._addIcons(this, map)
    map.addLayer({
      'id': this.name + '-GeoJSON-Symbol',
      'source': this.name + '-GeoJSON',
      'type': 'symbol',
      'layout': {
        'visibility': 'none',
        'text-field': ['case', ['has', 'icon'], '', ['get', 'name'],], // if icon property, default: Name property
        'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
        'icon-size': 0.5,
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
      },
    });
    this.mapLayers.push(this.name + '-GeoJSON-Symbol');
  }


  _drawGeoJSONLineStringLayer(map) {
    map.addLayer({
      'id': this.name+'-GeoJSON-LineString',
      'source': this.name+'-GeoJSON',
      'type': 'line',
      'layout': {
        'visibility': 'none',
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
          'line-color': colourSet,
          'line-width': 4,
          'line-opacity': 0.75,
      },
      'filter': ['==', '$type', 'LineString']
    });
    this.mapLayers.push(this.name+'-GeoJSON-LineString');
  }


  _drawGeoJSONPolygonLayer(map) {
    map.addLayer({
      'id': this.name + '-GeoJSON-Polygon',
      'source': this.name + '-GeoJSON',
      'type': 'fill',
      'layout': {
        'visibility': 'none',
      },
      'paint': {
          'fill-color': colourSet,
          'fill-opacity': 0.5,
      },
      'filter': ['==', '$type', 'Polygon']
    });
    this.mapLayers.push(this.name + '-GeoJSON-Polygon');
    map.addLayer({
      'id': this.name + '-GeoJSON-PolygonBorder',
      'source': this.name + '-GeoJSON',
      'type': 'line',
      'layout': {
        'visibility': 'none',
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
          'line-color': colourSet,
          'line-width': 1,
          'line-opacity': 1,
      },
      'filter': ['==', '$type', 'Polygon']
    });
    this.mapLayers.push(this.name + '-GeoJSON-PolygonBorder');
  }


  _drawGeoJSON(map) {
    console.log('_drawGeoJSON()');
    this._addGeoJSONSource(map)
    this._drawGeoJSONSymbolLayer(map)
    this._drawGeoJSONLineStringLayer(map)
    this._drawGeoJSONPolygonLayer(map)
  }


  _addImageSource(map) {}


  _drawImageLayer(map) {}


  add(map) {
    this._drawGeoJSON(map)
    this._drawImageLayer(map)
  }


  show() {
    this._setSidebar(this._createElementHTML(this), 'legend')
  }


  hide() {
    // hide open popups, clear sidebar IF its content is still in there
    this._setSidebar('', 'legend')
  }


}




export class PointLayer extends Layer {
  constructor(optionsObject) {
    super(optionsObject);
    this.maxIconDimension = 100
  }
}




export class CardLayer extends Layer {
  constructor(optionsObject) {
    super(optionsObject);
  }


  _drawGeoJSONSymbolLayer(map) {
    super._drawGeoJSONSymbolLayer(map)
    // also, add hover effects, when clicked, open a popup
    this._setMouseClick(map, this.name + '-GeoJSON-Symbol', function (element) {
        console.log('click! Element: ', element.features[0].properties);
        console.log(this._createElementHTML);
         let html = this._createElementHTML(element.features[0].properties);
         new mapboxgl.Popup(keepInView = true)
           .setLngLat(element.features[0].geometry.coordinates)
           .setHTML(html)
           .addTo(map);
       })
  }


}




export class SidebarLayer extends Layer {
  constructor(optionsObject) {
    super(optionsObject);
  }


  _drawGeoJSONSymbolLayer(map) {
    super._drawGeoJSONSymbolLayer(map)
    // also, add hover effects, when clicked, open a popup
    this._setMouseClick(map, this.name + '-GeoJSON-Symbol', function (element) {
      console.log(element);
      this._setSidebar(this._createElementHTML(element.features[0].properties), 'content')
       })
  }


}




export class NetworkLayer extends SidebarLayer {
  constructor(optionsObject) {
    super(optionsObject)
    this.maxIconDimension = 100
  }


  _drawGeoJSONSymbolLayer(map) {
    super._drawGeoJSONSymbolLayer(map)
    // also, add hover effects, when clicked, open a popup
    this._setMouseClick(map, this.name + '-GeoJSON-Symbol', function (element) {
      console.log(element);
      this._setSidebar(this._createElementHTML(element.features[0].properties), 'content')
       })
  }


}






/*                                 New
 ==============================================================================
                                   Old                                        */











let setImageDimensions = (image, maxDimension) => {

  // Take an image and a value to resize its longest side to.

  image.height = (image.naturalWidth <= maxDimension
                  && image.naturalHeight <= maxDimension)
  ? image.naturalHeight
  : image.naturalHeight > image.naturalWidth
  ? maxDimension
  : maxDimension * image.naturalHeight/image.naturalWidth;
  image.width = (image.naturalWidth <= maxDimension
                 && image.naturalHeight <= maxDimension)
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
        map.addImage(icon.id, image);
      };
      image.src = icon.url;
    })
  };
};

const createElementHTML = (context) => {
  console.log('_createElementHTML()', context);
  let html = '';
  if (context.name !== undefined) {
    html += `<h3>${context.name}</h3>`;
  };
  // check whether an image exists and put it at the top
  if (context.images !== undefined) {
    if (typeof context.images === 'string') {
    context.images = JSON.parse(context.images)
    }
    html = `<img src=${context.images[0].url} >` + html;
  };
  // if there is a 'Description', parse Mardown and add it
  if (context.description !== undefined) {
    html += markdown(context.description);
  };
  console.log('html: ', html);
  return html;
}



const setSidebar = (content, container = 'content') => {
  const sidebarContent = document.getElementById(container);
  sidebarContent.innerHTML = `<div class="contentCard ${this.id}">
                              ${(content !== '')
                              ?'<button class="mapboxgl-sidebar-close-button" type="button">×</button>'
                              :''}
                              ${content}</div>`
    $(".mapboxgl-sidebar-close-button").click(function(){
    sidebarContent.innerHTML = ''
    })

}





// export class PointLayer {
//   constructor(optionsObject) {
//     this.name = optionsObject.name      // String
//     this.icons = optionsObject.icons    // {name: 'Name', url:'url'},
//     this.mapLayers = []
//     this.geojson = GeoJSON.parse(
//       optionsObject.features, {Point: ['Latitude', 'Longitude']}
//     )
//     this.visibility = 'none'
//   }
//
//   add(map) {
//
//     console.log('Applying PointLayer');
//     console.log('GeoJSON: ', this.geojson);
//
//     map.addSource(this.name, {
//         'type': 'geojson',
//         'data': this.geojson,
//         'cluster': false,
//       }
//     );
//
//     addIcons(this, map, 100);
//
//
//     map.addLayer({
//       'id': this.name,
//       'source': this.name,
//       'type': 'symbol',
//       'layout': {
//         'visibility': 'none',
//         'text-field': ['case', ['has', 'icon'], '', ['get', 'Name'],], // '' if icon property, default: Name property
//         'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
//         'icon-size': 0.5,
//         'icon-allow-overlap': true,
//         'text-allow-overlap': true,
//       },
//     });
//     this.mapLayers.push(this.name);
//
//   };
//
// };
//
// export class CardLayer extends PointLayer {
//   constructor(optionsObject) {
//     super(optionsObject);
//   }
//
//   add(map) {
//     console.log('Applying CardLayer');
//     // console.log('GeoJSON: ', this.geojson);
//
//     map.addSource(this.name, {
//         'type': 'geojson',
//         'data': this.geojson,
//         'cluster': false,
//       }
//     );
//
//     addIcons(this, map);
//
//     map.addLayer({
//       'id': this.name,
//       'source': this.name,
//       'type': 'symbol',
//       'layout': {
//         'visibility': 'none',
//         'text-field': ['case', ['has', 'icon'], '', ['get', 'Name'],], // '' if icon property, default: Name property
//         'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
//         'icon-size': 0.5,
//         'icon-allow-overlap': true,
//         'text-allow-overlap': true,
//       },
//     });
//     this.mapLayers.push(this.name);
//
//     map.on('click', this.name, function (element) {
//
//       let html = createElementHTML(element);
//       new mapboxgl.Popup()
//         .setLngLat(element.features[0].geometry.coordinates)
//         .setHTML(html)
//         .addTo(map);
//     })
//     // Change the cursor to a pointer when the mouse is over the places layer.
//     map.on('mouseenter', this.name, function () {
//       map.getCanvas().style.cursor = 'pointer';
//     });
//     // Change it back to a pointer when it leaves.
//     map.on('mouseleave', this.name, function () {
//       map.getCanvas().style.cursor = '';
//     });
//   }
// };


// export class SidebarLayer extends PointLayer {
//   constructor(optionsObject) {
//     super(optionsObject);
//   }
//
//   add(map) {
//     console.log('Applying SidebarLayer');
//     console.log('GeoJSON: ', this.geojson);
//
//     map.addSource(this.name, {
//         'type': 'geojson',
//         'data': this.geojson,
//         'cluster': false,
//       }
//     );
//
//     addIcons(this, map);
//
//     map.addLayer({
//       'id': this.name,
//       'source': this.name,
//       'type': 'symbol',
//       'layout': {
//         'visibility': 'none',
//         'text-field': ['case', ['has', 'icon'], '', ['get', 'Name'],], // '' if icon property, default: Name property
//         'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
//         'icon-size': 0.5,
//         'icon-allow-overlap': true,
//         'text-allow-overlap': true,
//       },
//     });
//     this.mapLayers.push(this.name);
//
//     map.on('click', this.name, function (element) {
//
//       let html = createElementHTML(element);
//       const sidebarContent = document.getElementById('content');
//       sidebarContent.innerHTML = '<div class="contentCard">' + html + '</div>';
//
//     })
//     // Change the cursor to a pointer when the mouse is over the places layer.
//     map.on('mouseenter', this.name, function () {
//       map.getCanvas().style.cursor = 'pointer';
//     });
//     // Change it back to a pointer when it leaves.
//     map.on('mouseleave', this.name, function () {
//       map.getCanvas().style.cursor = '';
//     });
//   }
// };


// export class NetworkLayer extends SidebarLayer {
//   constructor(optionsObject) {
//     super(optionsObject);
//   }
//
//   add(map) {
//     console.log('Applying NetworkLayer');
//     console.log('GeoJSON: ', this.geojson);
//
//     map.addSource(this.name, {
//         'type': 'geojson',
//         'data': this.geojson,
//         'cluster': false,
//       }
//     );
//
//     addIcons(this, map, (globalMaxImageDimension * 2));
//
//     map.addLayer({
//       'id': this.name,
//       'source': this.name,
//       'type': 'symbol',
//       'layout': {
//         'visibility': 'none',
//         'text-field': ['case', ['has', 'icon'], '', ['get', 'Name'],], // '' if icon property, default: Name property
//         'icon-image': ['case', ['has', 'icon'], ['get', 'icon'], ''], // only when there is such a field.
//         'icon-size': 0.5,
//         'icon-allow-overlap': true,
//         'text-allow-overlap': true,
//       },
//     });
//     this.mapLayers.push(this.name);
//
// /*    map.on('click', this.name, function (element) {
//       function closeContent() {
//          $(".contentCard").hide()
//       }
//       let html = createElementHTML(element);
//       const sidebarContent = document.getElementById('content');
//       sidebarContent.innerHTML = '<button class="mapboxgl-sidebar-close-button" type="button">×</button><div class="contentCard">' + html + '</div>';
//
//       $(".mapboxgl-sidebar-close-button").click(function(){
//           sidebarContent.innerHTML = ''
//       })
//
//     })*/
//     // Change the cursor to a pointer when the mouse is over the places layer.
//     map.on('mouseenter', this.name, function () {
//       map.getCanvas().style.cursor = 'pointer';
//     });
//     // Change it back to a pointer when it leaves.
//     map.on('mouseleave', this.name, function () {
//       map.getCanvas().style.cursor = '';
//     });
//   }
// };


export class ImageLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name      // String
    this.features = optionsObject.features
    this.mapLayers = []
    this.visibility = 'none'
    this.description = optionsObject.description
    this.images = optionsObject.images
  }

  add(map) {

    console.log('Applying ImageLayer');
    console.log('optionsObject', this.optionsObject);

    const lowerLeft = {
      x: this.features[0]['↙︎ Longitude'],
      y:this.features[0]['↙︎ Latitude'],
        };
    const upperRight = {
      x: this.features[0]['↗︎ Longitude'],
      y:this.features[0]['↗︎ Latitude'],
        };


    // We need to convert our Lats and Longs to Cartesian XY to be able to
    // perform some vector calculations. We then convert our results back to
    // Lat-Long

    const source = 'EPSG:4326'; // World Geodetic System
    const dest = 'EPSG:3785';   // the Mercator Projection Mapbox uses

    const coordinatesXY = fitRectangleTwoPoint(
                              this.features[0].Image[0].thumbnails.large.width,
                              this.features[0].Image[0].thumbnails.large.height,
                              proj4(source, dest, lowerLeft),
                              proj4(source, dest, upperRight),
                            ).reverse(); // because Mapbox
    const coordinatesLatLon = coordinatesXY.map(
      coord => Object.values(proj4(dest, source, coord)).slice(0,2)
    )

    map.addSource(this.name, {
      'type': 'image',
        'url': this.features[0].Image[0].url,
        'coordinates': coordinatesLatLon,
    });

    map.addLayer({
      'id': this.name,
      'source': this.name,
      'type': 'raster',
      'layout': {
        'visibility': 'none',
      },
    }, 'Historizität-GeoJSON-Symbol');
    this.mapLayers.push(this.name);

  }

  show() {
    console.log(this);
    setSidebar(createElementHTML(this), 'legend')
  }

};


export class Image4PtLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name      // String
    this.features = optionsObject.features
    this.mapLayers = []
    this.visibility = 'none'
    this.description = optionsObject.description
    this.images = optionsObject.images
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
      'layout': {
        'visibility': 'none',
      },
    }, 'Historizität-GeoJSON-Symbol');
    this.mapLayers.push(this.name);

  }
  show() {
    setSidebar(createElementHTML(this), 'legend')
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
    }, 'Historizität-GeoJSON-Symbol');
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
      }, 'Historizität-GeoJSON-Symbol');
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
      }, 'Historizität-GeoJSON-Symbol');
      this.mapLayers.push(this.name + 'PolygonBorder');
  }
};
