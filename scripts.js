
mapboxgl.accessToken = 'pk.eyJ1IjoibWVzc2lzbW9yZSIsImEiOiJjamF6aDJiNHEwbXBvMzJvNjUwdDdrbzRsIn0.w0i5lPoQtsBo5yeue9lYeQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [13.41028,  52.52077],
    zoom: 16
 });

 const Airtable = require('airtable');
 const base = new Airtable({ apiKey: 'keyJ8TgEdfkjg9z3T' }).base('appaLLsrYXAAEG52k');

 function getRecords(table, ) {
   let retrievedRecords = [];
   base(table).select({
     // Selecting records in Grid view:
     view: "Grid view"
   }).eachPage(function page(records, fetchNextPage) {
     // This function (`page`) will get called for each page of records.

     records.forEach(function(record) {
       console.log('Retrieved', record.get('Name'));
       if (record.get('Name')) {
         retrievedRecords.push(record.fields);
       }
     });

     // To fetch the next page of records, call `fetchNextPage`.
     // If there are more records, `page` will get called again.
     // If there are no more records, `done` will get called.
     fetchNextPage();
   },
 ).then(
   response => {
     console.log(retrievedRecords);
     let retrievedGeoJson = GeoJSON.parse(
       retrievedRecords, {Point: ['Latitude', 'Longitude']}
     );
     console.log(retrievedGeoJson);
     map.addSource(
       'test',
       {
         'type': 'geojson',
         'data': retrievedGeoJson,
       },
     );
     map.addLayer({
         "id": "test",
         "type": "symbol",
         "source": "test",
         "layout": {
           "visibility": "visible",
           "icon-image": "{icon}-15",
          "text-field": "{Name}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
         },
      });
      const toggleableLayerIds = [ 'test', ];

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



          map.on('click', 'test', function (e) {
           new mapboxgl.Popup(keepInView = true)
               .setLngLat(e.features[0].geometry.coordinates)
               .setHTML(e.features[0].properties.Text)
               .addTo(map);
       });

       // Change the cursor to a pointer when the mouse is over the places layer.
       map.on('mouseenter', 'test', function () {
           map.getCanvas().style.cursor = 'pointer';
       });

       // Change it back to a pointer when it leaves.
       map.on('mouseleave', 'test', function () {
           map.getCanvas().style.cursor = '';
       });
      }
   }, error => {console.log(error)});
 };

map.on('load', function () {

  // map.addSource(
  //   'test',
  //   {
  //     "type": "geojson",
  //     "data": "https://messismore.github.io/Studio-Grotto/samples/Test.geojson"
  //   },
  // );
  // map.addLayer({
  //     "id": "test",
  //     "type": "line",
  //     "source": "test",
  //     "layout": {
  //       "visibility": "visible",
  //       "line-join": "round",
  //       "line-cap": "round",
  //     },
  //     "paint": {
  //       "line-color": "#888",
  //       "line-width": 8,
  //     }
  // });

  getRecords('Test')

});
