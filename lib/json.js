// import '../lib/geojson.min.js';
// import { PointLayer, CardLayer } from './layerClasses.js';

const sources = {
  google:'../samples/googlemaps-data.json',
  instagram: '../samples/instagram-data.json',
  twitter: '../samples/twitter-data.json'
};


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
