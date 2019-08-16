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

/**
 * retrieves the story of a beacon
 * @param {*} beaconId specific id of a bluetooth beacon
 * @param {*} callback fucntion to return
 */
  retrieveStory(beaconId, callback){ //   mapBeaconToStorY TO BE USED WHEN CORMRANT CORS ISSUES ARE RESOLVED
    let storyList = {
      "ac233fa152c2":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152bb":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152a7":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152ae":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152cc":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152a9":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152ac":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152b7":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152b5":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152b1":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152b0":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152a8":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152a5":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152aa":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152bd":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152ba":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152a6":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },
      "ac233fa152b8":{
        "@context": { "schema": "https://schema.org/" },
        "@graph": [
          {
            "@id": "furaha",
            "@type": "schema:Person",
            "schema:name": "Furaha",
            "schema:image": "/dashboards/garage/portrait.jpg"
          }
        ]
      },

    };
    return callback(storyList[beaconId]);

  }

  /**
   * Retrieve a Garage query.
   * @param {String} type The type of query.
   * @param {callback} callback Function to call on completion.
   */
  retrieve(type, callback) {
    switch(type) {
      case 'minuteofhour':
        queryMinuteOfHour(this.esClient, callback);
        break;
      case 'hourofday':
        queryHourOfDay(this.esClient, callback);
        break;
      case 'zonebytime':
        queryZoneByTime(this.esClient, callback);
        break;
      default:
        console.log('Unhandled query:', type);
        return callback();
    }
  }

}

/**
 * Run the Minute of Hour query in Elasticsearch.
 * @param {Elasticsearch} esClient The Elasticsearch client.
 * @param {function} callback The function to call on completion.
 */
function queryMinuteOfHour(esClient, callback) {

  // Time range is from an hour ago to now
  let startTimestamp = new Date(Date.now() - 3600000).getTime();
  let endTimestamp = new Date().getTime();

  let body = {
      "size": 0,
      "aggs": {
        "date": {
          "date_histogram": {
            "field": "timestamp",
            "interval": "1m"
          },
          "aggs": {
            "count": {
              "cardinality": {
                "field": "transmitterId.keyword"
              }
            }
          }
        }     
      },
      "query": {
        "bool": {
          "must": [
            {
              "range": {
                "timestamp" : {
                  "gte" : startTimestamp,
                  "lt" :  endTimestamp
                }
              }
            },
            {
              "range": {
                "rssi" : {
                  "gte" : RSSI_MIN_THRESHOLD,
                  "lt" :  RSSI_MAX_THRESHOLD
                }
              }
            }
          ]
        }
      }
  };

  let query = { index: 'raddec', body: body };
  esClient.search(query, function(err, result) {
    let data = { x: [], y: [] };
    if(err) {
     console.log('garage queryMinuteOfHour error:', err);
    }
    else {
      let buckets = result.body.aggregations.date.buckets;
      buckets.forEach(function(item) {
        let timestamp = new Date(item.key).getTime();
        let count = item.count.value;
        data.x.push(timestamp);
        data.y.push(count);
      });
    }
    return callback(data);
  });
}


/**
 * Run the Hour of Day query in Elasticsearch.
 * @param {Elasticsearch} esClient The Elasticsearch client.
 * @param {function} callback The function to call on completion.
 */
function queryHourOfDay(esClient, callback) {

  // Time range is from twelve hours ago to now
  let startTimestamp = new Date(Date.now() - 43200000).getTime();
  let endTimestamp = new Date().getTime();

  let body = {
      "size": 0,
      "aggs": {
        "date": {
          "date_histogram": {
            "field": "timestamp",
            "interval": "1h"
          },
          "aggs": {
            "count": {
              "cardinality": {
                "field": "transmitterId.keyword"
              }
            }
          }
        }     
      },
      "query": {
        "bool": {
          "must": [
            {
              "range": {
                "timestamp" : {
                  "gte" : startTimestamp,
                  "lt" :  endTimestamp
                }
              }
            },
            {
              "range": {
                "rssi" : {
                  "gte" : RSSI_MIN_THRESHOLD,
                  "lt" :  RSSI_MAX_THRESHOLD
                }
              }
            }
          ]
        }
      }
  };

  let query = { index: 'raddec', body: body };
  esClient.search(query, function(err, result) {
    let data = { x: [], y: [] };
    if(err) {
     console.log('garage queryHourOfDay error:', err);
    }
    else {
      let buckets = result.body.aggregations.date.buckets;
      buckets.forEach(function(item) {
        let timestamp = new Date(item.key).getTime();
        let count = item.count.value;
        data.x.push(timestamp);
        data.y.push(count);
      });
    }
    return callback(data);
  });
}

/**
 * Run the Zone by Time query in Elasticsearch.
 * @param {Elasticsearch} esClient The Elasticsearch client.
 * @param {function} callback The function to call on completion.
 */
function queryZoneByTime(esClient, callback) {

  // Time range is from five minutes ago to now
  let startTimestamp = new Date(Date.now() - 300000).getTime();
  let endTimestamp = new Date().getTime();

  let body = {
      "size": 0,
      "aggs": {
        "date": {
          "date_histogram": {
            "field": "timestamp",
            "interval": "30s"
          },
          "aggs": {
            "receivers": {
              "significant_terms": {
                "field": "receiverId.keyword",
                "size": 5
              }
            }
          }
        }     
      },
      "query": {
        "bool": {
          "must": [
            {
              "range": {
                "timestamp" : {
                  "gte" : startTimestamp,
                  "lt" :  endTimestamp
                }
              }
            },
            {
              "range": {
                "rssi" : {
                  "gte" : RSSI_MIN_THRESHOLD,
                  "lt" :  RSSI_MAX_THRESHOLD
                }
              }
            }
          ]
        }
      }
  };

  let query = { index: 'raddec', body: body };
  esClient.search(query, function(err, result) {
    let data = { x: [], y: [], z: [] };
    if(err) {
     console.log('garage queryZoneByTime error:', err);
    }
    else {
      let buckets = result.body.aggregations.date.buckets;
      let numberOfTimestamps = 0;

      // Iterate through each timestamp
      buckets.forEach(function(item) {
        let timestamp = new Date(item.key).getTime();
        data.x.push(timestamp);
        let receiverBuckets = item.receivers.buckets;

        // Iterate through each receiver with counts
        receiverBuckets.forEach(function(receiver) {
          let receiverId = receiver.key;
          let count = receiver.doc_count;
          let isNewReceiverId = (data.y.indexOf(receiverId) < 0);
          if(isNewReceiverId) {
            data.y.push(receiverId);
            let counts = Array(numberOfTimestamps).fill(0);
            data.z.push(counts);
          }
          let receiverIndex = data.y.indexOf(receiverId);
          data.z[receiverIndex].push(count);
        });

        numberOfTimestamps++;

        // Iterate through all to fill in missing counts
        data.z.forEach(function(receiver) {
          if(receiver.length < numberOfTimestamps) {
            receiver.push(0);
          }
        });
      });
    }
    return callback(data);
  });
}
module.exports = GarageManager;

