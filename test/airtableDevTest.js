const Airtable = require('airtable');
const base = new Airtable({apiKey: 'keyJ8TgEdfkjg9z3T'}).base('appaLLsrYXAAEG52k');

/*
Loads data from Airtable.com and returns an array of Layer objects.

{
  map.addSource(
    'test',
    {
      "type": "geojson",
      "data": "https://messismore.github.io/Studio-Grotto/samples/Test.geojson"
    },
}

1. Get index
2. iterate through the returned array (map()? Parallel? contructing an object:

.
.
Have an object that can be parsed to GeoJSON
*/

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
  let requestedTables = index.map(async function(record) {
    return {
      table : record.fields.Name,
      records : await getRecords(record.fields.Name).catch(error => [])
    }
  });
  Promise.all(requestedTables).then(  //Wait for all promises to resolve.
    requestedTables => {
      // Clean array from [].
      requestedTables = requestedTables.filter(
        table => table.records.length > 0
      );
      console.log(' Success:', requestedTables);
      return requestedTables;
    }
  )
};


getTables()
