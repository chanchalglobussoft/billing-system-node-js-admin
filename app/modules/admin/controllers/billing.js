'use strict';
var express = require('express');
var inspect = require('util').inspect;



var connect=require('../../../models/maria.js');




var c=new connect.maria();


exports.invoicedetails= function(req, res) {
    var recdata = req.body.invoiceId;

    var data = [];


    c.query('select  DISTINCT products.productName, invoices.invoiceId ,invoices.clientId,invoices.date as InvoiceDate,invoices.orderId,invoices.productId, orders.orderNumber,orders.orderId,orders.orderStatus,orders.acceptanceStatus as orderAcceptance,orders.description,client.fname,client.lname,client.mobile,client.company,client.address1,client.address2,client.state,client.country,countries.name as CountryName,client.zipcode,client.clientId, transactions.transactionId,transactions.paymentMethod,orders.description,transactions.date as paymetDate,transactions.amount,transactions.status as transactionsStatus from invoices left join client on invoices.clientId=client.clientId left join products on invoices.productId=products.productId  left join orders on invoices.invoiceId=orders.invoiceId left join transactions on invoices.invoiceId=transactions.invoiceId left join countries on countries.id_countries=client.country where invoices.invoiceId="'+recdata+'"')
        .on('result', function(resrow) {
            // console.log(resrow);
            resrow.on('row', function(row) {
                    data.push(row)
                })
                .on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {
                    // console.log("hi");
                    //console.log(total);

                    res.json({
                        Data: data,
                        code: 200
                    });
                    console.log('Result finished successfully');
                });
        })
}




exports.orderdetails=function(req, res) {
    var recdata = req.body.orderId;

    var data = [];


    c.query('select  DISTINCT  invoices.invoiceId ,orders.date as orderDate,invoices.clientId,invoices.date as InvoiceDate,client.emailId,invoices.orderId,invoices.productId, orders.orderNumber,orders.orderId,orders.orderStatus,orders.acceptanceStatus as orderAcceptance,orders.description,client.fname,client.lname,client.mobile,client.company,client.address1,client.address2,client.state,client.country,client.zipcode,client.clientId,products.productName,products.price,products.description as productdesc , transactions.transactionId,transactions.paymentMethod,transactions.date as paymetDate,transactions.amount,transactions.status as transactionsStatus from invoices join client on invoices.clientId=client.clientId join orders on invoices.invoiceId=orders.invoiceId join transactions on invoices.invoiceId=transactions.invoiceId join products on products.productId=orders.productId where(orders.orderId="' + recdata + '")')
        .on('result', function(resrow) {
            // console.log(resrow);
            resrow.on('row', function(row) {
                    data.push(row)
                })
                .on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {
                    // console.log("hi");
                    //console.log(total);

                    res.json({
                        Data: data,
                        code: 200
                    });
                    console.log('Result finished successfully');
                });
        })
}



exports.clientcount=function(req, res) {
    var data = [];
    c.query('select count(*) as clientCount from client')
        .on('result', function(resrow) {
            resrow.on('row', function(row) {
                    data.push(row);
                })
                .on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {

                    c.query('select count(*) as orderCount from orders')
                        .on('result', function(resrow) {
                            resrow.on('row', function(row) {
                                    data.push(row);
                                })
                                .on('error', function(err) {
                                    console.log('Result error: ' + inspect(err));
                                })
                                .on('end', function(info) {

                    c.query('SELECT count(*) as reg_month  FROM client WHERE regDate > DATE_SUB(NOW(), INTERVAL 1 MONTH)')
                        .on('result', function(resrow) {
                            resrow.on('row', function(row) {
                                    data.push(row);
                                })
                                .on('error', function(err) {
                                    console.log('Result error: ' + inspect(err));
                                })
                                .on('end', function(info) {

                    res.json({
                        Data: data,
                        code: 200
                    });


                                    console.log('Result finished successfully');
                                });
                        })





                                });
                        })




                    //console.log('Result finished successfully');
                });
        })
}


exports.orderstatus=function(req, res) {
    var data = [];
    c.query('SELECT orderStatus, COUNT(*)  as count FROM orders GROUP BY orderStatus')
        .on('result', function(resrow) {
            resrow.on('row', function(row) {
                    data.push(row);
                })
                .on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {

                    res.json({
                            code: 200,
                            message: "Success",
                            Data: data

                        })
                        //                                res.end(JSON.stringify({
                        //                                    Data: data
                        //                                }));
                    console.log('Result finished successfully');
                });
        });


}

exports.ordersPerClient=function(req,res){


    var data = [];
    c.query(' SELECT orders.clientId,client.fname,client.lname, COUNT(*)  as count FROM orders INNER JOIN client ON orders.clientId=client.clientId where orders.orderStatus=2 or orders.orderStatus=1  GROUP BY orders.clientId ORDER BY count desc limit 5')
        .on('result', function(resrow) {
            resrow.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {

                    res.json({
                        code: 200,
                        message: "Success",
                        Data: data

                    })
                    //                                res.end(JSON.stringify({
                    //                                    Data: data
                    //                                }));
                    console.log('Result finished successfully');
                });
        });

}



exports.amountperclient=function(req,res){




    var data = [];
    c.query('SELECT transactions.clientId,client.fname,client.lname, SUM(amount) as amount FROM transactions INNER JOIN client ON transactions.clientId=client.clientId  where transactions.status=1 GROUP BY transactions.clientId ORDER BY amount desc limit 5')
        .on('result', function(resrow) {
            resrow.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {

                    res.json({
                        code: 200,
                        message: "Success",
                        Data: data

                    })
                    //                                res.end(JSON.stringify({
                    //                                    Data: data
                    //                                }));
                    console.log('Result finished successfully');
                });
        });
}


exports.trasactionByDay=function(req,res){
// if you ate serching from 2012-05-01 to 2015-02-01 then start date will be  2012-05-01 end end date will be  2015-02-01
    var startdate=req.body.startdate;
    var enddate=req.body.enddate;

    var data = [];
    c.query('select transactions.date,transactions.transactionId,client.clientId,client.fname,client.lname,invoices.orderId,invoices.invoiceId,transactions.amount,transactions.status,products.productName from transactions join invoices on invoices.invoiceId=transactions.invoiceId join products on invoices.productId=products.productId join client on client.clientId=invoices.clientId where transactions.date>="'+startdate+'" AND transactions.date<="'+enddate+'"')
        .on('result', function(resrow) {
            resrow.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {

                    res.json({
                        code: 200,
                        message: "Success",
                        Data: data

                    })
                    //                                res.end(JSON.stringify({
                    //                                    Data: data
                    //                                }));
                    console.log('Result finished successfully');
                });
        });

}



exports.billingstatus=function(req, res) {
       var data = [];
       c.query('SELECT status, COUNT(*)  as count FROM transactions GROUP BY status')
           .on('result', function(resrow) {
               resrow.on('row', function(row) {
                       data.push(row);
                   })
                   .on('error', function(err) {
                       console.log('Result error: ' + inspect(err));
                   })
                   .on('end', function(info) {

                       res.json({
                               code: 200,
                               message: "Success",
                               Data: data

                           })
                           //                                res.end(JSON.stringify({
                           //                                    Data: data
                           //                                }));
                       console.log('Result finished successfully');
                   });
           });


   }


   exports.getticket=function(req, res) {
       var ticketId = req.body.ticketId;
       console.log("Getting the ticket" + ticketId);

       var data = [];
       c.query('SELECT tickets.*,admin.fname as adminFname,admin.lname as adminLname, client.clientId as clientId, client.fname as clientFname, client.lname as clientLname FROM tickets,admin,client where tickets.ticketId = ' + ticketId + ' and tickets.assignedTo = admin.adminId and tickets.submitter = client.clientId')
           .on('result', function(resrow) {
               resrow.on('row', function(row) {
                       data.push(row);
                   })
                   .on('error', function(err) {
                       console.log('Result error: ' + inspect(err));
                   })
                   .on('end', function(info) {

                       res.json({
                           code: 200,
                           message: "Success",
                           Data: data

                       })
                       console.log('Result finished successfully');
                   });
           });
   }
