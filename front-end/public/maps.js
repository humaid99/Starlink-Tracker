// documentation: https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html
// documentation MapView 2D: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html
// documentation SceneView 3D: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html

let satTrackData;

function getTrackData() {
  fetch("/mapData/satrec")
    .then((response) => response.json())
    .then((data) => {
      satTrackData = data;
      // console.log(satTrackData);
    })
}

fetch("/mapData")
  .then((response) => response.json())
  .then((data) => {
    // console.log(data);
    let satellites = data.sat;
    let satLength = satellites.length;
    let satNames = [];

    function getSatLoc(i) {
      return {
        type: "point",
        x: satellites[i].x,
        y: satellites[i].y,
        z: satellites[i].z
      };
    }

    // Push all satellite names to global list
    for (let sat = 0; sat < satLength; sat++) {
      satNames.push(satellites[sat].satName);
    }

    require([
      "esri/Map", 
      "esri/views/SceneView",
      "esri/layers/GraphicsLayer",
      "esri/Graphic"
      ], function (Map, SceneView, GraphicsLayer, Graphic) {
        // Initialize basemap
        var map = new Map({
          basemap: "dark-gray",
          ground: "world-elevation" // show elevation
        });
        
        // Initialize globe and its properties
        var view = new SceneView({
          container: "viewDiv",
          map: map,
          constraints: {
            altitude: {
              max: 27500000
            }
          },
          popup: {
            dockEnabled: true,
            dockOptions: {
              breakpoint: false
            }
          }
        });

        // Server call for satellite path tracking data
        getTrackData();

        // Popup event: clears all selections
        view.popup.watch("selectedFeature", function() {
          satelliteTrackLayer.removeAll();
        })

        // Popup event: shows satellite's track
        view.popup.on("trigger-action", function(event) {
          if (event.action.id === "showTrack") {
            let chosenSat = view.popup.selectedFeature.attributes.name;
            let features = [];
            let loc = satTrackData;

            let locSatNames = Object.keys(loc);

            for (let satId of locSatNames) {
              if (chosenSat === satId) {
                let sat = chosenSat;

                for (let i = 0; i < 24 * 60; i++) { // Max orbit 24 * 55
                  features.push([loc[sat][i].x, loc[sat][i].y, loc[sat][i].z]);
                }
                break;
              }
            }

            let track = new Graphic({
              geometry: {
                type: "polyline",
                paths: [features]
              },
              symbol: {
                type: "line-3d",
                symbolLayers: [{
                  type: "line",
                  material: {
                    color: [192, 192, 192, 0.5]
                  },
                  size: 3,
                  cap: "round"
                }]
              }
            })

            satelliteTrackLayer.add(track);

          }
        })

        // Make and add layers to base map
        let satelliteLayer = new GraphicsLayer();
        let satelliteTrackLayer = new GraphicsLayer();
        map.addMany([satelliteLayer, satelliteTrackLayer]);

        // Create satellite graphics at (x, y, z) point
        for (let i = 0; i < satLength; i++) {
          let satLoc = getSatLoc(i);
          let satName = satellites[i].satName;
          let satId = satellites[i].id;

          let xLoc = satLoc.x;
          let yLoc = satLoc.y;
          let zLoc = satLoc.z;
          let xVelocity = satellites[i].tableData.velocity.x;
          let yVelocity = satellites[i].tableData.velocity.y;
          let zVelocity = satellites[i].tableData.velocity.z;
          let vals = [xLoc, yLoc, zLoc, xVelocity, yVelocity, zVelocity];
          vals = vals.map(x => x.toFixed(10));
          zLoc = zLoc.toFixed(6);

          let contentText = `
            <table>
              <tr>
                <td>
                  <b>Norad Id:</b> ${satId}
                </td>
                <td>
                </td>
              </tr>
              <tr>
                <td>
                  <b>x-pos: </b> ${vals[0]}
                </td>
                <td>
                  <b>x-vel: </b> ${vals[3]} km/s
                </td>
              </tr>
              <tr>
                <td>
                  <b>y-pos: </b> ${vals[1]}
                </td>
                <td>
                  <b>y-vel: </b> ${vals[4]} km/s
                </td>
              </tr>
              <tr>
                <td>
                  <b>z-pos: </b> ${zLoc}
                </td>
                <td>
                  <b>z-vel: </b> ${vals[5]} km/s
                </td>
              </tr>
            </table>
          `;

          let template = {
            title: satName,
            content: contentText,
            actions: [{
              title: "Track Satellite Path",
              id: "showTrack"
            }]
          }
          
          let satGraphic = new Graphic({
            geometry: satLoc,
            symbol: {
              type: "picture-marker",
              url:
              "/sat.png",
              width: 45,
              height: 45
            },
            attributes: {
              name: satName
            },
            popupTemplate: template
          });

          satelliteLayer.add(satGraphic);
        };

        

    });
});