'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var apiRoutes = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../../../config/config.js');

var payment = require('../../../app/modules/client/controllers/payment/payment');

module.exports = function(app) {

app.use('/payment', apiRoutes);

 apiRoutes.use(function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];


        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.jwtsecret, function(err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });



    apiRoutes.post('/savecard', payment.savecard);

















}