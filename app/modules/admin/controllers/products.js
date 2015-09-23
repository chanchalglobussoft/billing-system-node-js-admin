'use strict';
var express = require('express');
var inspect = require('util').inspect;



var connect=require('../../../models/maria.js');




var c=new connect.maria();


exports.changeintldPrice=function(req, res) {
      var a = Math.floor(new Date() / 1000);
      c.query('INSERT INTO tld_price_change ( percentage_increase,last_update_timestamp,last_updater_id) VALUES("' + req.body.value + '",' + a + ',1)')
          .on('result', function(result) {
              result.on('end', function(info) {

                  res.json({
                      Data: info,
                      code: 200
                  });
                  //
                  console.log('Result finished successfully');
              });
          })
  }



  exports.percentageIncrease=function(req, res) {

      var data = [];
      c.query('select percentage_increase as percentage from tld_price_change ORDER BY last_update_timestamp DESC LIMIT 1')
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
                          message: "sucess",
                          Data: data

                      })

                  });
          });



  }



exports.incomebyProduct=  function(req, res) {

     var data = [];


     c.query('select transactions.amount,transactions.status, transactions.date,orders.orderId,orders.orderStatus, products.productName,transactions.paymentType from transactions join orders on transactions.orderId= orders.orderId join products on orders.productId=products.productId')
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
                         message: "sucess",
                         Data: data

                     })

                 });
         });



 }


 exports.income=function(req, res) {
    var data = [];

    console.log(req.body.enddate);
    console.log(req.body.startdate);
    c.query('select amount,paymentType,status,date from transactions where date >"' + req.body.enddate + '" And date <"' + req.body.startdate + '"')
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
                        message: "sucess",
                        Data: data

                    })

                });
        });



}




exports.promocodes=function(req, res) {

    var data = [];


    c.query('select * from promo_codes order by promocode_id desc')
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
                        message: "sucess",
                        Data: data

                    })

                });
        });
}


exports.addReply= function(req, res) {

    var ticketId = req.body.ticketId;
    var adminId = req.body.adminId;
    var adminReply = req.body.adminReply;
    var reply = new TicketReply({
        ticketId: ticketId,
        adminId: adminId,
        adminReply: adminReply
    });
    reply.save(function(err) {
        if (err) {
            return err;
        } else {
            console.log("Admin reply saved for " + ticketId);
        }
    });

}


exports.updateReply= function(req, res) {
    //        console.log("Came to update Reply");
    //      var ObjectId = "558bab37be2edee01f2aa854";
    var ObjectId = req.body.objectId;;
    var ticketId = req.body.ticketId;
    var adminId = req.body.adminId;
    var adminReply = req.body.adminReply;
    TicketReply.findById(ObjectId, function(err, doc) {
        if (err) {
            return err;
        } else {
            doc.ticketId = ticketId,
                doc.adminId = adminId,
                doc.adminReply = adminReply,
                doc.save();
            console.log("Admin reply updated for ticket#: " + ticketId);
        }
    });
}
