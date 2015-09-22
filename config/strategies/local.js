'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;
var connect = require('../../app/models/maria.js');
var c = new connect.maria();
var mariaq = require('../../app/models/mariaq.js');
var crypto = require('crypto');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {

			mariaq.select(c, "client", "*", "emailId='" + username + "'", function(data) {
				if (data.cnt!=0) {
					var salt = new Buffer(data.data[0].salt, 'base64');
					var upassword = crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
					console.log(upassword);
					console.log(data.data[0].password);
					if (upassword == data.data[0].password) {
                           return done(null, data.data[0]);
					}
					else
					{
						return done("wrong password", null);						
					}



					
				} else {

					return done("null", null);
				}

			});

		}
	))


};