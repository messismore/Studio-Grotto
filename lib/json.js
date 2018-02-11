// import '../lib/geojson.min.js';
import { PointLayer, CardLayer, SidebarLayer } from './layerClasses.js';

const sources = {
  google:'../samples/google-data.json',
  instagram: '../samples/instagram-data.json',
  twitter: '../samples/twitter-data.json'
};


let assembleLayerObjects = async () => {
  let retrievedJson = Promise.all(
    Object.entries(sources).map(([resourceName, url]) => {
      fetch(url)
      .then(response => response.json())
      .then((out) => {
          console.log('Output: ', out);
      }).catch(err => console.error(err));
    }
  ));
  console.log(await retrievedJson[0]);
}


// export default layerObjects
