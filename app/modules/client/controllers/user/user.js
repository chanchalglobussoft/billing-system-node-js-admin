'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../../../../controllers/errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport');
	
/**
 * connection to maria database
 */
var connect = require('../../../../models/maria.js');
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