mapboxgl.accessToken = 'pk.eyJ1IjoibW9hZGRpbiIsImEiOiJjamNuNzQxeXAwZzhhMzNvN3A0NTZoMmoyIn0.9k5cZJwF-851R-mSJjkLCQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [13.409280, 52.520920],
    zoom: 16,
    hash: true,
});

//    data = JSON.stringify(json);
//    data = json.load(json)

var geojson = {};
geojson['type'] = 'FeatureCollection';
geojson['features'] = [];
var inputfeatures = {}

    $.getJSON("google-data.json", function(json2) {
        console.log(json2)
    })

      map.on('load', function () {
          
        $.getJSON("twitter-data.json", function(json) {
        console.log(json[0]);
        for (i=0; i < json.length; i++) {
        var newFeature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [json[i].longitude, json[i].latitude]
            },
            "properties": {
			"title": json[i].text,
			"icon": "post"
		}
        }
	geojson['features'].push(newFeature);
        }
        map.addLayer({
            "id": "route",
            "type": "line",
            "source": {
                "type": "geojson",
                 "data": {
                     "type": "Feature",
                     "properties": {},
                     "geometry": {
                         "type": "LineString",
                         "coordinates": [
                           [13.409510850906372, 52.52224008961698],
                           [13.40506911277771, 52.52002051452143],
                           [13.407279253005981, 52.518251302292406],
                           [13.412128686904907, 52.5205950035378],
                           [13.409510850906372, 52.52224008961698]
                         ]
                       }
                     }
                  },
            "layout": {
              "line-join": "round",
              "line-cap": "round"
            },
            "paint": {
              "line-color": "#888",
              "line-width": 8
            }
        });
            
            map.addLayer({      
                    "id": "pointstwitter",
                    "type": "symbol",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection", 
                            "features": geojson.features
                        }
                    },
                    "layout": {
                        "icon-image": "{icon}-15",
                        "text-field": "{title}",
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-offset": [0, 0.6],
                        "text-anchor": "top"
                    }
                });

            map.addLayer({      
                    "id": "pointsgoogle",
                    "type": "symbol",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection", 
                            "features":[{
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [13.4093085, 52.5230604]
                                },
                                "properties": {
                                    "title": "Alexanderplatz Apartments: Nice and clean apartment. WIFI is avalable for free. Friendly staff did guide us to the nearest and cheapest carpark. 5.5 euro/day. Close (some would say too close) to railway station.",
                                    "icon": "monument"
                                }
                            }, {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [13.4055461, 52.5212336]
                                },
                                "properties": {
                                    "title": "Citystay: Wer hier herkommt, tut das wohl in erster Linie wegen der unschlagbaren Preise und wegen der sehr zentralen Lage nahe des Alexanderplatzes. Viel darf man allerdings nicht erwarten. Frühstücksbuffet genügt nur niedrigsten Ansprüchen, in den Dorms bekommt man nur mit Glück eine freie Steckdose. Zum übernachtan aber okay.",
                                    "icon": "monument"
                                }
                            }, {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [13.4086124, 52.52322089999999]
                                },
                                "properties": {
                                    "title": "Hotel Motel One: Ein gutes Hotel, wie ich meine. Sauber, freundliches Personal. Die Lage ist gut, der öffentliche Nahverkehr direkt vor der Nase. Das muss man wörtlich nehmen. Und vertragen, denn die S-Bahn rauscht im Minutentakt am Fenster vorbei. Die Nächte können also was kürzer sein, die guten Betten gleichen das gut aus.",
                                    "icon": "monument"
                                }
                            }, {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [13.4129548, 52.5227689]
                                },
                                "properties": {
                                    "title": "Park Inn: Sehr schlechter Service. Freunde aus dem Ausland hatten das falsche Park - Inn gebucht. Es war partout nicht möglich sie in dem gewünschten Hotel (also dem gewüschten Park Inn) unterzubringen. Da frage ich mich schon wozu die  Hotels als Kette firmieren bzw. den gleichen Namen benutzen.",
                                    "icon": "monument"
                                }
                            }, {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [13.404264, 52.521648]
                                },
                                "properties": {
                                    "title": "Hotel Alexander Plaza: Meine Übernachtung in in diesem Hotel war eine Katastrophe. Das Zimmer war mehr ein Abstellraum mit ein Bett wo die Matratze durchgelegen war und nur 190 cm lang war, ich 184 cm. Es gab noch nicht einmal ein Kaffee-Tee Zubereitungsmöglichkeit. Der Stuhl im Zimmer war total abgenutzt. Habe 95 € bezahlt, ohne Frühstück eine abzulute Frechheit.",
                                    "icon": "monument"
                                }
                            }]
                        }
                    },
                    "layout": {
                        "icon-image": "{icon}-15",
                        "text-field": "{title}",
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-offset": [0, 0.6],
                        "text-anchor": "top"
                    }
                });
      });
});



