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


import './geojson.min.js'
import { PointLayer, CardLayer } from './layerClasses.js';

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
    return {
      table : record.fields.Name,
      records : await getRecords(record.fields.Name).catch(error => [])
    }
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


let sampleTableObjects = [
  {
    table: 'Test',
    records: [
      {
        id: "recS3q1jo5BoaVYVE",
        fields: {
          Name: "Feature 1", Latitude: 52.520348, Longitude: 13.407984, Text: "Lorem Ipsum dolor sit amet.",
        },
      },
      {
        id: "recFUBHUK4lGC4rVY", fields: {
          Name: "Feature 2", Latitude: 52.520126, Longitude: 13.408318
        }
      },
    ],
  },
]

let parseTableObjects = function(tableObjects) {
  return tableObjects.map(tableObject => {
    return new CardLayer({
      name: tableObject.table,
      features: tableObject.records.map(records => records.fields),
    })
  })
}
// parseTableObjects(sampleTableObjects);


// later: export this:
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
//   features: [
//     {name: 'Feature 1', latitude: 52.520348, longitude: 13.407984}
//   ],
// }
//
// let test = new PointLayer(sampleOptionsObject)
//
// for (let method in test) console.log(method);
// console.log(test);
