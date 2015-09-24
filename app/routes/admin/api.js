'use strict';
var express = require('express');
// var mariaClient = require('mariasql');
//var inspect = require('util').inspect;
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var config = require('../../../config.js');
var namecheap = require('../../../app/modules/admin/controllers/namecheap');
var apiRoutes = express.Router();
var async = require('async');
var TicketReply = require('../../modules/admin/models/ticketreply.js'); // 26/6/2015 Syed Arshad
// var multer  = require('multer'); //Multer will take care of the file handling and HTML for handling form input.


var connect = require('../../../app/models/maria.js');
var clients = require('../../../app/modules/admin/controllers/clients.js');
var order = require('../../../app/modules/admin/controllers/order.js');
var tickets = require('../../../app/modules/admin/controllers/tickets.js');
var billing = require('../../../app/modules/admin/controllers/billing.js');
var profiles = require('../../../app/modules/admin/controllers/profiles.js');
var products = require('../../../app/modules/admin/controllers/products.js');
var reports = require('../../../app/modules/admin/controllers/reports.js');
var cart = require('../../../app/modules/admin/controllers/cart.js');
var admin = require('../../../app/modules/admin/controllers/admin.js');
var affiliates = require('../../../app/modules/admin/controllers/affiliates.js');
var affsettings = require('../../../app/modules/admin/controllers/affiliatesSettings.js');
var affpay = require('../../../app/modules/admin/controllers/affiliatespay.js');
var basicsettings = require('../../../app/modules/admin/controllers/basicsettings.js');
var clientprofile = require('../../../app/modules/admin/controllers/clientprofile.js');
var countries = require('../../../app/modules/admin/controllers/countries.js');
var secuQuestions = require('../../../app/modules/admin/controllers/securityQuestions.js');




//Include the following required files for using logging
//--------------------------------------------------------------------------------------------
//var Log = require('../../models/logschema.js');
var Logs = require('./logs.js');
var Logger = require('../../modules/admin/models/logger.js');
//--------------------------------------------------------------------------------------------
//  var Namecheap = require('namecheap'),
//  namecheap = new Namecheap('abhishek', 'c07cee52aa3d47918bc597efbcfca80f', '103.234.94.162','sandbox');
//--------------------------------------------------------------------------------------------
// Custom function to calculate monthly dates by Syed Arshad 15/6/2015
// Pass getDaysInMonth(6, 2015) to get June 2015th monthly calendar
// Eg:
// var d = new Date();
// console.log(d.getMonth()); will return 5 for june !!!!

//Eg: getOnlyDayNameInMonth(7,2015)
//[ 'Wed',...
//  'Fri' ]
//--------------------------------------------------------------------------------------------
// var c = new mariaClient();
// c.connect({
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'root',
//     db: 'billing',
//     port: 3306
// });

var c = new connect.maria();
c.on('connect', function() {
        console.log('MariaDB: Conneted to billing DB !');
    })
    .on('error', function(err) {
        console.log('MariaDB error: ' + err);
    })
    .on('close', function(hadError) {
        console.log('MariaDB closed');
    });

module.exports = function(app) {
    app.set('superSecret', config.secret); //setting secrete for jwt
    app.use('/admin/api', apiRoutes); //renaming api roots

    apiRoutes.post('/auth', function(req, res) {
        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        console.log(ip);
        var userId = req.body.data.userEmail;
        var password = req.body.data.password;
        var data = [];
        c.query('select * from admin where username="' + userId + '"AND password="' + password + '"')
            .on('result', function(resrow) {
                resrow.on('row', function(row) {
                        data.push(row);
                    })
                    .on('error', function(err) {
                        console.log('Result error: ' + inspect(err));
                    })
                    .on('end', function(info) {
                        if (data.length > 0) {
                            console.log(data[0].adminId)
                                // if user is found and password is right
                                // create a token
                            var token = jwt.sign(data, app.get('superSecret'), {
                                expiresInMinutes: 1440 // expires in 24 hours
                            });
                            // Logger.log(role,userId,level,msg,type,status,IP)
                            Logger.log("1", data[0].adminId, "6", "Login success - username: " + userId, "1", "1", ip);
                            res.json({
                                code: 200,
                                success: true,
                                message: 'Enjoy your token!',
                                token: token,
                                admin: data[0]
                            });
                        } else {
                            Logger.log("1", "", "3", "Login failed - username: " + userId, "1", "0", ip);
                            res.json({
                                code: 198,
                                success: false,
                                message: 'Invalid credentials',
                            });
                        }
                        //console.log('Result finished successfully');
                    });
            });
    });

    //every request to api must authenticated
    apiRoutes.use(function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
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
    // end of authentication code

    // to get the details of all of the clients in the db

    // to get the details of all of the clients in the db
    apiRoutes.get('/testapi/listall', clients.listall);


    apiRoutes.get('/getclient/:id', clients.getclient);

    //to add a new client in the db
    app.post('/addclient', clients.addclient);


    //to search a client in the db
    apiRoutes.post('/findclient', clients.findclient);


    //search domain registrations

    apiRoutes.post('/finddomain', clients.finddomain)

    //fetch cancellation requests
    apiRoutes.get('/getcancellations', clients.getcancellations);

    apiRoutes.post('/get-pending-cancellations', clients.getPendingCancellations);
    apiRoutes.post('/get-accepted-cancellations', clients.getAcceptedCancellations);

    apiRoutes.post('/updatedcancellations', clients.updatecancellations);
    apiRoutes.post('/update-client-info', clients.updateClientInfo);




    apiRoutes.post('/findorders', order.findorders);


    apiRoutes.post('/findtransations', order.findtransaction);

    apiRoutes.post('/findinvoices', order.findinvoices);


    apiRoutes.get('/neworders', order.neworders);



    apiRoutes.get('/profit', order.profit);


    apiRoutes.get('/clientActivity', order.clientActivity);




    apiRoutes.post('/getGlobal', tickets.globalsearch)

    // adding support apis below

    apiRoutes.get('/tickets/mytickets/:adminId', tickets.mytickets);

    apiRoutes.get('/tickets/activetickets/:departmentId', tickets.activetickets);

    apiRoutes.get('/tickets/scheduledtickets/', tickets.scheduledtickets);

    apiRoutes.get('/tickets/recentlyanswered/', tickets.recentlyanswered);

    apiRoutes.get('/tickets/on-hold/:adminId', tickets.onHold);



    apiRoutes.get('/tickets/listall', tickets.listall);



    //deprecated
    apiRoutes.get('/tickets/overview/:adminId/:period', tickets.overview);

    apiRoutes.post('/tickets/range-overview', tickets.rangeOverview);

    //support api's ends here

    //Invoice goes here (fetching required data on basis of invoiceId)
    apiRoutes.post('/invoicedetails', billing.invoicedetails);
    //order details
    apiRoutes.post('/orderdetails', billing.orderdetails);
    //client count
    apiRoutes.get('/clientcount', billing.clientcount);
    //order status
    apiRoutes.get('/orderstatus', billing.orderstatus);

    apiRoutes.post('/transaction-by-day', billing.trasactionByDay);



    //billing status

    apiRoutes.get('/billingstatus', billing.billingstatus);
    //upto here support apis


    apiRoutes.post('/tickets/getticket', billing.getticket);

    //Client Profile API 8/6/2015
    apiRoutes.get('/view-client-profile', profiles.clients);
    //Client Profile API upto here


    //Get all staff details
    apiRoutes.get('/get-all-staff', profiles.allstaff);
    //Get all staff details

    //Get staff by his id
    apiRoutes.get('/get-staff-by-id/:id', profiles.staffbyId);

    //add a staff  (only admin can do this)
    apiRoutes.post('/add-staff', profiles.addStaff);
    //add a staff  (only admin can do this)

    // 16/6/2015
    // Reports APIs
    // monthId = 1 for jan, 2 for feb,... By: Syed Arshad
    apiRoutes.get('/get-reports-by-month/:monthId/:yearId', profiles.reportsbymonth)
        //----------------------------------------------------------------------------------------------------------------------------------//
        //get-reports-by-month ends here


    // Reports APIs ends here

    //for dynamic pricing of Tlds
    apiRoutes.post('/change-tld-price', products.changeintldPrice);

    //to fetch updated or most recent price change
    apiRoutes.post('/get-percentage-increase', products.percentageIncrease);

    //to get Income By month
    // paymentType=0//Paid
    //status=1//sucess payment


    apiRoutes.post('/income-by-product', products.incomebyProduct);




    apiRoutes.post('/income', products.income);


    apiRoutes.post('/promocodes-report', products.promocodes);

    // Adding add reply API for individual ticket 24/6/2015 By: Syed Arshad
    // TicketReply
    apiRoutes.post('/ticket/addReply', products.addReply);

    // Adding update reply API for individual ticket 26/6/2015 By: Syed Arshad
    // update reply
    apiRoutes.post('/ticket/updateReply', products.updateReply);


    //Added By: Abhishek Singh Date:26/06/2015
    //to get client's Activity status
    apiRoutes.post('/clients-report', reports.clientsReport);

    //Added By Abhishek date:26/06/2015th
    //added api to get transaction details on basis of clientId

    apiRoutes.post('/transaction-history', reports.transactionHistory);



    //get clients registred in a peticular year
    apiRoutes.post('/clients-reg', reports.clientsReg);


    //get clients source
    apiRoutes.post('/clients-source', reports.clientsSource);

    //get client statement
    apiRoutes.post('/clients-statement', reports.clientsStatement);

    //get all  statement of a id
    apiRoutes.post('/clients-statement-all', reports.clientsStatementall);

    //clients by income
    apiRoutes.post('/clients-income', reports.clientsIncome);


    //clients by country
    apiRoutes.post('/clients-country', reports.clientsCountry);

    apiRoutes.post('/select-client', cart.selectClient);

    //affiliates
    apiRoutes.post('/get-affiliates', affiliates.getAffiliates);
    apiRoutes.post('/get-affiliate-hits', affiliates.affiliateHits);
    apiRoutes.post('/get-signups', affiliates.signups);
    app.post('/client-hits', affiliates.hits);
    app.post('/update-referral', affiliates.updatereferal);
    app.post('/check-affiliate', affiliates.checkaffiliate);
    apiRoutes.post('/affiliates-sales', affiliates.affiliatessales);
    apiRoutes.post('/affiliates-revenue', affiliates.affiliatesrevenue);
    apiRoutes.post('/affiliates-traffic', affiliates.affiliatesTraffic);




    app.post('/add-client-wallet', basicsettings.addClientwallet);
    apiRoutes.post('/add-signup-balance', basicsettings.signupbalance); //
    apiRoutes.post('/transfer-commission', basicsettings.transfercomm);
    apiRoutes.post('/insert-promocode', basicsettings.insertPromocode);




    apiRoutes.post('/affiliate-request', affsettings.affiliateRequest);
    apiRoutes.post('/affiliate-common-settings', affsettings.commonsettings);
    apiRoutes.post('/affiliate-latest-settings', affsettings.getlatestCommonAffChange);
    apiRoutes.post('/affiliate-advanced-settings', affsettings.advancedAffChange);
    apiRoutes.post('/affiliate-current-settings', affsettings.currentSett);
    apiRoutes.post('/affiliates-traffic-id', affsettings.affiliatetraff);
    apiRoutes.post('/affiliates-summery', affsettings.affsummery);
    apiRoutes.post('/freeze-account', affsettings.freezeAccount);
    apiRoutes.post('/delete-promocode', affsettings.deletePromocode);
    apiRoutes.post('/get-promocode', affsettings.getPromocode);
    apiRoutes.post('/update-promocode', affsettings.updatePromocodes);




    apiRoutes.post('/wallet-balance', cart.getwalletbalance);
    apiRoutes.post('/deduct-balance', cart.deductbalance);
    apiRoutes.post('/order-details', cart.insertorderdetails);
    apiRoutes.post('/select-product', cart.getProducts);
    apiRoutes.post('/latest-transations', order.latestTransactions);
    apiRoutes.post('/latest-findinvoices', order.latestFindinvoices);
    apiRoutes.post('/latest-findorders', order.latestFindorders);
    apiRoutes.post('/get-bills', order.getBills);
    apiRoutes.post('/get-orders-by-day', order.orderByday);
    apiRoutes.post('/orders-per-client', billing.ordersPerClient);
    apiRoutes.post('/amount-per-client', billing.amountperclient);
    apiRoutes.post('/get-all-products', cart.getAllProducts);
    apiRoutes.post('/get-all-clients', cart.getAllClients);


    // admin.insertNotes

    apiRoutes.post('/insert-notes', admin.insertNotes);
    apiRoutes.post('/find-notes', admin.findnotes);
    apiRoutes.post('/update-notes', admin.updatenotes);
    apiRoutes.post('/get-info', admin.getAdminInfo);
    apiRoutes.post('/get-my-predefined-replies', admin.getAdminReplies);
    apiRoutes.post('/client-profile',clientprofile.getclientprofile);




    apiRoutes.post('/getDomain', namecheap.searchdomain);
    apiRoutes.post('/domainprice', namecheap.domainprice); //get doamins price from namecheap api
    apiRoutes.post('/getTlds', namecheap.getTlds); //get Tld list from nameCheap api
    apiRoutes.post('/getTldsPrice', namecheap.getTldsPrice);
    apiRoutes.post('/register-domain', namecheap.registerDomain); //register a domain
    apiRoutes.post('/get-tld-domain', namecheap.tldDomain); //get All tlds from database
    apiRoutes.post('/namecheap-balance', namecheap.getbalance); //get All tlds from database
    apiRoutes.post('/get-registered-domains', namecheap.getregistereddomains); //get all registred domains to account
    apiRoutes.post('/domain-info', namecheap.getdomaininfo); //get registered domain information

    //  apiRoutes.post('/change-tld-price', namecheap.changeTldPrice);//Change Price of Tlds in Database

    // All new APIs goes below this: 01/07/2015 By:Syed Arshad
    //----------------------------------------------------------------------------------------------------------------------

    // Adding Support section's Report API by Syed Arshad 9/7/2015 (Refer app/modules/admin/controllers/reports.js for full APIs)
    apiRoutes.post('/calculateRTPT', reports.calculateRTPT);
    apiRoutes.post('/calculateART', reports.calculateART);
    apiRoutes.post('/calculateAFRT', reports.calculateAFRT);
    apiRoutes.post('/calculateADT', reports.calculateADT);
    apiRoutes.post('/calculateDTR', reports.calculateDTR);
    // 27/7/2015 by Syed Arshad
    apiRoutes.get('/tickets/set-ticket-status/:adminId/:ticketId', tickets.setTicketStatus);
    apiRoutes.get('/tickets/change-ticket-status/:adminId/:ticketId/:status', tickets.changeTicketStatus);
    apiRoutes.get('/tickets/get-product-services/:clientId', tickets.getClientsProdsOrServices);
    //11/8/2015 by Syed Arshad
    apiRoutes.post('/tickets/ticket-reply', tickets.saveTicketReply);
    apiRoutes.post('/tickets/get-ticket-replies', tickets.getTicketReplies);
    apiRoutes.post('/tickets/delete-this-reply', tickets.deleteThisReply);


    apiRoutes.post('/country/get-all-data', countries.getAllData);
    apiRoutes.post('/country/get-only-names', countries.getOnlyCountryNames);
    apiRoutes.post('/country/get-only-currencies', countries.getOnlyCurrencies);

    apiRoutes.post('/security-questions/get-all-data', secuQuestions.getAllData);
    apiRoutes.post('/security-questions/get-only-questions', secuQuestions.getOnlyQuestions);


//    var uploading = multer({dest: __dirname + '../../../public/uploads/ticket-attachements',});
//    apiRoutes.post('/tickets/ticket-reply',uploading, tickets.saveTicketReply);



    //----------------------------------------------------------------------------------------------------------------------

}; //module.exports ends here
