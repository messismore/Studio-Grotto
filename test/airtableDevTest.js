const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'keyJ8TgEdfkjg9z3T' }).base('appaLLsrYXAAEG52k');

/*
Loads data from Airtable.com and returns an array of Layer objects.

1. Get index
2. iterate through the returned array (map()? Parallel? contructing an object
.
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
        retrievedRecords.push(record.fields);
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
  let requestedTables = index.map(record => getRecords(record.Name));
  Promise.all(requestedTables).then(
    requestedTables => {
      console.log(' Success:', requestedTables);
      return requestedTables;
    }
  )
};

getTables()
