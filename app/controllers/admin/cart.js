
'use strict';
var express = require('express');
var Logger = require('../../models/admin/logger.js');
var inspect = require('util').inspect;



var connect = require('../../../app/models/maria.js');




var c = new connect.maria();



exports.selectClient = function (req, res) {


    var data = [];

    c.query('select client.clientId,client.fname,client.lname,client_wallet.current_balance from client left join client_wallet  on client.clientId=client_wallet.clientId where client.fname like "%' + req.body.data + '%" || client.lname like "%' + req.body.data + '%" || client.clientId like "%' + req.body.data + '%" LIMIT 10')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Result finished successfully');
                        });
            })
            .on('end', function () {
                res.json({
                    Data: data,
                    code: 200
                });
                console.log('Done with all results');
            });

}



exports.getwalletbalance = function (req, res) {


    var data = [];


    c.query('select * from client_wallet where clientId=' + req.body.clientId + '')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {

                        })
                        .on('end', function (info) {

                            // var ip = req.headers['x-forwarded-for'] ||
                            //        req.connection.remoteAddress ||
                            //        req.socket.remoteAddress ||
                            //        req.connection.socket.remoteAddress;
                            res.json({
                                code: 200,
                                message: "Success",
                                Data: data

                            })

                        });
            })



}


exports.deductbalance = function (req, res) {



    var data = [];


    c.query('update client_wallet set current_balance =current_balance-' + req.body.amount + ',last_activity=UNIX_TIMESTAMP()  where clientId=' + req.body.clientId + '')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {

                            res.json({
                                code: 198,
                                message: "Error",
                                Data: err

                            })
                        })
                        .on('end', function (info) {


                            res.json({
                                code: 200,
                                message: "Success",
                                Data: data

                            })

                        });
            })


}



exports.insertorderdetails = function (req, res) {

//res.send(req.body);

    var clientId = req.body.clientId;
    var productId = req.body.productId;
    var promotionCoupon = req.body.promocodes;
    var description = req.body.description;


    var ipaddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var amount = req.body.amount;
    var date = req.body.date;
    var date_time = req.body.datetime;
    var payment_status = req.body.paymentStatus;
    var duration = req.body.billingCycle;
    var orderstatus = req.body.orderStatus;//1=pending,2=active



    var orderId;
    var transactionId;
    var invoiceId;

    c.query('INSERT INTO orders (date,productId,clientId,promotionCoupon,description,billingCycle,orderStatus,ipaddress) VALUES (:date,:productId,:clientId,:promotionCoupon,:description,:billingCycle,:orderStatus,:ipaddress)', {
        date: date_time,
        productId: productId,
        clientId: clientId,
        promotionCoupon: promotionCoupon,
        description: description,
        billingCycle: duration,
        orderStatus: orderstatus,
        ipaddress: ipaddress


    })
            .on('result', function (result) {
                result.on('end', function (info) {
                    orderId = info.insertId;

                    //starting for transaction table.

                    c.query('INSERT INTO transactions(clientId,date,description,orderId,amount,status,paymentType) VALUES (:clientId,:date,:description,:orderId,:amount,:status,:paymentType)', {
                        clientId: clientId,
                        date: date,
                        description: description,
                        orderId: info.insertId,
                        amount: amount,
                        status: payment_status,
                        paymentType: "0"

                    })
                            .on('result', function (result) {
                                result.on('end', function (info) {

                                    transactionId = info.insertId;

                                    c.query('INSERT INTO invoices (clientId,orderId,productId,transactionId,date,dueDate,subTotal,datePaid,status) VALUES (:clientId,:orderId,:productId,:transactionId,:date,:dueDate,:subTotal,:datePaid,:status)', {
                                        clientId: clientId,
                                        orderId: orderId,
                                        productId: productId,
                                        transactionId: info.insertId,
                                        date: date,
                                        dueDate: date,
                                        subTotal: amount,
                                        datePaid: date,
                                        status: "1"
                                    })
                                            .on('result', function (result) {
                                                result.on('end', function (info) {
                                                    invoiceId = info.insertId;



                                                    var data = [];

                                                    c.query('update orders set invoiceId =' + invoiceId + ',transactionId=' + transactionId + ' where orderId=' + orderId + '')
                                                            .on('result', function (resrow) {
                                                                resrow.on('row', function (row) {
                                                                    data.push(row);
                                                                })

                                                                        .on('end', function (info) {

                                                                            c.query('update transactions set invoiceId =' + invoiceId + ' where transactionId=' + transactionId + '')
                                                                                    .on('result', function (resrow) {
                                                                                        resrow.on('row', function (row) {
                                                                                            data.push(row);
                                                                                        })

                                                                                                .on('end', function (info) {

                                                                                                    Logger.log("1", clientId, "6", "Payment", "1", "1", ipaddress);
                                                                                                    res.json({
                                                                                                        Data: info,
                                                                                                        code: 200,
                                                                                                        invoiceId: invoiceId,
                                                                                                        orderId: orderId,
                                                                                                        transactionId: transactionId
                                                                                                    });

                                                                                                });
                                                                                    })



                                                                        });
                                                            })









                                                    // //
                                                    // console.log('Result finished successfully');
                                                });
                                            })
                                            .on('error', function (err) {
                                                // console.log("error");

                                                res.json({
                                                    message: "Didn't get data",
                                                    code: 198,
                                                    data: err,
                                                    value: 3
                                                });


                                            })
                                });
                            })
                            .on('error', function (err) {
                                // console.log("error");

                                res.json({
                                    message: "Didn't get data",
                                    code: 198,
                                    data: err,
                                    value: 2
                                });


                            })
                    // res.json({
                    //     Data: info,
                    //     code: 200
                    // });
                    // //
                    // console.log('Result finished successfully');
                });
            })
            .on('error', function (err) {
                // console.log("error");

                res.json({
                    message: "Didn't get data",
                    code: 198,
                    data: err,
                    val: 1
                });


            })


}


exports.getProducts = function (req, res) {

    var data = [];


    c.query('select * from products where productName like "%' + req.body.product + '%"')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {

                        })
                        .on('end', function (info) {

                            // var ip = req.headers['x-forwarded-for'] ||
                            //        req.connection.remoteAddress ||
                            //        req.socket.remoteAddress ||
                            //        req.connection.socket.remoteAddress;
                            res.json({
                                code: 200,
                                message: "Success",
                                Data: data

                            })

                        });
            })

}

exports.getAllProducts = function (req, res) {
    var data = [];
    c.query('select * from products')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {

                        })
                        .on('end', function (info) {
                            res.json({
                                code: 200,
                                message: "Success",
                                Data: data

                            })

                        });
            })

}

exports.getAllClients = function (req, res) {


    var data = [];

    c.query('select client.clientId,client.fname,client.lname,client_wallet.current_balance from client left join client_wallet  on client.clientId=client_wallet.clientId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Result finished successfully');
                        });
            })
            .on('end', function () {
                res.json({
                    Data: data,
                    code: 200
                });
                console.log('Done with all results');
            });

}