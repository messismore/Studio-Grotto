import { PointLayer } from '../Studio-Grotto/lib/layerClasses.js';
import airtableLayerObjectsPromise from '../Studio-Grotto/lib/airtable.js';
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
  let airtableLayerObjects = await airtableLayerObjectsPromise;
  console.log('airtableLayerObjects:', airtableLayerObjects);
  airtableLayerObjects.map(object => object.add(this))

  const toggleableLayerIds = airtableLayerObjects.map(object => object.name)
  for (let i = 0; i < toggleableLayerIds.length; i++) {
    let id = toggleableLayerIds[i];

    let link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
      let clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();

      let visibility = map.getLayoutProperty(clickedLayer, 'visibility');

      if (visibility === 'visible') {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        this.className = '';
      } else {
        this.className = 'active';
        map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
      }
    };

    const layers = document.getElementById('menu');
    layers.appendChild(link);

  };
});
