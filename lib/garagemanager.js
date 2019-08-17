/**
 * Copyright reelyActive 2019 - 2019
 * We believe in an open Internet of Things
 */


const RSSI_MIN_THRESHOLD = -75;
const RSSI_MAX_THRESHOLD = -30;

/**
 * GarageManager class
 * Manages the Garage hlc-dashboard demo
 */
class GarageManager {

  /**
   * GarageManager constructor
   * @param {Object} options the options as a JSON object
   * @param {DataBaseManager} database the datbase manager
   */
  constructor(options, database){
    options = options || {};

    this.esClient = options.esClient;
    this.database = database;

  }
  /**
   * gates story id for a specific beacon
   * @param {string} beaconId specific id of a bluetooth beacon
   * @param {callback} callback fucntion to return
   */
  mapBeaconToStory (beaconId, callback){ //TO BE USED INSTEAD OF retrieveStory WHEN CORMRANT COR ISSUES ARE RESOLVED
    //TO-DO: map specific stories ids obtained from json-silo to the beaconIds
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
    }
    return callback(storyMap.beaconId);
  }

}


module.exports = GarageManager;

