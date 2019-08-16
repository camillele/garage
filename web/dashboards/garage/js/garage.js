/**
 * Copyright reelyActive 2019
 * We believe in an open Internet of Things
 */

// Constants
const BASE_ROUTE = "/api/garage";
const CONFIG_ROUTE = BASE_ROUTE + "/config";

// DOM elementsa
let temperature = document.querySelector("#temperature")
let humidity = document.querySelector("#humidity");
let occupancyCount = document.getElementById("occupancycount");
let dateNode = document.getElementById("date");
let presenceLab = [];
let presenceArray = [];
let presenceOffice = [];
let presenceReception = [];
let managerList = [ "ac233fa152c2", "ac233fa152bb", "ac233fa152a7", "ac233fa152ae", "ac233fa152cc", "ac233fa152a9"];
let internList = ["ac233fa152ac", "ac233fa152b7", "ac233fa152b5", "ac233fa152b1", "ac233fa152b0", "ac233fa152a8"];
let visitorList = ["ac233fa152a5", "ac233fa152aa", "ac233fa152bd", "ac233fa152ba", "ac233fa152a6", "ac233fa152b2","ac233fa152b8","ac233fa152bc","ac233fa152e8"];
let lab = document.querySelector('#lab');
let office = document.querySelector('#office');
let reception = document.querySelector('#reception');

let visitor = document.querySelector("#visitors");
let intern = document.querySelector("#interns");
let manager = document.querySelector("#managers");
let visitorReception = document.querySelector("#visitorsReception");
let internReception = document.querySelector("#internsReception");
let managerReception = document.querySelector("#managersReception");
let visitorLab = document.querySelector("#visitorsLab");
let internLab= document.querySelector("#internsLab");
let managerLab = document.querySelector("#managersLab");

//garage receivers
let officeSensors = ["001bc5094081017a","001bc5094081017b","001bc50940810175", "001bc50940810174"];
let receptionSensors = ["001bc50940810176","001bc5094081017d","001bc5094081017d","001bc50940810181"];
let labSensors = ["001bc5094081017f","001bc50940810180","001bc5094081017e","001bc50940810177"];

let storyMap = {
      "ac233fa152c2": "WyIYIpvM9rW6n5KP",
      "ac233fa152bb": "RYfwSkdZQE1VzEwJ",
      "ac233fa152a7": "9DplG9LSM3HzCciU",
      "ac233fa152ae": "YrHt5DXkhtUO2n3Y",
      "ac233fa152cc": "x5MvvtbMpE7l7Bmh",
      "ac233fa152a9": "qgU2ZnJ2ufy5pAXF",
      "ac233fa152ac": "Kx0fvewhudkItxUX",
      "ac233fa152b7": "WyIYIpvM9rW6n5KP",
      "ac233fa152b5":"RYfwSkdZQE1VzEwJ",
      "ac233fa152b1": "YrHt5DXkhtUO2n3Y",
      "ac233fa152b0": "x5MvvtbMpE7l7Bmh",
      "ac233fa152a8": "qgU2ZnJ2ufy5pAXF",
      "ac233fa152a5": "EA8RoYN3q3QdDWSD",
      "ac233fa152aa": "oE5OsHplG3wW1BRo",
      "ac233fa152ba": "EA8RoYN3q3QdDWSD",
      "ac233fa152a6":"E5OsHplG3wW1BRo",
      "ac233fa152b8": "WyIYIpvM9rW6n5KP"
    };

// Other variables
let baseUrl =
  window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  window.location.port;
let config = null;

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
      updateOccupancy(raddec, isDisappearance);
      updateListZones(raddec, isDisappearance);
  }
}

// Increment/Decrement number of occupants
function updateOccupancy(raddec, isDisappearance) {
  let isOccupant = raddec.transmitterId.startsWith("ac233fa");
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
/**
 * 
 * @param {*} list list of sensors in a particular area
 * @param {*} raddec 
 * @param {boolean} isDisappearance 
 */
function checkSensor(list, raddec, isDisappearance){
  for(const id of list){
    if(raddec.rssiSignature[0].receiverId.includes(id)){
      return true;
    }
  }
  return false;
}

//Main function - update the office DOM
function updateListZones(raddec, isDisappearance){
  let isOccupant = raddec.transmitterId.startsWith("ac233");
  let isOffice = officeSensors.includes(raddec.rssiSignature[0].receiverId);
  let isReception = receptionSensors.includes(raddec.rssiSignature[0].receiverId);
  let isLab = labSensors.includes(raddec.rssiSignature[0].receiverId);
  let transmitterId = raddec.transmitterId;

  let storyId = storyMap[transmitterId]; 
 let storyUrl = "http://localhost:3001/stories/" + storyId;

  let isIntern = internList.includes(transmitterId);
  let isManager = managerList.includes(transmitterId);
  let isVisitor = visitorList.includes(transmitterId);
  if(isOccupant){
    if(isOffice) {
      if(!isDisappearance){
        if(!presenceOffice.includes(transmitterId)){
          presenceOffice.push(transmitterId);
          if(isIntern) {
            intern.className = "bg-success";
            cormorant.retrieveStory(storyUrl, function(story){ 
		
            cuttlefish.render(story, intern);
            });      
          } 
          else if(isManager) {
            manager.className = "bg-warning";
            cormorant.retrieveStory(storyUrl, function(story){
            cuttlefish.render(story, manager);
            });
          }
          else if(isVisitor) {
            visitor.className = "bg-primary";
            cormorant.retrieveStory(storyUrl, function(story){
            cuttlefish.render(story, visitor);
            });
          }
        }
      }
      else{
        presenceOffice.splice(presenceOffice.indexOf(transmitterId), 1);
        if(isIntern) {
          intern.removeChild(intern.childNodes[0]); 
        } 
        else if(isManager) {
          manager.removeChild(manager.childNodes[0]);   
        }
        else if(isVisitor) {
          visitor.removeChild(visitor.childNodes[0]);   
        }
      }
    }
    if(isReception) {
      if(!isDisappearance){
        if(!presenceReception.includes(transmitterId)){
          presenceReception.push(transmitterId);
          if(isIntern) {
            internReception.className = "bg-success";
            cormorant.retrieveStory(storyUrl, function(story){
            cuttlefish.render(story, internReception);
            });
          } 
          else if(isManager) {
            managerReception.className = "bg-warning";
            cormorant.retrieveStory(storyUrl, function(story){
            cuttlefish.render(story, managerReception);
            });
          }
          else if(isVisitor) {
            visitorReception.className = "bg-primary";
            cormorant.retrieveStory(storyUrl, function(story){
            cuttlefish.render(story, visitorReception);
            });
          }
        }
      }
      else {
        presenceReception.splice(presenceReception.indexOf(transmitterId), 1);
        if(isIntern) {
          internReception.removeChild(internReception.childNodes[0]); 
        } 
        else if(isManager) {
          managerRception.removeChild(managerReception.childNodes[0]);  
        }
        else if(isVisitor) {
          visitorReception.removeChild(visitorReception.childNodes[0]);   
        }
      }
    }
    if(isLab) {
      if(!isDisappearance){
        if(!presenceLab.includes(transmitterId)){
          presenceLab.push(transmitterId);
          if(isIntern) {
            internLab.className = "bg-success";
            cormorant.retrieveStory(storyUrl, function(story){
            cuttlefish.render(story, internLab);
            });
          } 
          else if(isManager) {
            managerLab.className = "bg-warning";
            cormorant.retrieveStory(storyUrl, function(story){
            cuttlefish.render(story, managerLab);
            });
          }
          else if(isVisitor) {
            visitorLab.className = "bg-primary";
            cormorant.retrieveStory(storyUrl, function(story){
            cuttlefish.render(story, visitorLab);
            });
          }
        }
      }
      else{
        presenceLab.splice(presenceLab.indexOf(transmitterId), 1);
        if(isIntern) {
          internLab.removeChild(internLab.childNodes[0]); 
        } 
        else if(isManager) {
          managerLab.removeChild(managerLab.childNodes[0]);  
        }
        else if(isVisitor) {
          visitorLab.removeChild(visitorLab.childNodes[0]);   
        }
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

//refresh occupancy divs
 let count = 0;
 function refresh(){
  office.html(count);
  raception.html(count);
  lab.html(count);
  count ++
  setTimeout(refresh, 1000);
 }

// The following code runs on startup...
getJson(baseUrl + CONFIG_ROUTE, handleConfigAndStart);
setInterval(updateClock, 1000);
refresh();e
