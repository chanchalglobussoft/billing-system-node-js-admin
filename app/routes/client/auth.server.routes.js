'use strict';
var express = require('express');
// var mariaClient = require('mariasql');
//var inspect = require('util').inspect;
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var config = require('../../../config/config.js');
var apiRoutes = express.Router();
var async = require('async');
var users = require('../../../app/modules/client/controllers/user/user');
//var userss = require('../../../app/controllers/userss.server.controller');
var mandrill = require('../../../config/mandril.js');
var userss = require('../../../app/modules/client/controllers/user.server.controller');

module.exports = function(app) {
    //every request to api must authenticated
    app.use('/authapi', apiRoutes);

    apiRoutes.post('/ack', userss.ackverify);

    apiRoutes.post('/fpassword', userss.fpassword);

    apiRoutes.post('/rcheck', userss.checkrcode);


    apiRoutes.post('/newpassword', userss.newpassword);



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


    apiRoutes.get('/me', function(req, res) {
        res.json(req.decoded);
    });

    apiRoutes.post('/regen', userss.regentoken);

    apiRoutes.post('/resend', userss.resendemail);



}