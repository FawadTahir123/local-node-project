const controllers = {}

controllers.Auth = require('./auth');
controllers.Api = require('./api');
controllers.User = require('./user');
controllers.Request = require('./request')
module.exports = controllers;