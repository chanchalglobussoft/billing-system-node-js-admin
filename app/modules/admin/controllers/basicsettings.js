'use strict';
var express = require('express');
var inspect = require('util').inspect;

var async = require('async');

var connect = require('../../../models/maria.js');
var signup = require('../models/signupamount.js');

var c = new connect.maria();



exports.signupbalance = function(req, res) {

    var Data = new signup({
        insertId: Math.floor(Date.now() / 1000),
        date: {
            type: Date,
            default: Date.now
        },
        amount: "100",
        adminId: req.body.adminId,
        note: "Signup Amount"

    });
    Data.save(function(err, Data) {
        if (err)
            return console.error(err);
        console.log("saved to database");

        res.json({

            data: Data,
            code: 200
        })
    });


}

exports.addClientwallet = function(req, res) {


    signup.findOne({

    }, {}, {
        sort: {
            settingsId: -1
        }
    }, function(err, data) {
        if (err)
            return console.error(err);



        c.query('INSERT INTO client_wallet ( clientId,credit,description,last_activity,current_balance) VALUES (:clientId,:credit,:description,:last_activity,:current_balance)', {
                clientId: req.body.clientId,
                credit: data.amount,
                description: "Credit Towards Signup",
                last_activity: Math.floor(Date.now() / 1000),
                current_balance: data.amount


            })
            .on('result', function(result) {
                result.on('end', function(info) {
                    console.log(info)

                    res.json({
                        Data: info,
                        code: 200


                    })



                })


            });
    })


}

exports.transfercomm = function(req, res) {
    console.log(req.body.amount);
    console.log(req.body.clientId);



    c.query('UPDATE affiliate SET commission_withdrawn = commission_withdrawn+' + req.body.amount + ',available_mature_balance =available_mature_balance  -' + req.body.amount + ' WHERE client_id=' + req.body.clientId + '')
        .on('result', function(resrow) {
            resrow.on('row', function(row) {
                    data3.push(row);
                })
                .on('error', function(err) {

                    res.json({
                        data: err,
                        code: 198
                    })

                })
                .on('end', function(info) {
                    //console.log("Hello World");


                    c.query('UPDATE client_wallet SET current_balance = current_balance+' + req.body.amount + ',credit =' + req.body.amount + ',description="Credit Towards Affiliate Commission", last_activity=' + Math.floor(Date.now() / 1000) + ' WHERE clientId=' + req.body.clientId + '')
                        .on('result', function(resrow) {
                            resrow.on('row', function(row) {
                                    data3.push(row);
                                })
                                .on('error', function(err) {

                                    res.json({
                                        data: err,
                                        code: 198
                                    })

                                })
                                .on('end', function(info) {




                                    c.query('INSERT INTO wallet_activity(clientId,date,description,amount,type) VALUES (:clientId,:date,:description,:amount,:type)', {




                                            clientId: req.body.clientId,
                                            date: Math.floor(Date.now() / 1000),
                                            description: "Credit Towards Affiliate Commission ",
                                            amount: req.body.amount,
                                            type: 1


                                        })
                                        .on('result', function(result) {
                                            result.on('end', function(info) {
                                                console.log(info)

                                                res.json({
                                                    Data: info,
                                                    code: 200


                                                })



                                            })


                                        });




                                    //console.log("Hello World");


                                });
                        });

                });
        });


}


exports.insertPromocode=function(req,res){

    var data=[];


c.query('INSERT INTO promo_codes( promocode,validity_start,validity_end,created_by,status,type,value) VALUES (:promocode,:validity_start,:validity_end,:created_by,:status,:type,:value)', {
               promocode:req.body.code,
               validity_start:req.body.startdate,
               validity_end:req.body.enddate,
               created_by:req.body.clientId,
               status:req.body.status,
               type:req.body.type,
               value:req.body.value
 

            })
               .on('error', function(err) {

                                    res.json({
                                        data: err,
                                        code: 198
                                    })
                                })

            .on('result', function(result) {
                result.on('end', function(info) {
                    console.log(info)

                    res.json({
                        Data: info,
                        code: 200


                    })



                })


            });

}