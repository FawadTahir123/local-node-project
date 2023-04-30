const apiRoutes = require('express').Router();
const {Api} = require('../contollers');


apiRoutes.post('/request-blood/:id',Api.requestBlood);
module.exports = apiRoutes;