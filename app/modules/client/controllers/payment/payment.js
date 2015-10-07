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


var paypal = require('paypal-rest-sdk');

paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'AVu3O9BiM5s-bo7lLg4YGpbvZTXCKFXOelHpd7uy4nW0PWvrmjggGtgWqTkuBzjsBWRX1tiMyKBv9oSd',
	'client_secret': 'EAp4Zsc-LCmrSH08v8tdj1rZVaUe1ffGvV1ZIK0fiDe4m5mg3mTA5-kmqowwn_oDJI2mapAAzQTkxfMR'
});



/**
 * save card details and deduct 5 dollars for confirmation
 */
exports.savecard = function(req, res) {

	var card_data = {
		"type": req.body.type,
		"number": req.body.cardno,
		"expire_month": req.body.expdate,
		"expire_year": req.body.expyear,
		"cvv2": req.body.cvc,
		"first_name": req.body.FirstName,
		"last_name": req.body.LastName,
		"billing_address": {
			"line1": req.body.street,
			"city": req.body.city,
			"state": req.body.state,
			"postal_code": req.body.postal,
			"country_code": req.body.country
		}
	};

/**
 * save card
 */

	paypal.creditCard.create(card_data, function(error, credit_card) {
		if (error) {
			res.json({
				"status": 198,
				"result": error
			});
		} else {
			if (credit_card.httpStatusCode == "201") {

/**
 * make transaction of 5$
 */

				var creditCardId = credit_card.id;
				console.log(credit_card);
				var savedCard = {
					"intent": "sale",
					"payer": {
						"payment_method": "credit_card",
						"funding_instruments": [{
							"credit_card_token": {
								"credit_card_id": creditCardId
							}
						}]
					},
					"transactions": [{
						"amount": {
							"total": "5",
							"currency": "USD"

						},
						"description": "This is the payment transaction description."
					}]
				};
				paypal.payment.create(savedCard, function(error, payment) {
					console.log(payment);
					if (error) {
						res.json({
							"status": 198,
							"result": error
						});
					} else {
						if (payment.httpStatusCode == "201" && payment.state == "approved") {
							var card = {
								"clientId": req.decoded.clientId,
								"type": req.body.type,
								"cardno": credit_card.number,
								"expdate": req.body.expdate,
								"expyear": req.body.expyear,
								"FirstName": req.body.FirstName,
								"LastName": req.body.LastName,
								"street": req.body.street,
								"city": req.body.city,
								"state": req.body.state,
								"postal": req.body.postal,
								"country": req.body.country,
								"creditcard_token": creditCardId

							}
							var userr = {
								"paymentverified": 1
							};
							/**
							 * 
							 * add credits 
							 *
							 */
							
							var paymentinfo={
								"clientId": req.decoded.clientId,
								"amount": payment.transactions[0].amount.total,
								"paypalid": payment.id,
								"paytype": payment.payer.payment_method,
								"state":payment.state
							}
							
							mariaq.insert(c, "client_transaction", paymentinfo, function(info) {
							
							});

							mariaq.update(c, "client", userr, "clientId=" + req.decoded.clientId,
								function(data) {});



							mariaq.insert(c, "payment", card, function(info) {
								res.json({
									"status": 200,
									"result": payment
								});
							});
						} else {
							res.json({
								"status": 198,
								"result": payment
							});


						}


					}

				});
			} else {
				res.json({
					"status": 198,
					"result": credit_card
				});

			}
		}
	})



};
/**
 * make transaction
 */
exports.maketransaction = function(req, res) {


	var create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "credit_card",
			"funding_instruments": [{
				"credit_card": {
					"type": "Visa",
					"number": "4446283280247004",
					"expire_month": "11",
					"expire_year": "2018",
					"cvv2": "705",
					"first_name": "Joe",
					"last_name": "Shopper",
					"billing_address": {
						"line1": "52 N Main ST",
						"city": "Johnstown",
						"state": "OH",
						"postal_code": "43210",
						"country_code": "US"
					}
				}
			}]
		},
		"transactions": [{
			"amount": {
				"total": "7",
				"currency": "USD",
				"details": {
					"subtotal": "5",
					"tax": "1",
					"shipping": "1"
				}
			},
			"description": "This is the payment transaction description."
		}]
	};

	paypal.payment.create(create_payment_json, function(error, payment) {
		if (error) {
			// throw error;
			res.send(error);
		} else {
			console.log("Create Payment Response");
			console.log(payment);
			res.send(payment);
		}
	});
};



/**
 * save card details
 */
exports.getlink = function(req, res) {


	var create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://localhost:3000/#/paymentv",
			"cancel_url": "http://localhost:3000/#/paymentv"
		},
		"transactions": [{

			"amount": {
				"currency": "USD",
				"total": req.body.credit
			},
			"description": "This is the payment description."
		}]
	};


	paypal.payment.create(create_payment_json, function(error, payment) {
		if (error) {
			res.json({
				"status": 198,
				"result": error
			});
		} else {
			if (payment.httpStatusCode == "201") {
				console.log(payment);
				res.json({
					"status": 200,
					"link": payment.links[1].href
				});
			}
		}
	});

};


exports.test = function(req, res) {


	var execute_payment_json = {
		"payer_id": req.body.PayerID,

	};

	var paymentId = req.body.paymentId;

	paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
		if (error) {
			res.json({
				"status": 198,
				"result": error
			});
			//throw error;
		} else {
			if (payment.httpStatusCode == "200" && payment.state == "approved") {
				var userr = {
					"paymentverified": 1
				};
				/**
				 * 
				 * add credits 
				 *
				 */
					var paymentinfo={
								"clientId": req.decoded.clientId,
								"amount": payment.transactions[0].amount.total,
								"paypalid": payment.id,
								"paytype": payment.payer.payment_method,
								"state":payment.state,
								"payer_id": req.body.PayerID,

							}
							
							mariaq.insert(c, "client_transaction", paymentinfo, function(info) {
							
							});
				mariaq.update(c, "client", userr, "clientId=" + req.decoded.clientId,
					function(data) {});
				// console.log("Get Payment Response");
				// console.log(JSON.stringify(payment));


				res.json({
					"status": 200,
					"result": payment
				});
			} else {
				res.json({
					"status": 198,
					"result": payment
				});
			}
		}
	});
}