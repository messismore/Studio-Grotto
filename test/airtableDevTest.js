const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'keyJ8TgEdfkjg9z3T' }).base('appaLLsrYXAAEG52k');

let getRecords = (table, callback) => {
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
}, function done(error) {
    console.log(error);
    callback(retrievedRecords);
});



};

// console.log(getRecords('Test')+'Yasss');
getRecords('Index', retrievedRecords => {
  getRecords(retrievedRecords[0].Name, scndResult => {
    console.log(scndResult + 'result')
  })})
