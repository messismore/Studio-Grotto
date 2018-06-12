/*
Loads data from Airtable.com and returns an array of Layer objects.

{
  name: '',
  methods: [ oder doch Objekt? KISS
    addSource(),
    addLayer(),
    on('click'),
    on('mouseenter'),
    on('mouseleave'),
  ],
  son: {
    'type': 'FeatureCollection',
    'features': [{…},{…}]
  }
}

1. Get index
2. iterate through the returned array (map()? Parallel? contructing an object:

.
.
Have an object that can be parsed to GeoJSON
*/


import '../lib/geojson.min.js';
import { sampleOptionsObject, Layer, PointLayer, CardLayer, SidebarLayer, NetworkLayer, ImageLayer, Image4PtLayer, VideoLayer, GeoJSONLayer, } from './layerClasses.js';

const Airtable = require('airtable');
const base = new Airtable({apiKey: 'keyJ8TgEdfkjg9z3T'}).base('appaLLsrYXAAEG52k');
const testMode       = document.URL.match('Test') ? true : false;

function getRecords(table) {
  return new Promise((resolve, reject) => {
  let retrievedRecords = [];
  base(table).select({
    // Selecting records in Grid view:
    view: "Grid view"
  }).eachPage(
    function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function(record) {
      // console.log('Retrieved', record.get('Name'));
      if (record.get('Name')) {
        retrievedRecords.push({'id': record.id, 'fields': record.fields});
      }
    });
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
    }, function done(error) {
      if (error) {
        console.log(error);
        reject(error);
      }
      console.log(`Retrieved ${table}`, retrievedRecords);
      resolve(retrievedRecords);
    }
  )
  });
};

async function getTables() {
  const index = testMode
    ? await getRecords('TestIndex')
    : await getRecords('Index');
  // Catch errors to make sure the Promise resolves, because we want to use
  // Promise.all later on. In case of an error simply return [].
  const requestedTables = await index.map(async function(record) {
    const tableObject = {
      table : record.fields.Name,
      id: record.id,
      render: record.fields.Render,
      description: record.fields.Description,
      records : await getRecords(record.fields.Name).catch(error => []),
      icons: [],
      images: record.fields.Image,
    };

    if ('Icon' in record.fields) {
      tableObject.icons.push({
        id: record.fields.Icon[0].id, url: record.fields.Icon[0].url
      });
    } /*else {console.log(`No Icon in ${record.fields.Name}.`)}*/;

  // iterate over object and if there is a fields.Icon, use it's name
  // for fields.icon, push its name and url to object.icons
  // else if there is 'Icon' in records.fields, use that.

    tableObject.records.map(
      feature => {
        if ('Icon' in feature.fields) { // this doesnt work because objec
          const iconImageProps = {
            id: feature.fields.Icon[0].id,
            url: feature.fields.Icon[0].url,
            width: feature.fields.Icon[0].thumbnails.large.width,
            height: feature.fields.Icon[0].thumbnails.large.height,
          };
          tableObject.icons.push(iconImageProps);
          Object.defineProperty(feature.fields, 'icon', {
            value: iconImageProps.id,
            writeable: true,
            enumerable: true
          });
        } else if ('Icon' in record.fields) {
          const iconImageProps = {id: record.fields.Icon[0].id};
          Object.defineProperty(feature.fields, 'icon', {
            value: iconImageProps.id,
            writeable: true,
            enumerable: true,
          });
        };
      }
    )
   return tableObject;
  });

  let retrievedTables = await Promise.all(requestedTables).then(  //Wait for all promises to resolve.
    requestedTables => {
      // Clean array from [].
      requestedTables = requestedTables.filter(
        table => table.records.length > 0
      );
      console.log(' Success:', requestedTables);
      return requestedTables;
    }
  );
  return retrievedTables;
};


// let sampleTableObjects = [
//   {
//     table: 'Test',
//     render: 'Point',
//     s: [
//       {
//         name: 'Logo',
//         url: 'url.com/.png'
//       }
//     ],
//     records: [
//       {
//         id: "recS3q1jo5BoaVYVE",
//         fields: {
//           Name: "Feature 1", Latitude: 52.520348, Longitude: 13.407984, Text: "Lorem Ipsum dolor sit amet.",
//         },
//       },
//       {
//         id: "recFUBHUK4lGC4rVY", fields: {
//           Name: "Feature 2", Latitude: 52.520126, Longitude: 13.408318
//         }
//       },
//     ],
//   },
// ]

let parseTableObjects = function(tableObjects) {
  return tableObjects.map(tableObject => {
    switch (tableObject.render) {

      case 'Point':
        console.log(tableObject);
        return new PointLayer({
          id: tableObject.id,
          name: tableObject.table,
          mapLayers: [],
          icons: tableObject.icons,
          description: tableObject.description,
          images: tableObject.images,
      //  geoJSON: , not implemented yet
          features: tableObject.records.map(record => ({
            'id':           record.id,
            'name':         record.fields.Name,
            'icon':         record.fields.icon,
            'longitude':    record.fields.Longitude,
            'latitude':     record.fields.Latitude,
            // '↙︎ longitude':  record.fields.↙︎ Longitude,       //
            // '↙︎ latitude':   record.fields.↙︎ Latitude,        //
            // '↗︎ longitude':  record.fields.↗︎ Longitude,        //
            // '↗︎ latitude':   record.fields.↗︎ Latitude,       //      geoJSON parser should ignore these,
            // '↘︎ longitude':  record.fields.↘︎ Longitude,       //      if they have a value, the first image is
            // '↘︎ latitude':   record.fields.↘︎ Latitude,        //      put directly on the map
            // '↖︎ longitude':  record.fields.↖︎ Longitude,        //
            // '↖︎ latitude':   record.fields.↖︎ Latitude,        //
            'description':   record.fields.Description,


          })),
          // [
          //   {
          //     id: 'featureID',
          //     latitude: 52.520348,
          //     longitude: 13.407984,
          //     //
          //     '↙︎ longitude': '',       //
          //     '↙︎ latitude': '',        //
          //     '↗︎ longitude': '',        //
          //     '↗︎ latitude': '',       //      geoJSON parser should ignore these,
          //     '↘︎ longitude': '',       //      if they have a value, the first image is
          //     '↘︎ latitude': '',        //      put directly on the map
          //     '↖︎ longitude': '',        //
          //     '↖︎ latitude': '',        //
          //     name: 'Feature 1',
          //     // icon: '',
          //     description: 'Ipsum Lorem',
          //     images: [
          //       {id: 'id', url: 'url', height: 1000, width: 1000},
          //     ],
          //     // geoJSON: [{"type": "Point", "coordinates": [125.6, 10.2]},{"type": "Point", "coordinates": [125.6, 10.1]}],
          //     colour: 'blau',
          //     // …and more with spread operator
          //   }
          // ],
        }
);
        break;

        case 'Cards':
          console.log(tableObject);
          return new CardLayer({
            id: tableObject.id,
            name: tableObject.table,
            mapLayers: [],
            icons: tableObject.icons,
            description: tableObject.description,
            images: tableObject.images,
        //  geoJSON: , not implemented yet
            features: tableObject.records.map(record => ({
              'id':           record.id,
              'name':         record.fields.Name,
              'icon':         record.fields.icon,
              'longitude':    record.fields.Longitude,
              'latitude':     record.fields.Latitude,
              // '↙︎ longitude':  record.fields.↙︎ Longitude,       //
              // '↙︎ latitude':   record.fields.↙︎ Latitude,        //
              // '↗︎ longitude':  record.fields.↗︎ Longitude,        //
              // '↗︎ latitude':   record.fields.↗︎ Latitude,       //      geoJSON parser should ignore these,
              // '↘︎ longitude':  record.fields.↘︎ Longitude,       //      if they have a value, the first image is
              // '↘︎ latitude':   record.fields.↘︎ Latitude,        //      put directly on the map
              // '↖︎ longitude':  record.fields.↖︎ Longitude,        //
              // '↖︎ latitude':   record.fields.↖︎ Latitude,        //
              'description':   record.fields.Description,
              'images':        (record.fields.Image !== undefined)
                                  ? record.fields.Image.map(image => {
                                    console.log(image); return ({
                                      id:  image.id,
                                      url: image.url,
                                      width: image.thumbnails.large.width,
                                      height: image.thumbnails.large.height,
                                    })})
                                  : undefined,


            })),
            // [
            //   {
            //     id: 'featureID',
            //     latitude: 52.520348,
            //     longitude: 13.407984,
            //     //
            //     '↙︎ longitude': '',       //
            //     '↙︎ latitude': '',        //
            //     '↗︎ longitude': '',        //
            //     '↗︎ latitude': '',       //      geoJSON parser should ignore these,
            //     '↘︎ longitude': '',       //      if they have a value, the first image is
            //     '↘︎ latitude': '',        //      put directly on the map
            //     '↖︎ longitude': '',        //
            //     '↖︎ latitude': '',        //
            //     name: 'Feature 1',
            //     // icon: '',
            //     description: 'Ipsum Lorem',
            //     images: [
            //       {id: 'id', url: 'url', height: 1000, width: 1000},
            //     ],
            //     // geoJSON: [{"type": "Point", "coordinates": [125.6, 10.2]},{"type": "Point", "coordinates": [125.6, 10.1]}],
            //     colour: 'blau',
            //     // …and more with spread operator
            //   }
            // ],
          }
        );
          break;

          case 'Sidebar':
            console.log(tableObject);
            return new SidebarLayer({
              id: tableObject.id,
              name: tableObject.table,
              mapLayers: [],
              icons: tableObject.icons,
              description: tableObject.description,
              images: tableObject.images,
          //  geoJSON: , not implemented yet
              features: tableObject.records.map(record => ({
                'id':           record.id,
                'name':         record.fields.Name,
                'icon':         record.fields.icon,
                'longitude':    record.fields.Longitude,
                'latitude':     record.fields.Latitude,
                // '↙︎ longitude':  record.fields.↙︎ Longitude,       //
                // '↙︎ latitude':   record.fields.↙︎ Latitude,        //
                // '↗︎ longitude':  record.fields.↗︎ Longitude,        //
                // '↗︎ latitude':   record.fields.↗︎ Latitude,       //      geoJSON parser should ignore these,
                // '↘︎ longitude':  record.fields.↘︎ Longitude,       //      if they have a value, the first image is
                // '↘︎ latitude':   record.fields.↘︎ Latitude,        //      put directly on the map
                // '↖︎ longitude':  record.fields.↖︎ Longitude,        //
                // '↖︎ latitude':   record.fields.↖︎ Latitude,        //
                'description':   record.fields.Description,
                'images':        (record.fields.Image !== undefined)
                                    ? record.fields.Image.map(image => {
                                      console.log(image); return ({
                                        id:  image.id,
                                        url: image.url,
                                        width: image.thumbnails.large.width,
                                        height: image.thumbnails.large.height,
                                      })})
                                    : undefined,


              })),
              // [
              //   {
              //     id: 'featureID',
              //     latitude: 52.520348,
              //     longitude: 13.407984,
              //     //
              //     '↙︎ longitude': '',       //
              //     '↙︎ latitude': '',        //
              //     '↗︎ longitude': '',        //
              //     '↗︎ latitude': '',       //      geoJSON parser should ignore these,
              //     '↘︎ longitude': '',       //      if they have a value, the first image is
              //     '↘︎ latitude': '',        //      put directly on the map
              //     '↖︎ longitude': '',        //
              //     '↖︎ latitude': '',        //
              //     name: 'Feature 1',
              //     // icon: '',
              //     description: 'Ipsum Lorem',
              //     images: [
              //       {id: 'id', url: 'url', height: 1000, width: 1000},
              //     ],
              //     // geoJSON: [{"type": "Point", "coordinates": [125.6, 10.2]},{"type": "Point", "coordinates": [125.6, 10.1]}],
              //     colour: 'blau',
              //     // …and more with spread operator
              //   }
              // ],
            }
          );
            break;

            case 'Network':
              console.log(tableObject);
              return new NetworkLayer({
                id: tableObject.id,
                name: tableObject.table,
                mapLayers: [],
                icons: tableObject.icons,
                description: tableObject.description,
                images: tableObject.images,
            //  geoJSON: , not implemented yet
                features: tableObject.records.map(record => ({
                  'id':           record.id,
                  'name':         record.fields.Name,
                  'icon':         record.fields.icon,
                  'longitude':    record.fields.Longitude,
                  'latitude':     record.fields.Latitude,
                  // '↙︎ longitude':  record.fields.↙︎ Longitude,       //
                  // '↙︎ latitude':   record.fields.↙︎ Latitude,        //
                  // '↗︎ longitude':  record.fields.↗︎ Longitude,        //
                  // '↗︎ latitude':   record.fields.↗︎ Latitude,       //      geoJSON parser should ignore these,
                  // '↘︎ longitude':  record.fields.↘︎ Longitude,       //      if they have a value, the first image is
                  // '↘︎ latitude':   record.fields.↘︎ Latitude,        //      put directly on the map
                  // '↖︎ longitude':  record.fields.↖︎ Longitude,        //
                  // '↖︎ latitude':   record.fields.↖︎ Latitude,        //
                  'description':   record.fields.Description,
                  'images':        (record.fields.Image !== undefined)
                                      ? record.fields.Image.map(image => {
                                        console.log(image); return ({
                                          id:  image.id,
                                          url: image.url,
                                          width: image.thumbnails.large.width,
                                          height: image.thumbnails.large.height,
                                        })})
                                      : undefined,


                })),
                // [
                //   {
                //     id: 'featureID',
                //     latitude: 52.520348,
                //     longitude: 13.407984,
                //     //
                //     '↙︎ longitude': '',       //
                //     '↙︎ latitude': '',        //
                //     '↗︎ longitude': '',        //
                //     '↗︎ latitude': '',       //      geoJSON parser should ignore these,
                //     '↘︎ longitude': '',       //      if they have a value, the first image is
                //     '↘︎ latitude': '',        //      put directly on the map
                //     '↖︎ longitude': '',        //
                //     '↖︎ latitude': '',        //
                //     name: 'Feature 1',
                //     // icon: '',
                //     description: 'Ipsum Lorem',
                //     images: [
                //       {id: 'id', url: 'url', height: 1000, width: 1000},
                //     ],
                //     // geoJSON: [{"type": "Point", "coordinates": [125.6, 10.2]},{"type": "Point", "coordinates": [125.6, 10.1]}],
                //     colour: 'blau',
                //     // …and more with spread operator
                //   }
                // ],
              }
            );
              break;

      case 'Image':
        return new ImageLayer({
          name: tableObject.table,
          description: tableObject.description,
          images: tableObject.images,
          features: tableObject.records.map(record => record.fields),
        });
        break;

      case 'Image4Pt':
        return new Image4PtLayer({
          name: tableObject.table,
          description: tableObject.description,
          images: tableObject.images,
          features: tableObject.records.map(record => record.fields),
        });
        break;

      case 'Video':
        return new VideoLayer({
          name: tableObject.table,
          description: tableObject.description,
          images: tableObject.images,
          features: tableObject.records.map(record => record.fields),
        });
        break;

      case 'GeoJSON':
        return new GeoJSONLayer({
          name: tableObject.table,
          geoJSON: GeoJSON.parse(tableObject.records.map(record => {
            let geoJSON = JSON.parse(record.fields.geoJSON);
            record.fields.geoJSON = geoJSON.features.map(feature => feature.geometry)[0];
            return record.fields;
          }), {GeoJSON: 'geoJSON'}),
        });
        break;

      case 'Layer':
        console.log(tableObject);
        return new Layer({
          id: tableObject.id,
          name: tableObject.table,
          mapLayers: [],
          icons: tableObject.icons,
          description: tableObject.description,
          images: tableObject.images,
      //  geoJSON: , not implemented yet
          features: tableObject.records.map(record => ({
            'id':           record.id,
            'name':         record.fields.Name,
            'icon':         record.fields.icon,
            'longitude':    record.fields.Longitude,
            'latitude':     record.fields.Latitude,
            // '↙︎ longitude':  record.fields.↙︎ Longitude,       //
            // '↙︎ latitude':   record.fields.↙︎ Latitude,        //
            // '↗︎ longitude':  record.fields.↗︎ Longitude,        //
            // '↗︎ latitude':   record.fields.↗︎ Latitude,       //      geoJSON parser should ignore these,
            // '↘︎ longitude':  record.fields.↘︎ Longitude,       //      if they have a value, the first image is
            // '↘︎ latitude':   record.fields.↘︎ Latitude,        //      put directly on the map
            // '↖︎ longitude':  record.fields.↖︎ Longitude,        //
            // '↖︎ latitude':   record.fields.↖︎ Latitude,        //
            'description':   record.fields.Description,


          })),
          // [
          //   {
          //     id: 'featureID',
          //     latitude: 52.520348,
          //     longitude: 13.407984,
          //     //
          //     '↙︎ longitude': '',       //
          //     '↙︎ latitude': '',        //
          //     '↗︎ longitude': '',        //
          //     '↗︎ latitude': '',       //      geoJSON parser should ignore these,
          //     '↘︎ longitude': '',       //      if they have a value, the first image is
          //     '↘︎ latitude': '',        //      put directly on the map
          //     '↖︎ longitude': '',        //
          //     '↖︎ latitude': '',        //
          //     name: 'Feature 1',
          //     // icon: '',
          //     description: 'Ipsum Lorem',
          //     images: [
          //       {id: 'id', url: 'url', height: 1000, width: 1000},
          //     ],
          //     // geoJSON: [{"type": "Point", "coordinates": [125.6, 10.2]},{"type": "Point", "coordinates": [125.6, 10.1]}],
          //     colour: 'blau',
          //     // …and more with spread operator
          //   }
          // ],
        }
);
        break;


      default:
        console.log(`No render style found for ${tableObject}. Applying 'Points'`);
        console.log(tableObject);
        return new PointLayer({
          id: tableObject.id,
          name: tableObject.table,
          mapLayers: [],
          icons: tableObject.icons,
          description: tableObject.description,
          images: tableObject.images,
      //  geoJSON: , not implemented yet
          features: tableObject.records.map(record => ({
            'id':           record.id,
            'name':         record.fields.Name,
            'icon':         record.fields.icon,
            'longitude':    record.fields.Longitude,
            'latitude':     record.fields.Latitude,
            // '↙︎ longitude':  record.fields.↙︎ Longitude,       //
            // '↙︎ latitude':   record.fields.↙︎ Latitude,        //
            // '↗︎ longitude':  record.fields.↗︎ Longitude,        //
            // '↗︎ latitude':   record.fields.↗︎ Latitude,       //      geoJSON parser should ignore these,
            // '↘︎ longitude':  record.fields.↘︎ Longitude,       //      if they have a value, the first image is
            // '↘︎ latitude':   record.fields.↘︎ Latitude,        //      put directly on the map
            // '↖︎ longitude':  record.fields.↖︎ Longitude,        //
            // '↖︎ latitude':   record.fields.↖︎ Latitude,        //
            'description':   record.fields.Description,


          })),
          // [
          //   {
          //     id: 'featureID',
          //     latitude: 52.520348,
          //     longitude: 13.407984,
          //     //
          //     '↙︎ longitude': '',       //
          //     '↙︎ latitude': '',        //
          //     '↗︎ longitude': '',        //
          //     '↗︎ latitude': '',       //      geoJSON parser should ignore these,
          //     '↘︎ longitude': '',       //      if they have a value, the first image is
          //     '↘︎ latitude': '',        //      put directly on the map
          //     '↖︎ longitude': '',        //
          //     '↖︎ latitude': '',        //
          //     name: 'Feature 1',
          //     // icon: '',
          //     description: 'Ipsum Lorem',
          //     images: [
          //       {id: 'id', url: 'url', height: 1000, width: 1000},
          //     ],
          //     // geoJSON: [{"type": "Point", "coordinates": [125.6, 10.2]},{"type": "Point", "coordinates": [125.6, 10.1]}],
          //     colour: 'blau',
          //     // …and more with spread operator
          //   }
          // ],
        }
);
        break;
    }

  })
}
// parseTableObjects(sampleTableObjects);


let layerObjects = new Promise(function(resolve, reject) {
  getTables().then(
    requestedTables => parseTableObjects(requestedTables)
  ).then(
    requestedTables => resolve(requestedTables)
  );
});
export default layerObjects;

/* Classes */



// let sampleOptionsObject = {
//   name: 'sampleOptionsObject',
//   render: 'Cards'
//   features: [
//     {name: 'Feature 1', latitude: 52.520348, longitude: 13.407984}
//   ],
// }
//
// let test = new PointLayer(sampleOptionsObject)
//
// for (let method in test) console.log(method);
// console.log(test);
