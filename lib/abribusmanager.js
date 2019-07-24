/**
 * Copyright reelyActive 2019
 * We believe in an open Internet of Things
 */


const RSSI_MIN_THRESHOLD = -75;
const RSSI_MAX_THRESHOLD = -30;


/**
 * AbribusManager Class
 * Manages the abribus demo.
 */
class AbribusManager {

  /**
   * AbribusManager constructor
   * @param {Object} options The options as a JSON object.
   * @param {DatabaseManager} database The database manager.
   * @constructor
   */
  constructor(options, database) {
    options = options || {};

    this.esClient = options.esClient;
    this.database = database;
  }

  /**
   * Retrieve an Abribus query.
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
      case 'dayofweek':
        queryDayOfWeek(this.esClient, callback);
        break;
      case 'zonebytime':
        queryZoneByTime(this.esClient, callback);
        break;
      default:
        console.log('Unhandled abribus query:', type);
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
     console.log('Abribus queryMinuteOfHour error:', err);
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

  //let now = new Date();
  //let startTimestamp = new Date(now.getFullYear(), now.getMonth(),
  //                              now.getDate(), 5, 0, 0).getTime();
  //let endTimestamp = new Date(now.getFullYear(), now.getMonth(),
  //                              now.getDate(), 21, 0, 0).getTime();

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
     console.log('Abribus queryHourOfDay error:', err);
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
 * Run the Day of Week query in Elasticsearch.
 * @param {Elasticsearch} esClient The Elasticsearch client.
 * @param {function} callback The function to call on completion.
 */
function queryDayOfWeek(esClient, callback) {
  let data = {
      x: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      y: [20, 14, 25, 16, 18, 22, 69]
  };
  return callback(data);
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
     console.log('Abribus queryZoneByTime error:', err);
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


module.exports = AbribusManager;
