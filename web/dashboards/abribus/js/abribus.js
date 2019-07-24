/**
 * Copyright reelyActive 2019
 * We believe in an open Internet of Things
 */

// Constants
const BASE_ROUTE = "/api/abribus";
const CONFIG_ROUTE = BASE_ROUTE + "/config";
const MINUTE_OF_HOUR_ROUTE = BASE_ROUTE + "/minuteofhour";
const HOUR_OF_DAY_ROUTE = BASE_ROUTE + "/hourofday";
const ZONE_BY_TIME_ROUTE = BASE_ROUTE + "/zonebytime";
const SEAT_OCCUPANCY_RSSI_THRESHOLD = -75;

// DOM elements
let temperature = document.querySelector("#temperature");
let humidity = document.querySelector("#humidity");
let displayStatus = document.querySelector("#displaystatus");
let displayStatusIcon = document.querySelector("#displaystatusicon");
let leftSeat = document.querySelector("#leftseat");
let rightSeat = document.querySelector("#rightseat");
let occupancyCount = document.getElementById("occupancycount");
let dateNode = document.getElementById("date");
let presenceArray = [];

// Other variables
let baseUrl =
  window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  window.location.port;
let config = null;

// Other initialisation

// Initialise beaver to listen for raddecs on the websocket
function initialiseBeaver(hlcServerUrl) {
  let socket = io.connect(hlcServerUrl);
  beaver.listen(socket, true);

  // All events
  beaver.on([0, 1, 2, 3, 4], function(raddec) {
    let isDisappearance = raddec.events.includes(4);
    handleRaddec(raddec, isDisappearance);
  });
}

// Handle incoming raddec
function handleRaddec(raddec, isDisappearance) {
  switch (raddec.transmitterId) {
    case config.environmentalBeaconId:
      handleEnvironmentalBeacon(raddec);
      break;
    case config.leftSeatBeaconId:
      handleLeftSeatBeacon(raddec);
      break;
    case config.rightSeatBeaconId:
      handleRightSeatBeacon(raddec);
      break;
    case config.displayBeaconId:
      handleDisplayBeacon(raddec);
      break;
    default:
      updateOccupancy(raddec, isDisappearance );
  }
}

// Increment/Decrement number of occupants
function updateOccupancy(raddec, isDisappearance) {
  let isOccupant = raddec.transmitterId.startsWith("ac233");
  if(isOccupant) {
    if(!isDisappearance) {
      if(!presenceArray.includes(raddec.transmitterId)) {
        presenceArray.push(raddec.transmitterId);
        occupancyCount.textContent = presenceArray.length;
      }
    } 
    else {
      if(presenceArray.includes(raddec.transmitterId)) {
        presenceArray.splice(presenceArray.indexOf(raddec.transmitterId), 1);
        occupancyCount.textContent = presenceArray.length;
      }
    }
  }
  return presenceArray.length;
}

function dispTime() {
  let now = new Date();
}

// Handle environmental beacon data
function handleEnvironmentalBeacon(raddec) {
  let packet = raddec.packets[0];
  //let isSensorPacket = packet && packet.length === 72;
  let isSensorPacket = packet && packet.length === 64;
  let valueTemperature;

  if (isSensorPacket) {
    let t =
      parseInt(packet.substr(44, 2), 16) +
      parseInt(packet.substr(46, 2), 16) / 256;
    let h =
      parseInt(packet.substr(48, 2), 16) +
      parseInt(packet.substr(50, 2), 16) / 256;
    temperature.textContent = t.toFixed(1);
    humidity.textContent = h.toFixed(1);
  }
}

// Handle left seat beacon data
function handleLeftSeatBeacon(raddec) {
  let rssi = raddec.rssiSignature[0].rssi;
  if (rssi > SEAT_OCCUPANCY_RSSI_THRESHOLD) {
    id_seatLeft.className = "card text-white bg-success mb-3";
  } else {
    id_seatLeft.className = "card text-white bg-danger mb-3";
  }
}

// Handle right seat beacon data
function handleRightSeatBeacon(raddec) {
  let rssi = raddec.rssiSignature[0].rssi;
  if (rssi > SEAT_OCCUPANCY_RSSI_THRESHOLD) {
    id_seatRight.className = "card text-white bg-success mb-3";
  } else {
    id_seatRight.className = "card text-white bg-danger mb-3";
  }
}

// Handle left seat beacon data
function handleDisplayBeacon(raddec) {
  let packet = raddec.packets[0];
  let isSensorPacket = packet && packet.length === 58;

  if (isSensorPacket) {
    let isVisibleLight = parseInt(packet.substr(44, 2), 16) > 0;
    if (isVisibleLight) {
      id_status.className = "card text-white bg-success mb-3";
      displayStatusIcon.style.transform  = "rotate(0deg)";
      displayStatusIcon.style.color  = "white";
    } else {
      id_status.className = "card text-white bg-danger mb-3";
      displayStatusIcon.style.transform  = "rotate(180deg)";
      displayStatusIcon.style.color  = "white";
    }
  }
}

// Update each of the graphs in sequence
function updateGraphs() {
  console.log("Updating graphs at", new Date().toLocaleTimeString());

  // Hour of Day graph
  getJson(baseUrl + MINUTE_OF_HOUR_ROUTE, function(response) {
    if (response) {
      let minuteofhour = response;
      const trace1 = {
        x: minuteofhour.x,
        y: minuteofhour.y,
        type: "scatter",
        market: {
          opacity: 0.7,
          color: "rgb(49,130,189)"
        }
      };
      const data = [trace1];
      const layout = {
        xaxis: {
          tickangle: -45
        }
      };
      Plotly.newPlot("linechart", data, layout, { showSendToCloud: true });
      // Day of Week graph
      getJson(baseUrl + HOUR_OF_DAY_ROUTE, function(response) {
        if (response) {
          let hourofday = response;
          var trace1 = {
            x: hourofday.x,
            y: hourofday.y,
            type: "bar",
            name: "Affluence Semaine",
            marker: {
              color: "rgb(49,130,189)",
              opacity: 0.7
            }
          };
          var data = [trace1];
          var layout = {
            xaxis: {
              tickangle: -45
            }
          };
          Plotly.newPlot("barchart", data, layout, { showSendToCloud: true });

          // Zone by Time graph
          getJson(baseUrl + ZONE_BY_TIME_ROUTE, function(response) {
            if (response) {
              let zonebytime = response;
              var data = [
                {
                  z: zonebytime.z,
                  x: zonebytime.x,
                  y: zonebytime.y,
                  type: "heatmap"
                }
              ];
              var layout = {
                xaxis: {
                  tickangle: -45
                }
              };
              Plotly.newPlot("heatmap", data, layout, { showSendToCloud: true});
            }
          });
        }
      });
    }
  });
}

// GET the JSON response from the given URL
function getJson(url, callback) {
  let httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        return callback(JSON.parse(httpRequest.responseText));
      } else {
        console.log("Error", httpRequest.status, "on GET", url);
        return callback(null);
      }
    }
  };
  httpRequest.open("GET", url);
  httpRequest.setRequestHeader("Accept", "application/json");
  httpRequest.send();
}

// Updare Time
function updateClock() {
  let now = new Date();
  dateNode.innerText = now.toLocaleTimeString("en-US",{ hour12:false });
}

// Parse the config and start periodic data update 
function handleConfigAndStart(response) {
  if(response) {
    config = response;
    initialiseBeaver(config.hlcServerUrl);
    updateGraphs();
    setInterval(updateGraphs, config.updateGraphsMilliseconds);
  } 
  else {
    console.log("Unable to get config.  Refresh page to try again.");
  }
}

// The following code runs on startup...
getJson(baseUrl + CONFIG_ROUTE, handleConfigAndStart);
setInterval(updateClock, 1000);
