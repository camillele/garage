/**
 * Copyright reelyActive 2019 - 2019
 * We believe in an open Internet of Things
 */


const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@elastic/elasticsearch');
const AbribusManager = require('./abribusmanager');
const GarageManager = require('./garagemanager');
const cors = require('cors');

const PORT = process.env.PORT || 3000;


const esClient = new Client({ node: 'https://esread:owl-in-one@8d7fd40e6c3e48c1b2e82cce3541a738.us-east-1.aws.found.io:9243' });


let app = express();
app.use(cors());

let server = http.createServer(app);
let router = express.Router();
let demos = {
    abribus: new AbribusManager({ esClient: esClient }),
    garage: new GarageManager({ esClient: esClient})
};


app.use(bodyParser.json());
app.use(function(req, res, next) {
  req.demos = demos;
  next();
});
app.use('/api', require('./routes/api'));
app.use('/', express.static(path.resolve(__dirname + '/../web')));
app.use('/beacorcut-demos/stories', express.static(path.resolve(__dirname + '/../beacorcut-demos/stories')));

server.listen(PORT, function() {
  console.log('reelyActive hlc-dashboard-demos listening on port', PORT);
});
