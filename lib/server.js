/**
 * Copyright reelyActive 2019
 * We believe in an open Internet of Things
 */


const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@elastic/elasticsearch');
const AbribusManager = require('./abribusmanager');


const PORT = process.env.PORT || 3000;


const esClient = new Client({ node: 'http://localhost:9200' });


let app = express();
let server = http.createServer(app);
let router = express.Router();
let demos = {
    abribus: new AbribusManager({ esClient: esClient })
};

app.use(bodyParser.json());
app.use(function(req, res, next) {
  req.demos = demos;
  next();
});
app.use('/api', require('./routes/api'));
app.use('/', express.static(path.resolve(__dirname + '/../web')));

server.listen(PORT, function() {
  console.log('reelyActive hlc-dashboard-demos listening on port', PORT);
});
