const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'keyJ8TgEdfkjg9z3T' }).base('appaLLsrYXAAEG52k');

function getRecords(table) {
  let retrievedRecords = [];
  base(table).select({
    // Selecting records in Grid view:
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        console.log('Retrieved', record.get('Name'));
        if (record.get('Name')) {
          console.log(record.fields);
          retrievedRecords.push(record.fields);
          console.log(retrievedRecords);
        }
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

  },
  function done(err) {
    if (err) { console.error(err); return; };
    console.log(JSON.stringify(retrievedRecords) + 'WTF');
  });
  return retrievedRecords;
};

let letsWait = getRecords('Index');

console.log(letsWait);
window.setTimeout(console.log(letsWait), 10000);
