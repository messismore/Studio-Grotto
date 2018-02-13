import airtableLayerObjectsPromise from '../Studio-Grotto/lib/airtable.js';
import jsonLayerObjectsPromise from '../Studio-Grotto/lib/json.js';
import notesLayerObjectPromise from '../Studio-Grotto/lib/notesLayer.js'
import '../Studio-Grotto/lib/geojson.min.js';



mapboxgl.accessToken = 'pk.eyJ1IjoibWVzc2lzbW9yZSIsImEiOiJjamF6aDJiNHEwbXBvMzJvNjUwdDdrbzRsIn0.w0i5lPoQtsBo5yeue9lYeQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [13.41028,  52.52077],
    zoom: 16,
    bearing: 42
 });




map.on('load', async function () {
    
  const airtableLayerObjects = await airtableLayerObjectsPromise;
  const jsonLayerObjects = await jsonLayerObjectsPromise;
  const notesLayerObject = await notesLayerObjectPromise;
  console.log('airtableLayerObjects:', airtableLayerObjects,
              'jsonLayerObjects:', jsonLayerObjects);

  const layerObjects = [
    ...airtableLayerObjects,
    ...jsonLayerObjects,
    notesLayerObject,
  ];

  layerObjects.map(object => object.add(this))

  for (let i = 0; i < layerObjects.length; i++) {
    let id = layerObjects[i].name;

    let link = document.createElement('a');
    link.href = '#';
    link.textContent = id;

    link.onclick = function (e) {

      let mapLayers = [].concat(
        ...layerObjects.filter(
          layerObject => layerObject.name == this.textContent).
          map(layerObject => layerObject.mapLayers
        )
      ); // -> [ [ 'mapLayer1', 'mapLayer2' ] ]

      e.preventDefault();
      e.stopPropagation();

      console.log(JSON.stringify(mapLayers));
      if (mapLayers.length > 0) {
        console.log(mapLayers.length);
        mapLayers.map(mapLayer => {
          try {
            let visibility = map.getLayoutProperty(mapLayer, 'visibility');

            if (visibility === 'visible') {
              map.setLayoutProperty(mapLayer, 'visibility', 'none');
              this.className = '';
            } else {
              this.className = 'active';
              map.setLayoutProperty(mapLayer, 'visibility', 'visible');
            }
          }
          catch(error) {console.log(error)}
        });
      }
    }

    const layers = document.getElementById('menu');
    layers.appendChild(link);

  };
});
