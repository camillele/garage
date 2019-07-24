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
let occupancyCount = document.getElementById("occupancycount");
let occupancyManagerCount = document.getElementById("occupancyManagerCount");
let occupancyVisitorCount = document.getElementById("occupancyVisitorCount");
let occupancyInternCount = document.getElementById("occupancyInternCount");
let dateNode = document.getElementById("date");
let presenceArray = [];
let presenceOfficeInterns = [];
let presenceOfficeManagers = [];
let presenceOfficeVisitors = [];
let internList = ["ac233f24ae6e"];
let managerList = ["ac233f265d90"];
let visitorList = ["ac233f24c069"];
const EARLIEST_YEAR = '2012';
const LATEST_YEAR = '2019';
let years = document.querySelectorAll('.year');
let cards = document.querySelector('#cards');

// Other variables
let baseUrl =
  window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  window.location.port;
let config = null;

// Other initialisation

const STORIES_BY_PERSON = {
  "2019": [
    "https://reelyactive.github.io/beacorcut-demos/stories/camille/",
    "https://reelyactive.github.io/beacorcut-demos/stories/furaha/"
  ]
};
// Update the year
function handleYearSelection(event) {
  let selectedYear = this;  // currentTarget of event
  let selectedYearId = selectedYear.getAttribute('id');

  years.forEach(function(year) {
    year.setAttribute('class', 'page-item year');
  });
  selectedYear.setAttribute('class', 'page-item year active');

  let selectedYearStoryUrls = STORIES_BY_PERSON[selectedYearId];
  updateCards(selectedYearStoryUrls);
}


// Update the cards to display based on the given story URLs
function updateCards(storyUrls) {
  while(cards.firstChild) {
    cards.removeChild(cards.firstChild);
  }

  storyUrls.forEach(function(storyUrl) {
    cormorant.retrieveStory(storyUrl, function(story) {
      let div = document.createElement('div');
      div.setAttribute('class', 'card bg-light');
      cards.appendChild(div);
      cuttlefish.render(story, div);
    });
  });
}


// Observe year selection clicks
years.forEach(function(year) {
  year.addEventListener('click', handleYearSelection);
});


// On page load, select the latest year
updateCards(STORIES_BY_PERSON[LATEST_YEAR]);



// Initialise beaver to listen for raddecs on the websocket
function initialiseBeaver(hlcServerUrl) {
  let socket = io.connect(hlcServerUrl);
  beaver.listen(socket, true);

  // All events
  beaver.on([0, 1, 2, 3, 4], function(raddec) {
    let isDisappearance = raddec.events.includes(4);
    let isDisplacement = raddec.events.includes(1);
    handleRaddec(raddec, isDisappearance);
  });
}

// Handle incoming raddec
function handleRaddec(raddec, isDisappearance, isDisplacement) {
  switch (raddec.transmitterId) {
    case config.environmentalBeaconId:
      handleEnvironmentalBeacon(raddec);
      break;
    default:
      updateOccupancy(raddec, isDisappearance );
      updateListZones(raddec, isDisappearance );
      displayDisplacement(raddec,isDisplacement);
  }
}

//function is displacement 
function displayDisplacement(raddec,isDisplacement) {
  if (isDisplacement) {
    if(presenceOfficeInterns.includes(raddec.transmitterId)) {
      idDisplacementIntern.className = "spinner-grow text-danger";
    }
    else if(presenceOfficeManagers.includes(raddec.transmitterId)) {
      idDisplacementManager.className = "spinner-grow text-warning";
    }
    else if(presenceOfficeVisitors.includes(raddec.transmitterId)) {
      idDisplacementVisitor.className = "spinner-grow text-secondary";
    }
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
        console.log(raddec);
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

// List person in the Office
function updateListZones(raddec, isDisappearance) {
  let isOccupant = raddec.transmitterId.startsWith("ac233");
  let isOffice = raddec.rssiSignature[0].receiverId.includes("0279");
  let isIntern = internList.includes(raddec.transmitterId);
  let isManager = managerList.includes(raddec.transmitterId);
  let isVisitor = visitorList.includes(raddec.transmitterId);
  if(isOccupant) {
    if(isOffice) {
      //Display  number of interns for the Office
      if(isIntern) {
        if(!isDisappearance) {
          if(!presenceOfficeInterns.includes(raddec.transmitterId)) {
            presenceOfficeInterns.push(raddec.transmitterId);
            occupancyInternCount.textContent = presenceOfficeInterns.length;
          }
        } 
        else {
          if(presenceOfficeInterns.includes(raddec.transmitterId)) {
            presenceOfficeInterns.splice(presenceOfficeInterns.indexOf(raddec.transmitterId), 1);
            occupancyInternCount.textContent = presenceOfficeInterns.length;
            console.log(raddec.transmitterId);
          }
        }
      }
      //Display number of managers for the office
      else if(isManager) {
        if(!isDisappearance) {
          if(!presenceOfficeManagers.includes(raddec.transmitterId)) {
            presenceOfficeManagers.push(raddec.transmitterId);
            occupancyManagerCount.textContent = presenceOfficeManagers.length;
          }
        } 
        else {
          if(presenceOfficeManagers.includes(raddec.transmitterId)) {
            presenceOfficeManagers.splice(presenceOfficeManagers.indexOf(raddec.transmitterId), 1);
            occupancyManagerCount.textContent = presenceOfficeManagers.length;
          }
        }
      } 
      //Display number of visitors for the office
      else if(isVisitor) {
        if(!isDisappearance) {
          if(!presenceOfficeVisitors.includes(raddec.transmitterId)) {
            presenceOfficeVisitors.push(raddec.transmitterId);
            occupancyVisitorCount.textContent = presenceOfficeVisitors.length;
          }
        } 
        else {
          if(presenceOfficeVisitors.includes(raddec.transmitterId)) {
            presenceOfficeVisitors.splice(presenceOfficeVisitors.indexOf(raddec.transmitterId), 1);
            occupancyVisitorCount.textContent = presenceOfficeVisitors.length;
          }
        }
      }
    }
  }
  return presenceOfficeInterns, presenceOfficeManagers, presenceOfficeVisitors;
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
