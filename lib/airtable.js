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
import { PointLayer, CardLayer, SidebarLayer, ImageLayer, GeoJSONLayer } from './layerClasses.js';

const Airtable = require('airtable');
const base = new Airtable({apiKey: 'keyJ8TgEdfkjg9z3T'}).base('appaLLsrYXAAEG52k');

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
  let index = await getRecords('Index');
  // Catch errors to make sure the Promise resolves, because we want to use
  // Promise.all later on. In case of an error simply return [].
  let requestedTables = await index.map(async function(record) {
    const tableObject = {
      table : record.fields.Name,
      render: record.fields.Render,
      records : await getRecords(record.fields.Name).catch(error => []),
      icons: [],
    };

    if ('Icon' in record.fields) {
      tableObject.icons.push({
        name: record.fields.Icon[0].id, url: record.fields.Icon[0].url
      });
    } else {console.log(`No Icon in ${record.fields.Name}.`)};

  // iterate over object and if there is a fields.Icon, use it's name
  // for fields.icon, push its name and url to object.icons
  // else if there is 'Icon' in records.fields, use that.

    tableObject.records.map(
      feature => {
        if ('Icon' in feature.fields) { // this doesnt work because objec
          const iconImageProps = [feature.fields.Icon[0].id, feature.fields.Icon[0].url];
          tableObject.icons.push({name: iconImageProps[0], url: iconImageProps[1]});
          Object.defineProperty(feature.fields, 'icon', {
            value: iconImageProps[0],
            writeable: true,
            enumerable: true
          });
        } else if ('Icon' in record.fields) {
          const iconImageProps = [record.fields.Icon[0].id, null];
          Object.defineProperty(feature.fields, 'icon', {
            value: iconImageProps[0],
            writeable: true,
            enumerable: true
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
        return new PointLayer({
          name: tableObject.table,
          icons: tableObject.icons,
          features: tableObject.records.map(record => record.fields),
        });
        break;

      case 'Card':
        return new CardLayer({
          name: tableObject.table,
          icons: tableObject.icons,
          features: tableObject.records.map(record => record.fields),
        });
        break;

      case 'Sidebar':
        return new SidebarLayer({
          name: tableObject.table,
          icons: tableObject.icons,
          features: tableObject.records.map(record => record.fields),
        });
        break;

        case 'Image':
          return new ImageLayer({
            name: tableObject.table,
            features: tableObject.records.map(record => record.fields),
          });
          break;

          case 'GeoJSON':
            return new GeoJSONLayer({
              name: tableObject.table,
              geoJSON: GeoJSON.parse(tableObject.records.map(record => {
                let geoJSON = JSON.parse(record.fields.geoJSON);
                console.log('1', geoJSON);
                record.fields.geoJSON = geoJSON.features.map(feature => feature.geometry)[0];
                console.log(record.fields.geoJSON);
                return record.fields;
              }), {GeoJSON: 'geoJSON'}),
            });
            break;

      default:
        console.log(`No render style found for ${tableObject}. Applying 'Points'`);
        return new PointLayer({
          name: tableObject.table,
          icons: tableObject.icons,
          features: tableObject.records.map(records => records.fields),
        });
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
