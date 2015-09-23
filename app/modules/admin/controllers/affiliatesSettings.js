'use strict';
var express = require('express');
var inspect = require('util').inspect;

var connect = require('../../../models/maria.js');
var affiliate = require('../models/affiliatesettings.js');

var c = new connect.maria();


exports.affiliateRequest = function (req, res) {


    var data = [];
    c.query('select affiliate.*, client.fname,client.lname from affiliate join client on client.clientId=affiliate.client_id order by affiliate_id DESC LIMIT 200')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {

                            res.json({
                                code: 200,
                                message: "Success",
                                Data: data

                            })

                            console.log('Result finished successfully');
                        });
            })

}


exports.commonsettings = function (req, res) {
    var data = req.body.data;
    var adminId = stripAlphaChars(req.body.adminId);



    var Data = new affiliate({
        settingsId: Math.floor(new Date() / 1000),
        adminId: adminId,
        date: {type: Date, default: Date.now},
        commissionType: data.ctype,
        commissionPercentage: data.percentage,
        commissionamount: data.amount,
        payoutDay: data.payoutday

    });
    Data.save(function (err, Data) {
        if (err)
            return console.error(err);
        res.json({
            code: 200,
            data: Data


        })

        console.log("saved to database");
    });




}

exports.getlatestCommonAffChange = function (req, res) {



    affiliate.findOne({
    }, {}, {sort: {settingsId: -1}}, function (err, data) {
        if (err)
            return console.error(err);
        res.json({
            Data: data,
            code: 200

        });
    })


}



exports.advancedAffChange = function (req, res) {


    var cdata = req.body.data;
    console.log(cdata);

    var data = [];
// res.send(req.body);
    c.query('update affiliate set commission_type =' + cdata.ctype + ',commission_percentage=' + cdata.percentage + ',commission_amount="' + cdata.amount + '" ,pay_out_day=' + cdata.payoutday + ',settings_changed_by_adminId=' + req.body.adminId + ',settings_change_date="' + req.body.dateTime + '" where client_id=' + req.body.client_id + '')
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


exports.currentSett = function (req, res) {

    var data = [];
    c.query('select affiliate.*, client.fname from affiliate join client on client.clientId=affiliate.client_id where affiliate.client_id="' + req.body.clientId + '"')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {

                            res.json({
                                code: 200,
                                message: "Success",
                                Data: data

                            })

                            console.log('Result finished successfully');
                        });
            })



}


exports.affiliatetraff = function (req, res) {



    var affiliate_id = req.body.clientId;

    var data = [];


    c.query('select client.fname,affiliate_referrals.ip,affiliate_referrals.affiliate_referrals_id,affiliate_referrals.affiliate_id,affiliate_referrals.status,affiliate_referrals.date_of_referral from affiliate_referrals join client on client.clientId=affiliate_referrals.affiliate_id  where affiliate_referrals.affiliate_id="' + affiliate_id + '" order by affiliate_referrals_id DESC ')
            .on('result', function (resrow) {
                // console.log(resrow);
                resrow.on('row', function (row) {
                    data.push(row)
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
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


exports.affsummery = function (req, res) {



    var data = [];
    var data1 = [];
    var data2 = [];
    var data3 = [];
    var data4 = [];
    var x = 0;
    c.query('select affiliate_referrals.affiliate_referrals_id,client.fname,client.lname ,count(*)as total_hits,client.clientId from affiliate_referrals  join client on client.clientId=affiliate_referrals.affiliate_id  where affiliate_referrals.affiliate_id ="' + req.body.clientId + '" ')
            .on('result', function (resrow) {
                // console.log(resrow);
                resrow.on('row', function (row) {
                    data1.push(row)
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {



                            c.query('select affiliate_referrals.affiliate_referrals_id,client.fname ,client.clientId,count(*)as total_signups from  affiliate_referrals  join client on client.clientId=affiliate_referrals.affiliate_id where affiliate_referrals.status=1 AND affiliate_referrals.affiliate_id="' + req.body.clientId + '"')
                                    .on('result', function (resrow) {
                                        // console.log(resrow);
                                        resrow.on('row', function (row) {
                                            data2.push(row)
                                        })
                                                .on('error', function (err) {
                                                    console.log('Result error: ' + inspect(err));
                                                })
                                                .on('end', function (info) {


                                                    insertdata(data1, data2);


                                                    c.query('select affiliate_referrals.affiliate_referrals_id,affiliate_referrals.affiliate_id,sum(transactions.amount) as revenue,transactions.clientId from affiliate_referrals  join transactions on transactions.clientId=affiliate_referrals.referred_to where affiliate_referrals.status=1 AND affiliate_referrals.affiliate_id="' + req.body.clientId + '"')
                                                            .on('result', function (resrow) {
                                                                // console.log(resrow);
                                                                resrow.on('row', function (row) {
                                                                    data3.push(row)
                                                                })
                                                                        .on('error', function (err) {
                                                                            console.log('Result error: ' + inspect(err));
                                                                        })
                                                                        .on('end', function (info) {
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





exports.freezeAccount = function (req, res) {

    var data = [];
    c.query('update affiliate set status=' + req.body.status + ' where client_id=' + req.body.clientId + '')
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


exports.deletePromocode = function (req, res) {
    var data = [];

    c.query('DELETE FROM promo_codes WHERE promocode_id="' + req.body.promocode_id + '"')
            .on('result', function (resrow) {
                // console.log(resrow);
                resrow.on('row', function (row) {
                    data.push(row)
                })
                        .on('error', function (err) {

                            res.json({
                                Data: inspect(err),
                                code: 198
                            })
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            // console.log("hi");
                            //console.log(total);

                            res.json({
                                Data: data,
                                code: 200
                            })
                            console.log('Result finished successfully');
                        });
            })



}
exports.getPromocode = function (req, res) {
    var data = [];

    c.query('select * FROM promo_codes WHERE promocode_id="' + req.body.promocode_id + '"')
            .on('result', function (resrow) {
                // console.log(resrow);
                resrow.on('row', function (row) {
                    data.push(row)
                })
                        .on('error', function (err) {

                            res.json({
                                Data: inspect(err),
                                code: 198
                            })
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            // console.log("hi");
                            //console.log(total);

                            res.json({
                                Data: data,
                                code: 200
                            })
                            console.log('Result finished successfully');
                        });
            })




}



exports.updatePromocodes = function (req, res) {
    var cdata = req.body.data;




    // console.log(cdata.type);
    var data = [];

    c.query('update promo_codes set type=' + cdata.type + ',validity_end="' + cdata.validity_end + '",validity_start="' + cdata.validity_start + '",promocode="' + cdata.promocode + '",value =' + cdata.value + ',status=' + cdata.status + ' where promocode_id=' + cdata.promocode_id + ' ')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {

                    data.push(row);
                })
                        .on('error', function (err) {

                            res.json({
                                code: 198,
                                message: inspect(err),
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


function stripAlphaChars(source) {
    var out = source.replace(/[^0-9]/g, '');

    return out;
}




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