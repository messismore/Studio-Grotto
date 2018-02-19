import './geojson.min.js';
import { PointLayer, CardLayer, SidebarLayer } from './layerClasses.js';

const sources = {
  google:'../Studio-Grotto/samples/google-data.json',
  instagram: '../Studio-Grotto/samples/instagram-data.json',
  twitter: '../Studio-Grotto/samples/twitter-data.json'
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

  // console.log(await retrievedJson);
  const layerObjects = Promise.all(retrievedJson).then( results => {
    // console.log('zwei', results);

    //Assemble objects:
    const google = new CardLayer({
      name: 'Google Maps reviews',
      icons: [
        {id: 'google', url:'../Studio-Grotto/samples/google.svg'},
      ],
      features: results[0].map(record => ({
        Name: record.name,
        icon: 'google',
        Longitude: record.longitude,
        Latitude: record.latitude,
        Description: `<p class= rating>${record.rating} Sterne</p><p class= review>${record.review}</p>`,
      }))
    });

    const instagram = new CardLayer({
      name: 'Instagram Posts',
      icons: [
        {id: 'instagram', url:'../Studio-Grotto/samples/instagram.svg'},
      ],
      features: results[1].map(record => ({
        icon: 'instagram',
        Longitude: record.location.longitude,
        Latitude: record.location.latitude,
        Description: record.edge_media_to_caption.edges[0] ? record.edge_media_to_caption.edges[0].node.text : undefined,
        Image: record.urls[0] ? [{
          id: record.id,
          url:record.urls[0]
        }] : undefined,
      }))
    });

    // const hashtags = new CardLayer({
    //   name: 'Hashtags',
    //   icons: [
    //     {name: 'hashtag', url:'../Studio-Grotto/samples/hashtag.svg'},
    //   ],
    //   features: results[1].map(record => {
    //     return {
    //       icon: 'hashtag',
    //       Longitude: record.location.longitude,
    //       Latitude: record.location.latitude,
    //       Description: record.tags ? '#' + record.tags.join(' #') : 'undefined',
    //     };
    //   })
    // });

    const twitter = new CardLayer({
      name: 'Tweets',
      icons: [
        {id: 'twitter', url:'../Studio-Grotto/samples/twitter.svg'},
      ],
      features: results[2].map(record => ({
        Name: '@' + record.username,
        icon: 'twitter',
        Longitude: record.longitude,
        Latitude: record.latitude,
        Description: record.text,
        Image: record.urls ? [{
          id: record.id,
          url:record.urls[0]
        }] : undefined,
      }))
    })


    return [twitter, instagram, google]
  });
  // console.log('eins', layerObjects);
  return layerObjects;
}

let layerObjects = new Promise(function(resolve, reject) {
  assembleLayerObjects()
  .then(layerObjects => resolve(layerObjects));
});

export default layerObjects;

// export default layerObjects
