const apiRoutes = require('express').Router();
const {Api} = require('../contollers');
const {User} = require('../contollers');
const {Request} = require('../contollers')
const {Events} = require('../contollers')


apiRoutes.post('/request-blood/:id',Request.requestBlood);
//User Controller
apiRoutes.get('/get-cards-data',User.cardsData);
apiRoutes.post('/add-user',User.addUser);
apiRoutes.get('/get-all-patients',User.getAllPatients);
apiRoutes.put('/edit-user/:id',User.editUser);
apiRoutes.delete('/delete-user/:id',User.deleteUser);
apiRoutes.delete('/bulk-delete-user',User.bulkDeleteUser);
apiRoutes.get('/view-user/:id',User.viewUser);
apiRoutes.get('/get-all-user',User.getAllUser);
apiRoutes.post('/search-user',User.searchUser);
apiRoutes.post('/update-availability/:id',User.updateAvailaibility);
apiRoutes.post('/patient-request-for-donor',User.PatientRequests);
apiRoutes.get('/update-status/:id',User.updateStatus);
apiRoutes.get('/get-user-availability/:id',User.getUserAvailability);
apiRoutes.get('/get-donor-bloodgroup/:id',User.getBloodGroup);
apiRoutes.get('/get-single-request-data/:id',User.getSingleRequestData);
//End User Controller

//Request Controller
apiRoutes.post('/add-request',Request.addRequest);
apiRoutes.put('/edit-request/:id',Request.editRequest);
apiRoutes.delete('/delete-request/:id',Request.deleteRequest);
apiRoutes.delete('/bulk-delete-request',Request.bulkDeleteRequest);
apiRoutes.get('/view-request/:id',Request.viewRequest);
apiRoutes.get('/get-all-request',Request.getAllRequest);
apiRoutes.post('/search-request',Request.searchRequest);
apiRoutes.post('/approve-request',Request.approveRequest);
apiRoutes.get('/patient-request/:id',Request.patientRequest);
//Request Controller

//Events Controller
apiRoutes.get('/patinet-events/:id',Events.patientEvents);
apiRoutes.get('/donor-events/:id',Events.donorEvents);
apiRoutes.get('/get-all-events',Events.getAllEvents);
//Events Controller Ends

module.exports = apiRoutes;