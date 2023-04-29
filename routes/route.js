const router = require('express').Router();
const {User} = require('../contollers');

router.post('/create',User.create)
module.exports = router;
