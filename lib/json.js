<<<<<<< HEAD
// import '../lib/geojson.min.js';
// import { PointLayer, CardLayer } from './layerClasses.js';
=======
import '../lib/geojson.min.js';
import { PointLayer, CardLayer } from './layerClasses.js';
>>>>>>> 071d9cbb7d51f3e2c061f85800ea9fa6c2209fe0

const sources = {
  google:'../samples/googlemaps-data.json',
  instagram: '../samples/instagram-data.json',
  twitter: '../samples/twitter-data.json'
};


<<<<<<< HEAD
// let retrievedJson = Object.keys(sources).forEach(key => $.getJSON(sources.key));
// console.log(retrievedJson);

// Object.entries(sources).forEach(
//     ([key, value]) => console.log(key, value)
// );

const retrievedJson =
  Object.entries(sources).map(([key, value) => $.getJSON(value, json => json.resonseText);

setTimeout(function () {
  console.log(retrievedJson)
}, 1000)
=======
let retrievedJson = sources.map(
  file => $.getJSON(file);
  console.log(file);
);
>>>>>>> 071d9cbb7d51f3e2c061f85800ea9fa6c2209fe0
