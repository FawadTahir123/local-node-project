const apiRoutes = require('express').Router();
const {Api} = require('../contollers');
const {User} = require('../contollers');
const {Request} = require('../contollers')


apiRoutes.post('/request-blood/:id',Request.requestBlood);
apiRoutes.get('/get-cards-data',User.cardsData);
module.exports = apiRoutes;