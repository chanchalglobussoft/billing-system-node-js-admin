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
 * jwt
 */
var jwt = require('jsonwebtoken');
/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	var user = {};
	// Init Variables
	user.emailId = req.body.email;
	user.salt = crypto.randomBytes(16).toString('base64');
	var sa = new Buffer(user.salt, 'base64');
	user.password = crypto.pbkdf2Sync(req.body.password, sa, 10000, 64).toString('base64');
	user.ackcode = crypto.pbkdf2Sync(user.emailId, sa, 10000, 64).toString('hex');
	user.username = req.body.email.split('@')[0];
	console.log(user);
	var message = null;


	mariaq.select(c, "client", "*", "emailId='" + user.emailId + "'", function(data) {

		if (data.data.length == 0) {
			mariaq.insert(c, "client", user, function(info) {
				if (info) {
					var to = [{
						"email": user.emailId,
						"name": user.username,
						"type": "to"
					}];
					var mergers = [{
						"name": "name",
						"content": config.host + "ackcode/" + user.ackcode
					}]
					var template_name = "test";
					var subject = "test";
					var from = "billingadmin@gmail.com";
					var from_name = "admin";

					var mailres = mandrill(template_name, subject, to, from, from_name, mergers);



					res.status(200).json({
						code: 200,
						message: "successfully logged in"
					});
				} else {
					res.status(400).send({
						code: 400,
						message: "email already exists"
					});
				}

			})

		} else {
			res.status(400).send({
				code: 400,
				message: "email already exists"
			});

		}



	})



	// Then save the user 
	// user.save(function(err) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		// Remove sensitive data before login
	// 		user.password = undefined;
	// 		user.salt = undefined;

	// 		req.login(user, function(err) {
	// 			if (err) {
	// 				res.status(400).send(err);
	// 			} else {
	// 				res.json(user);
	// 			}
	// 		});
	// 	}

}

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		console.log(" the user is ");
		console.log(user);
		if (err || !user) {
			var infos = info || "username/password mismatch"
			res.status(400).json(infos);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			var token = jwt.sign(user, 'ultrasecret', {
				expiresInMinutes: 1440 // expires in 24 hours
			});

			res.status(200).json({
				code: 200,
				link: '/code/' + token
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err == 1) {
				res.redirect("/#/errorno/" + 1);
			} else {
				console.log("hello");
				console.log(err);
				console.log(user);
				if (err || !user) {
					return res.redirect('/#!/signin');
				} else {
					user.password = undefined;
					var token = jwt.sign(user, 'ultrasecret', {
						expiresInMinutes: 1440 // expires in 24 hours
					});
					return res.redirect(redirectURL || '/#/code/' + token);
				}
			}
			// 	req.login(user, function(err) {
			// 		if (err) {
			// 			console.log("this error:"+err);
			// 			return res.redirect('/#!/signin');
			// 		}
			// var jwt = require('jsonwebtoken');
			// 						var token = jwt.sign(user, 'ultrasecret', {
			// 						                         expiresInMinutes: 1440 // expires in 24 hours
			// 						                     });
			// 		return res.redirect(redirectURL || '/#/code?code='+token);
			// 	});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	// Define a search query fields
	var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
	var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

	// Define main provider search query
	var mainProviderSearchQuery = {};
	mainProviderSearchQuery.provider = providerUserProfile.provider;
	mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

	// Define additional provider search query
	var additionalProviderSearchQuery = {};
	additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

	// Define a search query to find existing user with current provider profile
	var searchQuery = {
		$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
	};

	var data = [];
	console.log("provider:" + providerUserProfile.provider);
	console.log();
	c.query('select * from client where ' + providerUserProfile.provider + '= "' + providerUserProfile.providerData.id + '"')
		.on('result', function(resrow) {

			resrow.on('row', function(row) {
					data.push(row)
				})
				.on('error', function(err) {
					console.log('Result error: ' + err);
				})
				.on('end', function(info) {
					console.log(data);

					console.log("console.log(data);");

					if (data.length != 0) {

						// var jwt = require('jsonwebtoken');
						// var token = jwt.sign(data, 'sadfsdsd', {
						//                          expiresInMinutes: 1440 // expires in 24 hours
						//                      });
						var err = null;


						done(err, data[0]);

					} else {
						var fname = providerUserProfile.firstName || null;
						var lname = providerUserProfile.lastName || null;
						var email = providerUserProfile.email || null;
						var pid = providerUserProfile.providerData.id || null;
						var pic = providerUserProfile.providerData.picture || "/assets/images/avatar1.jpg";
						var provider = providerUserProfile.provider;


						// email = null;
						if (!email) {
							done("1", null);

						} else {


							console.log("hellp");
							mariaq.select(c, "client", "*", "emailId='" + email + "'", function(data) {
								if (data.data.length == 0) {
									var salt = crypto.randomBytes(16).toString('base64');
									var ackcode = crypto.pbkdf2Sync(email, salt, 10000, 64).toString('hex');

									var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');
									var q = "INSERT INTO client (username,fname,lname,emailId," + provider + ",password,pic,ackcode) values( '" + possibleUsername + "','" + fname + "','" + lname + "','" + email + "'," + pid + ",null,'" + pic + "','" + ackcode + "')";
									console.log(q);
									var data = [];
									c.query(q)
										.on('result', function(result) {

											result.on('end', function(info) {
												c.query('select * from client where ' + providerUserProfile.provider + '= ' + providerUserProfile.providerData.id)
													.on('result', function(resrow) {

														resrow.on('row', function(row) {
																data.push(row)
															})
															.on('error', function(err) {
																console.log('Result error: ' + err);
															})
															.on('end', function(info) {
																var err = null;
																var to = [{
																	"email": email,
																	"name": possibleUsername,
																	"type": "to"
																}];
																var mergers = [{
																	"name": "name",
																	"content": config.host + "ackcode/" + ackcode
																}]
																var template_name = "test";
																var subject = "test";
																var from = "billingadmin@gmail.com";
																var from_name = "admin";

																var mailres = mandrill(template_name, subject, to, from, from_name, mergers);
																done(err, data[0]);
															})
													})

											})

										});
								} else {
									var q = 'UPDATE client SET ' + providerUserProfile.provider + '="' + providerUserProfile.providerData.id + '" where emailId="' + email + '"';
									console.log(q);
									c.query(q)
										.on('result', function(result) {
											result.on('end', function(info) {
												mariaq.select(c, "client", "*", "emailId='" + email + "'", function(data) {
													done(err, data.data[0]);

												});

											})
										})



								}


							})
						}
					}



				})
		});



}


/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	}
};


/**
 * Remove OAuth provider
 */
exports.regentoken = function(req, res, next) {
	var user = req.decoded;


	mariaq.select(c, "client", "*", "emailId='" + user.emailId + "'", function(data) {
		if (data.data.length != 0) {
			var token = jwt.sign(data.data[0], 'ultrasecret', {
				expiresInMinutes: 1440 // expires in 24 hours
			});
			res.json({
				status: "200",
				"data": token
			});
		} else {
			res.json({
				status: "198",
				"data": "error"
			});
		}

	})

};

/**
 * Resend confirmation mail
 */

exports.resendemail = function(req, res, next) {

	var to = [{
		"email": req.decoded.emailId,
		"name": req.decoded.username,
		"type": "to"
	}];
	var mergers = [{
		"name": "name",
		"content": config.host + "ackcode/" + req.decoded.ackcode
	}]
	var template_name = "test";
	var subject = "test";
	var from = "billingadmin@gmail.com";
	var from_name = "admin";

	var mailres = mandrill(template_name, subject, to, from, from_name, mergers);
	res.json({
		"status": "200"
	});


}


/**
 * Forgot Password
 */

exports.fpassword = function(req, res, next) {
	var emailId = req.body.email;
	mariaq.select(c, "client", "*", "emailId='" + emailId + "'", function(data) {
		if (data.cnt != 0) {

			var user = {};
			// Init Variables
			var emailId = req.body.email;
			var rand = crypto.randomBytes(16).toString('hex');
			var date = new Date
			var time = date.getTime().toString();
			var salt = new Buffer(rand, 'base64');
			user.rcode = crypto.pbkdf2Sync(time, salt, 10000, 64).toString('hex');
			mariaq.update(c, "client", user, "emailId='" +
				emailId + "'",
				function(data) {
					if (data) {
						var to = [{
							"email": req.body.email,
							"type": "to"
						}];
						var mergers = [{
							"name": "name",
							"content": config.host + "rcode/" + user.rcode
						}]
						var template_name = "test";
						var subject = "test";
						var from = "billingadmin@gmail.com";
						var from_name = "admin";

						var mailres = mandrill(template_name, subject, to, from, from_name, mergers);



						res.json({
							status: "200",
							"message": "activation link has been sent to your email"
						});
					} else {
						res.json({
							status: "198",
							"message": "error"
						});
					}


				})


		} else {

			res.json({
				status: "198",
				"message": "email doesnt exist"
			});


		}

	})



}

/**
 * Remove OAuth provider
 */
exports.checkrcode = function(req, res, next) {
	var rcode = req.body.rcode;


	mariaq.select(c, "client", "*", "rcode='" + rcode + "'", function(data) {
		if (data.data.length != 0) {

			res.json({
				status: "200"
			});
		} else {
			res.json({
				status: "198",
				"data": "error"
			});
		}

	})

};

/**
 * Remove OAuth provider
 */
exports.newpassword = function(req, res, next) {
	var user = {};
	var rcode = req.body.rcode;
	var password = req.body.password;

	user.salt = crypto.randomBytes(16).toString('base64');
	var sa = new Buffer(user.salt, 'base64');
	user.password = crypto.pbkdf2Sync(password, sa, 10000, 64).toString('base64');



	mariaq.update(c, "client", user, "rcode='" +
		rcode + "'",
		function(data) {


			if (data) {
				var u = {};
				u.rcode = null;
				mariaq.update(c, "client", u, "rcode='" +
					rcode + "'",
					function(data) {

						if (data) {

							res.json({
								status: "200",
								"message": "Password successfully changed"
							});
						} else {
							res.json({
								status: "198",
								"message": "error"
							});
						}

					})
			} else {
				res.json({
					status: "198",
					"message": "error"
				});
			}


		})

};