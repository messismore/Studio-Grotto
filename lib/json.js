import '../lib/geojson.min.js';
import { PointLayer, CardLayer } from './layerClasses.js';

const sources = {
  google:'../samples/googlemaps-data.json',
  instagram: '../samples/instagram-data.json',
  twitter: '../samples/twitter-data.json'
};


let retrievedJson = sources.map(
  file => $.getJSON(file);
  console.log(file);
);
