/*
{
  name: 'Layer Name',
  methods: {
    'addSource': [arg1, arg2, arg3]
    …
  },
  geojson: {
    'type': 'FeatureCollection',
    'features': [
      {feature},
      {…}
    ]
  },
  etc: { // schlechter Name
         // ev. für Daten, die nicht in GeoJSON passen (Pikts, …)
  }
}
*/


class PointLayer {
  constructor(optionsObject) {
    this.name = optionsObject.name
    this.methods = [
      {'addSource': []},
      {'addLayer': []},
      {'on': []},
      {'on': []},
    ]
    this.geojson = {}
  }
}

let test = new PointLayer({name: 'Test'})

for (let method in test) console.log(method);
