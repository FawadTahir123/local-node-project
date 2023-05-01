const apiRoutes = require('express').Router();
const {Api} = require('../contollers');
const {User} = require('../contollers');
const {Request} = require('../contollers')


apiRoutes.post('/request-blood/:id',Request.requestBlood);
//User Controller
apiRoutes.get('/get-cards-data',User.cardsData);
apiRoutes.post('/add-user',User.addUser);
apiRoutes.put('/edit-user/:id',User.editUser);
apiRoutes.delete('/delete-user/:id',User.deleteUser);
apiRoutes.get('/view-user/:id',User.viewUser);
apiRoutes.get('/get-all-user',User.getAllUser);
//End User Controller
module.exports = apiRoutes;