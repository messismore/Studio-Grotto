import { PointLayer, CardLayer, SidebarLayer } from './layerClasses.js';

const sources = {
  google:'../samples/google-data.json',
  instagram: '../samples/instagram-data.json',
  twitter: '../samples/twitter-data.json'
};


// let requestedTables = await index.map(async function(record) {
//   const tableObject = {
//     table : record.fields.Name,
//     render: record.fields.Render,
//     records : await getRecords(record.fields.Name).catch(error => []),
//     icons: [],
//   };

const assembleLayerObjects = async () => {

  const retrievedJson = Object.entries(sources).map(async ([resourceName, url]) => {
    const retrievedResource = fetch(url)
    .then(response => response.json())
    .then((out) => {
        return out;
    }).catch(err => console.error(err));
    return retrievedResource
  });

  console.log(await retrievedJson);
  Promise.all(retrievedJson).then( results => {
    console.log(results);

    //Assemble objects:
    const google = new CardLayer {
      
    }



  });
}

assembleLayerObjects()
// export default layerObjects
