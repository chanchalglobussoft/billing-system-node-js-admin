'use strict';
var express = require('express');
var inspect = require('util').inspect;
var connect = require('../../../models/maria.js');
var c = new connect.maria();



exports.getAffiliates = function(req, res) {

    var data = [];

    c.query('select count(*) as affiliates_count from affiliate')
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



                    c.query('select status, count(*) as affiliates_status from affiliate_referrals GROUP BY  status')
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



                });
        })
}


exports.affiliateHits = function(req, res) {

    var data = [];

    c.query('select date_of_referral,count(*) as no_of_hits from affiliate_referrals WHERE   date_of_referral  GROUP BY  DATE(date_of_referral)')
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

exports.signups = function(req, res) {

    var data = [];

    c.query('select date_of_referral,count(*) as no_of_hits from affiliate_referrals WHERE status=1 AND date_of_referral  GROUP BY  DATE(date_of_referral)')
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

exports.hits = function(req, res) {
    var data = req.body;

    console.log(data);
    // res.send({data:"coming"});
    // {username:data.eMail , password:data.passWd, fname: data.fName, lname: data.lName, mobile: data.phone, emailId: data.eMail, skypeId:data.skype})
    c.query('INSERT INTO affiliate_referrals (affiliate_id,date_of_referral,ip,status) VALUES (:affiliate_id,:date_of_referral,:ip,:status)', {
            affiliate_id: data.affiliate_id,
            date_of_referral: data.date_of_referral,
            status: 0,
            ip: req.header('x-forwarded-for') || req.connection.remoteAddress

        })
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
        .on('error', function(err) {
            // console.log("error");

            res.json({
                message: "Didn't get data",
                code: 198
            });

            console.log('Result error: ' + inspect(err));
        })



}


exports.updatereferal = function(req, res) {

    var clientId = req.body.clientId;
    var reffId = req.body.data;
    var date = req.body.date;

    var data = [];
    c.query('update affiliate_referrals set referred_to =' + clientId + ',status=1,date_of_referral="' + date + '"  where affiliate_referrals_id=' + reffId + '')
        .on('result', function(resrow) {
            resrow.on('row', function(row) {
                    data.push(row);
                })
                .on('error', function(err) {

                    res.json({
                        code: 198,
                        message: "Error",
                        Data: err

                    })
                })
                .on('end', function(info) {


                    res.json({
                        code: 200,
                        message: "Success",
                        Data: data

                    })

                });
        })
}




exports.checkaffiliate = function(req, res) {

    var affiliate_id = req.body.affiliate_id;

    var data = [];


    c.query('select client_id from affiliate where affiliate_link="' + affiliate_id + '"')
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


exports.affiliatessales = function(req, res) {
    var data = [];
    var data1 = [];
    var data2 = [];
    var data3 = [];
    var data4 = [];
    var x = 0;
    c.query('select affiliate_referrals.affiliate_referrals_id,client.fname, client.lname ,count(*)as total_hits,client.clientId from affiliate_referrals  join client on client.clientId=affiliate_referrals.affiliate_id  GROUP BY client.clientId')
        .on('result', function(resrow) {
            // console.log(resrow);
            resrow.on('row', function(row) {
                    data1.push(row)
                })
                .on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {



                    c.query('select affiliate_referrals.affiliate_referrals_id,client.fname ,client.clientId,count(*)as total_signups from  affiliate_referrals  join client on client.clientId=affiliate_referrals.affiliate_id where affiliate_referrals.status=1  GROUP BY client.clientId')
                        .on('result', function(resrow) {
                            // console.log(resrow);
                            resrow.on('row', function(row) {
                                    data2.push(row)
                                })
                                .on('error', function(err) {
                                    console.log('Result error: ' + inspect(err));
                                })
                                .on('end', function(info) {


                                    insertdata(data1, data2);


                                    c.query('select affiliate_referrals.affiliate_referrals_id,affiliate_referrals.affiliate_id,count(*) as no_of_purchase,transactions.clientId from affiliate_referrals  join transactions on transactions.clientId=affiliate_referrals.referred_to where affiliate_referrals.status=1 GROUP BY affiliate_referrals.affiliate_id')
                                        .on('result', function(resrow) {
                                            // console.log(resrow);
                                            resrow.on('row', function(row) {
                                                    data3.push(row)
                                                })
                                                .on('error', function(err) {
                                                    console.log('Result error: ' + inspect(err));
                                                })
                                                .on('end', function(info) {
                                                    insertpurchase(data1, data3);

                                                    res.json({
                                                        Data: data1,
                                                        code: 200
                                                    });
                                                    console.log('Result finished successfully');

                                                });
                                        })




                                });
                        })




                });
        })

}




exports.affiliatesrevenue = function(req, res) {
    var data = [];
    var data1 = [];
    var data2 = [];
    var data3 = [];
    var data4 = [];
    var x = 0;
    c.query('select affiliate_referrals.affiliate_referrals_id,client.fname,client.lname ,count(*)as total_hits,client.clientId from affiliate_referrals  join client on client.clientId=affiliate_referrals.affiliate_id  GROUP BY client.clientId ORDER BY total_hits DESC ')
        .on('result', function(resrow) {
            // console.log(resrow);
            resrow.on('row', function(row) {
                    data1.push(row)
                })
                .on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {



                    c.query('select affiliate_referrals.affiliate_referrals_id,client.fname ,client.clientId,count(*)as total_signups from  affiliate_referrals  join client on client.clientId=affiliate_referrals.affiliate_id where affiliate_referrals.status=1  GROUP BY client.clientId')
                        .on('result', function(resrow) {
                            // console.log(resrow);
                            resrow.on('row', function(row) {
                                    data2.push(row)
                                })
                                .on('error', function(err) {
                                    console.log('Result error: ' + inspect(err));
                                })
                                .on('end', function(info) {


                                    insertdata(data1, data2);


                                    c.query('select affiliate_referrals.affiliate_referrals_id,affiliate_referrals.affiliate_id,sum(transactions.amount) as revenue,transactions.clientId from affiliate_referrals  join transactions on transactions.clientId=affiliate_referrals.referred_to where affiliate_referrals.status=1 GROUP BY affiliate_referrals.affiliate_id')
                                        .on('result', function(resrow) {
                                            // console.log(resrow);
                                            resrow.on('row', function(row) {
                                                    data3.push(row)
                                                })
                                                .on('error', function(err) {
                                                    console.log('Result error: ' + inspect(err));
                                                })
                                                .on('end', function(info) {
                                                    insertrevenue(data1, data3);

                                                    res.json({
                                                        Data: data1,
                                                        code: 200
                                                    });
                                                    console.log('Result finished successfully');

                                                });
                                        })




                                });
                        })




                });
        })

}


// affiliatesTraffic
exports.affiliatesTraffic = function(req, res) {

    var affiliate_id = req.body.affiliate_id;

    var data = [];


    c.query('select client.clientId,client.fname,client.lname,affiliate_referrals.ip,affiliate_referrals.affiliate_referrals_id,affiliate_referrals.affiliate_id,affiliate_referrals.status,affiliate_referrals.date_of_referral from affiliate_referrals join client on client.clientId=affiliate_referrals.affiliate_id order by affiliate_referrals_id DESC ')
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




//Modling Data According to Use 


function insertdata(data1, data2) {

    var i, j;

    var x = 0;
    for (i = 0; i < data1.length; i++) {
        x = 0;

        for (j = 0; j < data2.length; j++) {

            if (data1[i]['clientId'] == data2[j]['clientId']) {
              //  console.log(data2[j]['clientId']);
                // console.log(data2[j]);


                data1[i].total_signups = data2[j]['total_signups'];

                x = 1;

            }



        }
        if (x == 0) {
            data1[i].total_signups = 0;
        }


    }


   // console.log(data1);
    return data1;


}




function insertpurchase(data1, data2) {

    var i, j;

    var x = 0;
    for (i = 0; i < data1.length; i++) {
        x = 0;

        for (j = 0; j < data2.length; j++) {

            if (data1[i]['clientId'] == data2[j]['affiliate_id']) {
              //  console.log(data2[j]['clientId']);
                // console.log(data2[j]);


                data1[i].no_of_purchase = data2[j]['no_of_purchase'];

                x = 1;

            }



        }
        if (x == 0) {
            data1[i].no_of_purchase = 0;
        }


    }


    // console.log(data1);
    return data1;


}


function insertrevenue(data1, data2) {

    var i, j;

    var x = 0;
    for (i = 0; i < data1.length; i++) {
        x = 0;

        for (j = 0; j < data2.length; j++) {

            if (data1[i]['clientId'] == data2[j]['affiliate_id']) {
               // console.log(data2[j]['clientId']);
                // console.log(data2[j]);


                data1[i].revenue = data2[j]['revenue'];

                x = 1;

            }



        }
        if (x == 0) {
            data1[i].revenue = 0;
        }


    }


    // console.log(data1);
    return data1;


}