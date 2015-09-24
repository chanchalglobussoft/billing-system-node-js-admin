'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../../../../controllers/errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	mandrill = require("../../../../../config/mandril.js"),
	config = require("../../../../../config/config.js");
var crypto = require('crypto');
/**
 * connection to maria database
 */
var connect = require('../../../../models/maria.js');
var c = new connect.maria();
var mariaq = require('../../../../models/mariaq.js');



/**
 * save card details
 */
exports.savecard = function(req, res) {
	


	res.json({"hello":"hello"});
};