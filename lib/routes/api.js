/**
 * Copyright reelyActive 2019-2019
 * We believe in an open Internet of Things
 */

const express = require('express');
const path = require('path');


let router = express.Router();

router.use('/abribus', require('./abribus'));
router.use('/garage', require('./garage'));


module.exports = router;
