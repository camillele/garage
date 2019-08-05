/**
 * Copyright reelyActive 2019
 * We believe in an open Internet of Things
 */

// Constants
const BASE_ROUTE = "/api/ericsson";
const CONFIG_ROUTE = BASE_ROUTE + "/config";
const MINUTE_OF_HOUR_ROUTE = BASE_ROUTE + "/minuteofhour";
const HOUR_OF_DAY_ROUTE = BASE_ROUTE + "/hourofday";
const ZONE_BY_TIME_ROUTE = BASE_ROUTE + "/zonebytime";
const SEAT_OCCUPANCY_RSSI_THRESHOLD = -75;


// DOM elements
let temperature = document.querySelector("#temperature");
let humidity = document.querySelector("#humidity");
let occupancyCount = document.getElementById("occupancycount");
let dateNode = document.getElementById("date");
let presenceArray = [];
let presenceOffice = [];
let presenceLab = [];
let presenceReception = [];
let managerList = ["ac233fa52b8","ac233fa52bc","ac233fa52e8"];
let internList = ["ac233fa152ac", "ac233fa152b7", "ac233fa152b5", "ac233fa152b1", "ac233fa152b0", "ac233fa152a8"];
let visitorList = ["ac233fa152a5", "ac233fa152aa", "ac233fa152bd", "ac233fa152ba", "ac233fa152c2", "ac233fa152bb"];
let cards = document.querySelector('#cards');
let target = document.querySelector('#toRender');
let reception = document.querySelector('#toReception');
let lab = document.querySelector('#toLab');


// Other variables
let baseUrl =
  window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  window.location.port;
let config = null;

// Other initialisation
//story creation using comrant.js
let story = {
  "@context": { "schema": "https://schema.org/" },
  "@graph": [
    {
      "@id": "furaha",
      "@type": "schema:Person",
      "schema:name": "Furaha",
      "schema:image": "/dashboards/garage/portrait.jpg"
    }
  ]
};
let story2 = {
  "@context": { "schema": "https://schema.org/" },
  "@graph": [
    {
      "@id": "furaha",
      "@type": "schema:Person",
      "schema:name": "Furaha",
      "schema:image": "/dashboards/garage/portrait.1.jpg"
    }
  ]
};
    let storyUrl = "http://localhost:3000/api/garage/ac233fa152a51";
    cormorant.retrieveStory(storyUrl, function(story){ //USE A PROPER STORY URL INSTEAD OF BASEURL
    storystring= JSON.stringify(story, null, 2);
    console.log(storystring);
    cuttlefish.render(story, target);
    });

// Other initialisation
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
  }
}

// Increment/Decrement number of occupants
function updateOccupancy(raddec, isDisappearance) {
  let isOccupant = raddec.transmitterId.startsWith("ac233f");
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
function getStory(url, callback) {
  let httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if(httpRequest.readyState === XMLHttpRequest.DONE) {
      return callback(200, httpRequest.responseText);
    }
  };
  httpRequest.open('GET', url);
  httpRequest.setRequestHeader('Accept', 'application/json');
  httpRequest.send();
}

//update the office DOM
function updateListZones(raddec, isDisappearance,location){
  let isOccupant = raddec.transmitterId.startsWith("ac233");
  let isOffice = raddec.rssiSignature[0].receiverId.includes("0279");
  let isReception = raddec.rssiSignature[0].receiverId.includes("08279");
  let isLab = raddec.rssiSignature[0].receiverId.includes("0f279");
  let transmitterId = raddec.transmitterId;
  let isIntern = internList.includes(transmitterId);
  let isManager = managerList.includes(transmitterId);
  let isVisitor = visitorList.includes(transmitterId);
  if(isOccupant){
    getStory("localhost:3000/dashboards/garage/ac233fa152a51", function(data){
        console.log(data);
    });
    //let storyUrl = "http://localhost:3000/dashboards/garage/ac233fa152a51" + transmitterId;
    //cormorant.retrieveStory(storyUrl, function(story){ //USE A PROPER STORY URL INSTEAD OF BASEURL
    //storystring= JSON.stringify(story, null, 2);
    //console.log(storystring);
    //cuttlefish.render(story, dom);
    //});
    if(isOffice) {
      if(!isDisappearance){
        if(!presenceOffice.includes(transmitterId)){
          presenceOffice.push(transmitterId);
          cuttlefish.render(story, target);
        }
      }
      else{
        presenceOffice.splice(presenceOffice.indexOf(transmitterId), 1);
      }
    }
    if(isReception) {
      if(!isDisappearance){
        if(!presenceReception.includes(transmitterId)){
          presenceReception.push(transmitterId);
          cuttlefish.render(story, reception);
        }
      }else{
        presenceReception.splice(presenceReception.indexOf(transmitterId), 1);
      }
    }
    if(isLab) {
      if(!isDisappearance){
        if(!presenceLab.includes(transmitterId)){
          presenceLab.push(transmitterId);
          cuttlefish.render(story, lab);
        }
      }else{
        presenceLab.splice(presenceLab.indexOf(transmitterId), 1);
      }
    }
  }
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
  } 
  else {
    console.log("Unable to get config.  Refresh page to try again.");
  }
}

// The following code runs on startup...
getJson(baseUrl + CONFIG_ROUTE, handleConfigAndStart);
setInterval(updateClock, 1000);
