import { PointLayer } from '/lib/layerClasses.js';
import airtableLayerObjects from '/lib/airtable.js';
import '/lib/geojson.min.js';




let logTables = async function(){console.log(await airtableLayerObjects)};

logTables();
