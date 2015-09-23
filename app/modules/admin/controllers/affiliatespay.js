'use strict';
var express = require('express');
var inspect = require('util').inspect;

var async = require('async');

var connect = require('../../../models/maria.js');
var affiliate = require('../models/affiliatesettings.js');

var c = new connect.maria();



var CronJob = require('cron').CronJob;


 /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 PM. It does not run on Saturday
   * or Sunday.
   */

new CronJob('00 30 23 * * 1-5', function() {

    var i;
    var commission;
    var data = [];
    var data2 = [];
    var data3 = [];
    c.query('select affiliate.commission_withdrawn, affiliate.commission_type,affiliate.commission_percentage,affiliate.commission_amount,affiliate_referrals.affiliate_referrals_id,affiliate_referrals.affiliate_id,sum(transactions.amount) as revenue,transactions.clientId from affiliate_referrals  join transactions on transactions.clientId=affiliate_referrals.referred_to join affiliate on affiliate.client_id=affiliate_referrals.affiliate_id where affiliate_referrals.status=1 GROUP BY affiliate_referrals.affiliate_id')
        .on('result', function(resrow) {
            resrow.on('row', function(row) {
                    data.push(row);
                })
                .on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {



                    async.each(data, function(data1, next) {
                        var maturebalance = 0;


                       // console.log(data1);
                        if (data1.commission_type == 1) {


                            maturebalance = data1.commission_amount - data1.commission_withdrawn;

                            c.query('update affiliate set affiliate.available_commission_balance=' + data1.commission_amount + ',status=0,affiliate.available_mature_balance="' + maturebalance + '" where affiliate.client_id=' + data1.affiliate_id + '')
                                .on('result', function(resrow) {
                                    resrow.on('row', function(row) {
                                            data3.push(row);
                                        })
                                        .on('error', function(err) {

                                        })
                                        .on('end', function(info) {
                                            //console.log("Hello World");
                                            next();


                                        });
                                });


                        } else if (data1.commission_type == 2) {
                            commission = calculateamount(data1.commission_percentage, data1.revenue);
                            maturebalance = commission - data1.commission_withdrawn;

                            c.query('update affiliate set affiliate.available_commission_balance=' + commission + ',status=1,affiliate.available_mature_balance="' + maturebalance + '" where affiliate.client_id=' + data1.affiliate_id + '')
                                .on('result', function(resrow) {
                                    resrow.on('row', function(row) {
                                            data3.push(row);
                                        })
                                        .on('error', function(err) {

                                        })
                                        .on('end', function(info) {
                                            // console.log("Hello World");
                                            next();


                                        });
                                });

                        } else if (data1.commission_type == 3) {
                            maturebalance = data1.commission_amount - data1.commission_withdrawn;

                            c.query('update affiliate set affiliate.available_commission_balance=' + data1.commission_amount + ',status=1,affiliate.available_mature_balance="' + maturebalance + '" where affiliate.client_id=' + data1.affiliate_id + '')
                                .on('result', function(resrow) {
                                    resrow.on('row', function(row) {
                                            data3.push(row);
                                        })
                                        .on('error', function(err) {

                                        })
                                        .on('end', function(info) {
                                            //console.log("Hello World");
                                            next();


                                        });
                                });

                        }




                    }, function(err) {



                        // all data has been updated
                        // do whatever you want

                    });




                });


        });




}, null, true, 'America/Los_Angeles');


















new CronJob('0 */1 * * * *', function() {


console.log("hello");


}, null, true, 'America/Los_Angeles');






















function calculateamount(amount, percentage) {
    // console.log("break");
    // console.log(amount);
    // console.log(percentage);

    var finaldata = 0;
    finaldata = (amount / 100) * percentage;

    return finaldata;


}