'use strict';
var express = require('express');
var inspect = require('util').inspect;
var moment = require('moment');
var connect = require('../../../models/maria.js');
var c = new connect.maria();

exports.latestFindorders = function (req, res) {
    var data = [];

    c.query('SELECT orders.orderId,orders.invoiceId,orders.date,orders.orderStatus as orderStatus,orders.transactionId, transactions.paymentMethod, transactions.amount, transactions.status as transactionStatus, client.fname, client.lname, client.clientId  FROM orders LEFT JOIN transactions ON orders.orderId = transactions.orderId LEFT JOIN client ON orders.clientId = client.clientId ')
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



exports.getBills = function (req, res) {

    var data = [];
    c.query('select * from transactions ORDER BY transactionId DESC LIMIT 5')
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


exports.findorders = function (req, res) {
    var data = req.body.data;
        console.log("---------------------------------------");
        console.log(data);
        console.log("---------------------------------------");
    var dateSwitch = req.body.dateswitch;
    var daySwitch = req.body.dayswitch;
    console.log("Post data: " + JSON.stringify(data));
    console.log("and dateswitch " + dateSwitch + "and dayswitch " + daySwitch);

    var clientID = data.cID;
    var clientName = data.cName;
    var invoiceNo = data.invoiceNo;
    var orderNo = data.orderNo;
    var amount = data.amount;

    var status = data.status;
    var paymethod = data.gateway;

    var transactionID = data.transactionID;


    var dateRange = data.datesrange;
    var daysAgo = data.daysAgo;
    var startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
    var endDate = moment(dateRange.endDate).format("YYYY-MM-DD");
    var data = [];

    if (!clientID && !clientName && !invoiceNo && !orderNo && !amount && !status && !paymethod && !transactionID && !dateSwitch && !daySwitch)
    {
        console.log("Nothing entered in the form");
        // var baseQuery = 'SELECT orders.orderId, orders.orderStatus,orders.date,client.fname,client.lname,transactions.paymentMethod,transactions.amount,transactions.invoiceId,transactions.status as paymentStatus FROM orders LEFT JOIN client on client.clientId = orders.clientId LEFT JOIN  transactions on transactions.orderId = orders.orderId';
        // var baseQuery = 'select * from orders left join client on client.clientId = orders.clientId left join transactions on transactions.orderId = orders.orderId';
        var baseQuery ='SELECT orders.orderId,orders.invoiceId,orders.date,orders.orderStatus as orderStatus,orders.transactionId, transactions.paymentMethod, transactions.amount, transactions.status as transactionStatus, client.fname, client.lname, client.clientId  FROM orders LEFT JOIN transactions ON orders.orderId = transactions.orderId LEFT JOIN client ON orders.clientId = client.clientId ';
    }
    else
    {
        console.log("At least one thing has been updated");
        // var baseQuery = 'SELECT orders.orderId, orders.orderStatus,orders.date,client.fname,client.lname,transactions.paymentMethod,transactions.amount,transactions.invoiceId,transactions.status as paymentStatus FROM orders LEFT JOIN client on client.clientId = orders.clientId LEFT JOIN  transactions on transactions.orderId = orders.orderId and ';
        //var baseQuery = 'select * from orders left join client on client.clientId = orders.clientId left join transactions on transactions.orderId = orders.orderId where ';

      var baseQuery ='SELECT orders.orderId,orders.invoiceId,orders.date,orders.orderStatus as orderStatus,orders.transactionId, transactions.paymentMethod, transactions.amount, transactions.status as transactionStatus, client.fname, client.lname, client.clientId  FROM orders LEFT JOIN transactions ON orders.orderId = transactions.orderId LEFT JOIN client ON orders.clientId = client.clientId where ';
    }

//WHERE (client.fname lIKE "%' + name + '%"||client.lname lIKE "%' + name + '%"|| orders.orderId like "%' + orderNumber + '%" || orders.date like "' + date + '" || transactions.amount like "%' + amount + '%"|| client.status like "' + clientStatus + '"|| transactions.status = "' + paymentStatus + '"|| orders.orderStatus like "' + orderStatus + '"|| orders.ipaddress like "' + ipaddress + '

var operatorRequired = 0;
var clientIDQuery = '( client.clientId = "' + clientID + '")';
var clientNameQuery = ' ( client.fname lIKE "%' + clientName + '%" || client.lname lIKE "%' + clientName + '%" )';
var invoiceQuery = '( transactions.invoiceId = "' + invoiceNo + '")';
var orderQuery = '( orders.orderId = "' + orderNo + '")';
var amountQuery = '( transactions.amount  = "' + amount + '")';
var statusQuery = '( transactions.status  = "' + status + '")';
var paymethodQuery = '( transactions.paymentMethod  = "' + paymethod + '")';
var transactionQuery = '( orders.transactionId  = "' + transactionID + '")';


if (clientID)
{
    baseQuery = baseQuery + clientIDQuery;
    operatorRequired = 1;
}

if (clientName)
{
    if (operatorRequired == 1)
        baseQuery = baseQuery + ' and ' + clientNameQuery;
    else
    {
        baseQuery = baseQuery + clientNameQuery;
        operatorRequired = 1;
    }
}

if (invoiceNo)
{
    if (operatorRequired == 1)
        baseQuery = baseQuery + ' and ' + invoiceQuery;
    else
    {
        baseQuery = baseQuery + invoiceQuery;
        operatorRequired = 1;
    }
}

if (orderNo)
{
    if (operatorRequired == 1)
        baseQuery = baseQuery + ' and ' + orderQuery;
    else
    {
        baseQuery = baseQuery + orderQuery;
        operatorRequired = 1;
    }
}

if (amount)
{
    if (operatorRequired == 1)
        baseQuery = baseQuery + ' and ' + amountQuery;
    else
    {
        baseQuery = baseQuery + amountQuery;
        operatorRequired = 1;
    }
}

if (status)
{
    if (operatorRequired == 1)
        baseQuery = baseQuery + ' and ' + statusQuery;
    else
    {
        baseQuery = baseQuery + statusQuery;
        operatorRequired = 1;
    }
}

if (paymethod)
{
    if (operatorRequired == 1)
        baseQuery = baseQuery + ' and ' + paymethodQuery;
    else
    {
        baseQuery = baseQuery + paymethodQuery;
        operatorRequired = 1;
    }
}

if (transactionID)
{
    if (operatorRequired == 1)
        baseQuery = baseQuery + ' and ' + transactionQuery;
    else
    {
        baseQuery = baseQuery + transactionQuery;
        operatorRequired = 1;
    }
}

if (dateSwitch)
{
    if (operatorRequired == 1)
        baseQuery = baseQuery + ' and orders.date between CAST("' + startDate + '" AS DATE) and CAST("' + endDate + '" AS DATE)';
    else
    {
        baseQuery = baseQuery + ' orders.date between CAST("' + startDate + '" AS DATE) and CAST("' + endDate + '" AS DATE)';
        operatorRequired = 1;
    }

}
if (daySwitch)
{
    if (operatorRequired == 1)
        baseQuery = baseQuery + ' and orders.date between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
    else
    {
        baseQuery = baseQuery + 'orders.date between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
        operatorRequired = 1;
    }

}

    var data = [];

console.log(baseQuery);

    // c.query('SELECT orders.orderId, orders.orderStatus,orders.date,client.fname,client.lname,transactions.paymentMethod,transactions.amount,transactions.invoiceId,transactions.status as paymentStatus FROM orders LEFT JOIN client on client.clientId = orders.clientId LEFT JOIN  transactions on transactions.orderId = orders.orderId WHERE (client.fname lIKE "%' + name + '%"||client.lname lIKE "%' + name + '%"|| orders.orderId like "%' + orderNumber + '%" || orders.date like "' + date + '" || transactions.amount like "%' + amount + '%"|| client.status like "' + clientStatus + '"|| transactions.status = "' + paymentStatus + '"|| orders.orderStatus like "' + orderStatus + '"|| orders.ipaddress like "' + ipaddress + '")')
c.query(baseQuery)
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

exports.latestTransactions = function (req, res) {
    var data = [];
    c.query('SELECT client.clientId,client.fname,client.lname,amount,invoiceId,transactions.date as transactionsDate,transactions.status,transactions.description,transactions.paymentMethod, transactions.orderId FROM transactions JOIN client on client.clientId = transactions.clientId where transactions.date = date(now())')
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

exports.findtransaction = function (req, res) {

    var data = req.body.data;
    var dateSwitch = req.body.dateswitch;
    var daySwitch = req.body.dayswitch;
    console.log("Post data: " + JSON.stringify(data) + "and dateswitch " + dateSwitch + "and dayswitch " + daySwitch);

    var clientName = data.cName;
    var invoiceNo = data.invoiceNo;
    var orderNo = data.orderNo;
    var status = data.status;
    var amount = data.amount;
    var gateway = data.gateway;
    var dateRange = data.datesrange;
    var daysAgo = data.daysAgo;

    console.log("daysAgo" + daysAgo);
    var startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
    var endDate = moment(dateRange.endDate).format("YYYY-MM-DD");
    var data = [];

    if (!clientName && !invoiceNo && !orderNo && !status && !amount && !gateway && !dateSwitch && !daySwitch)
    {
        console.log("Nothing entered in the form");
        var baseQuery = 'SELECT client.fname,client.lname,amount,invoiceId,transactions.date as transactionsDate,transactions.status,transactions.description,transactions.paymentMethod, transactions.orderId FROM transactions JOIN client on client.clientId = transactions.clientId';
    }
    else
    {
        console.log("At least one thing has been updated");
        var baseQuery = 'SELECT client.fname,client.lname,amount,invoiceId,transactions.date as transactionsDate,transactions.status,transactions.description,transactions.paymentMethod, transactions.orderId FROM transactions JOIN client on client.clientId = transactions.clientId where ';
    }


//    var baseQuery = 'SELECT client.fname,client.lname,amount,invoiceId,transactions.date as transactionsDate,transactions.status,description,paymentMethod, orderId FROM transactions JOIN client on client.clientId = transactions.clientId where ';

    var operatorRequired = 0;
    var cnameQuery = '( client.fname like "%' + clientName + '%" || client.lname like "%' + clientName + '%" )';
    var amountQuery = 'transactions.amount like "%' + amount + '%"';
    var invoiceQuery = 'transactions.invoiceId like "%' + invoiceNo + '%"';
    var orderQuery = 'orderId like "%' + orderNo + '%"';
    var statusQuery = 'transactions.status = "' + status + '"';
    var gatewayQuery = 'transactions.paymentMethod = "' + gateway + '"';

    if (clientName)
    {
        baseQuery = baseQuery + cnameQuery;
        operatorRequired = 1;
    }

    if (amount)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + amountQuery;
        else
        {
            baseQuery = baseQuery + amountQuery;
            operatorRequired = 1;
        }
    }

    if (invoiceNo)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + invoiceQuery;
        else
        {
            baseQuery = baseQuery + invoiceQuery;
            operatorRequired = 1;
        }
    }
    if (orderNo)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + orderQuery;
        else
        {
            baseQuery = baseQuery + orderQuery;
            operatorRequired = 1;
        }
    }

    if (status)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + statusQuery;
        else
        {
            baseQuery = baseQuery + statusQuery;
            operatorRequired = 1;
        }
    }
    if (gateway)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + gatewayQuery;
        else
        {
            baseQuery = baseQuery + gatewayQuery;
            operatorRequired = 1;
        }
    }

    if (dateSwitch)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and transactions.date between CAST("' + startDate + '" AS DATE) and CAST("' + endDate + '" AS DATE)';
        else
        {
            baseQuery = baseQuery + ' transactions.date between CAST("' + startDate + '" AS DATE) and CAST("' + endDate + '" AS DATE)';
            operatorRequired = 1;
        }

    }
    if (daySwitch)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and transactions.date between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
        else
        {
            baseQuery = baseQuery + 'transactions.date between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
            operatorRequired = 1;
        }

    }

    console.log("baseQuery" + baseQuery);

    c.query(baseQuery)
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

exports.latestFindinvoices = function (req, res) {


    var data = [];

//    c.query('SELECT  DISTINCT invoices.invoiceId, client.fname, client.lname,orders.orderId, transactions.date as transactionDate,transactions.status as transactionStatus,transactions.paymentMethod,transactions.amount, invoices.status as invoiceStatus FROM invoices JOIN client on client.clientId = invoices.clientId JOIN transactions on invoices.clientId  = transactions.clientId join orders on invoices.clientId=orders.clientId where transactions.date = date(now());')
    c.query('SELECT i.invoiceId, i.orderId, i.status as invoiceStatus, t.paymentMethod, t.date as transactionDate, t.amount, t.status  as transactionStatus, c.fname, c.lname, c.clientId from invoices as i, transactions as t, client as c where i.orderId = t.orderId and i.clientId = c.clientId and t.date = date(now())')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            //  console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Result finished successfully');
                        });
            })
            .on('end', function () {
                res.json({
                    Data: data,
                    Todays: 1,
                    code: 200
                });
                console.log('Done with all results');
            });

}



exports.orderByday = function (req, res) {
    var current_date = req.body.current_date;
    var other_date = req.body.other_date;



    var data = [];

    c.query('SELECT * FROM orders  where date > "' + other_date + '%"  and date <="' + current_date + '%"')
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

exports.findinvoices = function (req, res) {

    var data = req.body.data;
    var dateSwitch = req.body.dateswitch;
    var daySwitch = req.body.dayswitch;
    console.log(data);

    var clientName = data.cName;
    var payMethod = data.gateway;
    var invoiceId = data.invoice;
    var orderNo = data.orderNo;
    var amount = data.amount;
    var statusF = data.status;
    var dateRange = data.datesrange;
    var daysAgo = data.daysAgo;


    console.log("daysAgo" + daysAgo);
    var startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
    var endDate = moment(dateRange.endDate).format("YYYY-MM-DD");


    if (!clientName && !payMethod && !invoiceId && !orderNo && !amount && !statusF && !dateSwitch && !daySwitch)
    {
        console.log("Nothing entered in the form");
        var baseQuery = 'SELECT  DISTINCT invoices.invoiceId,client.clientId, client.fname, client.lname,invoices.orderId, transactions.date as transactionDate,transactions.status as transactionStatus,transactions.paymentMethod,transactions.amount, invoices.status as invoiceStatus FROM invoices JOIN client on client.clientId = invoices.clientId JOIN transactions on invoices.invoiceId  = transactions.invoiceId';
    }
    else
    {
        console.log("At least one thing has been updated");
        var baseQuery = 'SELECT  DISTINCT invoices.invoiceId,client.clientId, client.fname, client.lname,invoices.orderId, transactions.date as transactionDate,transactions.status as transactionStatus,transactions.paymentMethod,transactions.amount, invoices.status as invoiceStatus FROM invoices JOIN client on client.clientId = invoices.clientId JOIN transactions on invoices.invoiceId  = transactions.invoiceId  where ';
    }

//    var baseQuery = 'SELECT  DISTINCT invoices.invoiceId, client.fname, client.lname,invoices.orderId, transactions.date as transactionDate,transactions.status as transactionStatus,transactions.paymentMethod,transactions.amount, invoices.status as invoiceStatus FROM invoices JOIN client on client.clientId = invoices.clientId JOIN transactions on invoices.invoiceId  = transactions.invoiceId  where ';

    var operatorRequired = 0;
//    var dateOperatorRequired = 0;
    var cnameQuery = '( client.fname like "%' + clientName + '%" || client.lname like "%' + clientName + '%" )';
    var paymentQuery = 'transactions.paymentMethod = "' + payMethod + '"';
    var invoiceQuery = 'transactions.invoiceId like "%' + invoiceId + '%"';
    var amountQuery = 'transactions.amount like "%' + amount + '%"';
    var statusQuery = 'transactions.status = "' + statusF + '"';
    var orderQuery = 'transactions.orderId like "%' + orderNo + '%"';


    if (clientName)
    {
        baseQuery = baseQuery + cnameQuery;
        operatorRequired = 1;
    }

    if (payMethod)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + paymentQuery;
        else
            baseQuery = baseQuery + paymentQuery;
        operatorRequired = 1;
    }

    if (invoiceId)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + invoiceQuery;
        else
            baseQuery = baseQuery + invoiceQuery;
        operatorRequired = 1;
    }

    if (amount)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + amountQuery;
        else
            baseQuery = baseQuery + amountQuery;
        operatorRequired = 1;
    }



    if (statusF)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + statusQuery;
        else
            baseQuery = baseQuery + statusQuery;
        operatorRequired = 1;
    }

    if (orderNo)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + orderQuery;
        else
            baseQuery = baseQuery + orderQuery;
        operatorRequired = 1;
    }

    if (dateSwitch)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and transactions.date between CAST("' + startDate + '" AS DATE) and CAST("' + endDate + '" AS DATE)';
        else
        {
            baseQuery = baseQuery + ' transactions.date between CAST("' + startDate + '" AS DATE) and CAST("' + endDate + '" AS DATE)';
            operatorRequired = 1;
        }

    }
    if (daySwitch)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and transactions.date between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
        else
        {
            baseQuery = baseQuery + 'transactions.date between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
            operatorRequired = 1;
        }
    }
    console.log(baseQuery);
    var data = [];

//    c.query('SELECT  DISTINCT invoices.invoiceId, client.fname, client.lname,invoices.orderId, transactions.date as transactionDate,transactions.status as transactionStatus,transactions.paymentMethod,transactions.amount, invoices.status as invoiceStatus FROM invoices JOIN client on client.clientId = invoices.clientId JOIN transactions on invoices.invoiceId  = transactions.invoiceId  where client.fname like "%' + clientName + '%"|| client.lname like "%' + clientName + '%"|| transactions.status="' + statusF + '" ||transactions.amount="' + amount + '"|| invoices.invoiceId="' + invoiceId + '"||transactions.paymentMethod="' + payMethod + '" ')
    c.query(baseQuery)
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


                //console.log(data);
                //console.log("helloooe");
                res.json({
                    Data: data,
                    code: 200
                });

            });
}


exports.neworders = function (req, res) {
    var data = [];
    c.query('SELECT COUNT(*) AS Count  FROM orders Where orderStatus=0')
            .on('result', function (resrow) {
                // console.log(resrow);
                resrow.on('row', function (row) {

                    console.log(row);
                    // console.log(row.Count)
                    data.push(row.Count);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            res.json({
                                Data: data,
                                code: 200
                            });
                            console.log('Result finished successfully');
                        });
            })
}


exports.profit = function (req, res) {
    var data = [];
    var total = 0;
    c.query('SELECT amount FROM transactions')
            .on('result', function (resrow) {
                // console.log(resrow);
                resrow.on('row', function (row) {
                    var fees = parseInt(row.fees); //parsing data to integer type
                    total += fees


                    //console.log(row.fees);
                    // console.log(row.Count)
                    //;
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            // console.log("hi");
                            //console.log(total);
                            data.push(total)
                            res.json({
                                Data: data,
                                code: 200
                            });
                            console.log('Result finished successfully');
                        });
            })
}

exports.clientActivity = function (req, res) {
    var data = [];

    c.query('select count(*) as count from client')
            .on('result', function (resrow) {
                // console.log(resrow);
                resrow.on('row', function (row) {
                    data.push(row);

                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            res.json({
                                Data: data,
                                code: 200
                            });
                            // console.log("hi");
                            //console.log(total);
                            //data.push(total)
                            //res.end(JSON.stringify({ Data: data }));
                            console.log('Result finished successfully');
                        });
            });

    c.query('select count(*) as active from client where status =1')
            .on('result', function (resrow) {
                // console.log(resrow);
                resrow.on('row', function (row) {
                    data.push(row);

                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            // console.log("hi");
                            //console.log(total);
                            //data.push(total)
                            //res.end(JSON.stringify({ Data: data }));
                            res.json({
                                Data: data,
                                code: 200
                            });
                            console.log('Result finished successfully');
                        });
            });

    c.query('select count(*) as inactive from client where status =0')
            .on('result', function (resrow) {
                // console.log(resrow);
                resrow.on('row', function (row) {
                    data.push(row);

                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            // console.log("hi");
                            //console.log(total);
                            //data.push(total)
                            res.json({
                                Data: data,
                                code: 200
                            });
                            console.log('Result finished successfully');
                        });
            })



}
