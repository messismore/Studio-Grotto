const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'keyJ8TgEdfkjg9z3T' }).base('appaLLsrYXAAEG52k');

function getRecords(table, ) {
  let retrievedRecords = [];
  base(table).select({
    // Selecting records in Grid view:
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      console.log('Retrieved', record.get('Name'));
      if (record.get('Name')) {
        retrievedRecords.push(record.fields);
      }
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
  },
).then(
  response => {
    console.log(retrievedRecords);
    let retrievedGeoJson = GeoJSON.parse(
      retrievedRecords, {Point: ['Latitude', 'Longitude']}
    );
    console.log(retrievedGeoJson);
    return retrievedGeoJson
  }, error => {console.log(error)});
};

let letsWait = getRecords('Index');
console.log(letsWait.Name+'Ergebnis');

console.log(letsWait);
window.setTimeout(console.log(letsWait), 10000);
