/**
 * Copyright reelyActive 2019
 * We believe in an open Internet of Things
 */

const express = require('express');
const path = require('path');


let router = express.Router();

router.route('/config')
  .get(function(req, res) {
    console.log(req);
    res.status(200).json({
        hlcServerUrl: "http://localhost:3001",
        environmentalBeaconId: "ac233fa16f88",
        leftSeatBeaconId: "ac233fa09052",
        rightSeatBeaconId: "ac233fa0905c",
        displayBeaconId: "ac233fa0904f",
        updateGraphsMilliseconds: 60000
    });
  });

  router.route('/:id')
  .get(function(req, res){
    req.demos.garage.mapBeaconToStory(req.params.id, function(data){
      res.status(200).json(data);
    })
  });

router.route('/minuteofhour')
  .get(function(req, res) {
    req.demos.abribus.retrieve('minuteofhour', function(data) {
      res.status(200).json(data);
    });
  });

router.route('/hourofday')
  .get(function(req, res) {
    req.demos.abribus.retrieve('hourofday', function(data) {
      res.status(200).json(data);
    });
  });

router.route('/dayofweek')
  .get(function(req, res) {
    req.demos.abribus.retrieve('dayofweek', function(data) {
      res.status(200).json(data);
    });
  });

router.route('/zonebytime')
  .get(function(req, res) {
    req.demos.abribus.retrieve('zonebytime', function(data) {
      res.status(200).json(data);
    });
  });


module.exports = router;
