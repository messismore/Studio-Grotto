import airtableLayerObjectsPromise from '../Studio-Grotto/lib/airtable.js';
import jsonLayerObjectsPromise from '../Studio-Grotto/lib/json.js';
import notesLayerObjectPromise from '../Studio-Grotto/lib/notesLayer.js'
import '../Studio-Grotto/lib/geojson.min.js';


const projectionMode = document.URL.match('Projection') ? true : false;
const testMode       = document.URL.match('Test') ? true : false;

mapboxgl.accessToken = 'pk.eyJ1IjoibWVzc2lzbW9yZSIsImEiOiJjamF6aDJiNHEwbXBvMzJvNjUwdDdrbzRsIn0.w0i5lPoQtsBo5yeue9lYeQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [13.40960,  52.52100],
    zoom: 15.5,

    // If projectionMode = true, disable zooming, panning, and rotate the map 45°
    bearing:          (projectionMode)? 45    : 0,
    scrollZoom:       (projectionMode)? false : true,
    boxZoom:          (projectionMode)? false : true,
    dragRotate:       (projectionMode)? false : true,
    dragPan:          (projectionMode)? false : true,
    doubleClickZoom:  (projectionMode)? false : true,
    touchZoomRotate:  (projectionMode)? false : true,

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

  layerObjects.forEach(layerObject => {

    // call add() to add them to the map
    layerObject.add(this);


    // add a link to the sidebar
    const link = document.createElement('a');
    link.href = '#';
    link.className = ''
    link.textContent = layerObject.name;

    link.onclick = event => {

      event.preventDefault();
      event.stopPropagation();

      const clickedLayers = layerObjects.filter(layerObject => layerObject.name === link.textContent)
      clickedLayers[0].visibility === 'none'

      ? clickedLayers.forEach(layerObject => {
          layerObject.mapLayers.forEach(mapLayer => {
            map.setLayoutProperty(mapLayer, 'visibility', 'visible')
            link.className = 'active'
          })
          try {layerObject.show()}
          catch(error) {console.log(error)}
          layerObject.visibility = 'visible'
      })

      : clickedLayers.forEach(layerObject => {
          layerObject.mapLayers.forEach(mapLayer => {
            map.setLayoutProperty(mapLayer, 'visibility', 'none')
            link.className = ''
          })
          try {layerObject.hide()}
          catch(error) {console.log(error)}
          layerObject.visibility = 'none'
        })
    }

    const menu = document.getElementById('menu');
    menu.appendChild(link);
  })
})
