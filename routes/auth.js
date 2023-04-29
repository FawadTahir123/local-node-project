const authRoutes = require('express').Router();
const {Auth} = require('../contollers');


authRoutes.post('/register',Auth.register);
authRoutes.post('/login',Auth.login);
module.exports = authRoutes;