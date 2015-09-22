'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');
/**
 * connection to maria database
 */
var connect = require('../../../app/models/maria.js');
var c = new connect.maria();


/**
 * jwt
 */
var jwt = require('jsonwebtoken');


/**
 * Signin after passport authentication
 */
exports.me = function(req, res) {
	


	res.json({"hello":"hello"});
};