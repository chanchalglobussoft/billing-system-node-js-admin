'use strict';
var express = require('express');
var inspect = require('util').inspect;
var affiliate = require('../../models/admin/affiliatesettings.js');
var moment = require('moment');
var connect = require('../../../app/models/maria.js');
var c = new connect.maria();

exports.listall = function (req, res) {

    var data = [];
    c.query('select * from client left join countries on client.country = countries.id_countries')
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
                            //                                res.end(JSON.stringify({
                            //                                    Data: data
                            //                                }));
                            console.log('Result finished successfully');
                        });
            })
}



// to get the details of a specific clients from the db

exports.getclient = function (req, res) {
    var getID = req.params.id;

    var data = [];
    //* from client left join countries on client.country = countries.id_countries
    c.query('SELECT * FROM client left join countries on client.country = countries.id_countries WHERE clientId = :id', {
    //c.query('SELECT * FROM client WHERE clientId = :id', {
        id: getID
    })
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
                res.end(JSON.stringify({
                    Data: data
                }));

            });


}


//to add a new client in the db
exports.addclient = function (req, res) {
    var data = req.body.data;
//    console.log(data);
//    console.log(req.body.data);
//    console.log(req.body.source);
//    console.log(req.body.date)

    console.log("----------------------------------------");
    console.log(req.body.data);
    console.log("----------------------------------------");

    c.query('INSERT INTO client ( password, fname, lname, mobile, emailId, skypeId, company,address1,address2,state, city,country,zipcode,currency,groupId,applyLateFees,sendOverdueMails,taxExempt,seperateInvoices,autoCCProcessing,securityQ,securityA,status,regDate,is_affiliate,source_name,source,paymentMethod,languages,about) VALUES (:password, :fname, :lname, :mobile, :emailId, :skypeId, :company,:address1,:address2,:state, :city, :country,:zipcode,:currency,:groupId,:applyLateFees,:sendOverdueMails,:taxExempt,:seperateInvoices,:autoCCProcessing,:securityQ,:securityA,:status,:regDate,:is_affiliate,:source_name,:source,:paymentMethod,:languages,:about)', {
        password: data.passWd,
        fname: data.fName,
        lname: data.lName,
        mobile: data.phone,
        emailId: data.eMail,
        skypeId: data.skype,
        company: data.cmpyName,
        address1: data.address1,
        address2: data.address2,
        state: data.state,
        city: data.city,
        country: data.countryID,
        zipcode: data.zip,
        currency: data.currencyID,
        groupId: "1",
        applyLateFees: data.applyLateFees,
        sendOverdueMails: data.sendOverDueMails,
        taxExempt: data.taxExempt,
        seperateInvoices: data.seprateInvoices,
        autoCCProcessing: data.ccprocessing,
        securityQ: data.secQues,
        securityA: data.secAns,
        status: data.status,
        regDate: req.body.date,
        is_affiliate: "0",
        source_name: req.body.source,
        source: "2",
        paymentMethod: data.payMethod,
        languages: data.lang,
        about: data.about

    })
            .on('result', function (result) {
                result.on('end', function (info) {

//                     console.log(info);

                    var clientInsertId = info.insertId;
                    var text = makeid() + info.insertId;



                    affiliate.findOne({
                    }, {}, {
                        sort: {
                            settingsId: -1
                        }
                    }, function (err, data) {
                        if (err)
                            return console.error(err);
                        console.log(data);
                        c.query('insert into affiliate (client_id,referred_by,affiliate_link,commission_type,commission_percentage,commission_amount,pay_out_day) VALUES(:client_id,:referred_by,:affiliate_link,:commission_type,:commission_percentage,:commission_amount,:pay_out_day)', {
                            client_id: info.insertId,
                            referred_by: 0,
                            affiliate_link: text,
                            commission_type: data.commissionType,
                            commission_percentage: data.commissionPercentage,
                            commission_amount: data.commissionamount,
                            pay_out_day: data.payoutDay
                        })
                                .on('result', function (result) {
                                    result.on('end', function (info) {

                                        console.log(info);



                                        var text = makeid() + info.insertId;




                                        res.json({
                                            clientId: clientInsertId,
                                            Data: info,
                                            code: 200
                                        });
                                        //
                                        console.log('Result finished successfully');
                                    });
                                })
                                .on('error', function (err) {
                                    // console.log("error");

                                    res.json({
                                        message: inspect(err),
                                        code: 198
                                    });

                                    console.log('Result error: ' + inspect(err));
                                })

                    })




                    //




                    //         res.json({
                    //             Data: info,
                    //             code: 200
                    //         });
                    //         //
                    //         console.log('Result finished successfully');
                });
            })
            .on('error', function (err) {
                // console.log("error");

                res.json({
                    message: inspect(err),
                    code: 198
                });

                console.log('Result error: ' + inspect(err));
            })


}

//to search a client in the db
exports.findclient = function (req, res) {

    var data = req.body.data;
    var dateSwitch = req.body.dateswitch;

   console.log(data);
//    console.log(req.body);
    var clientID = data.cID;
    var address = data.address;
    var fullname = data.cName;
    var company = data.cmpyName;
    // var currency = data.key3;
    var mobile = data.phone;
    var skypeId = data.skype;
    var emailId = data.userEmail;
    var countryID = data.countryID;

    var dateRange = data.datesrange;
    var startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
    var endDate = moment(dateRange.endDate).format("YYYY-MM-DD");

    //key3:currency,key:clientgroup,key1:status
//    var state = data.state;



    //var cardlist = req.params.cardlist; //this has been skipped for now coz not in the client table
//    var groupId = data.key;
//    var status = data.key1;

    var data = [];


    if (!clientID && !address && !fullname && !company && !mobile && !skypeId && !emailId && !dateSwitch && !countryID)
    {
        console.log("Nothing entered in the form");
        // var baseQuery = 'SELECT c.*,coun.currency_code,coun.name as country_name FROM client as c,countries as coun where c.currency = coun.id_countries and c.country = coun.id_countries';
        var baseQuery = 'select * from client left join countries on client.country = countries.id_countries';
        //select * from client left join countries on client.country = countries.id_countries
    }
    else
    {
        console.log("At least one thing has been entered");
        var baseQuery = 'select * from client left join countries on client.country = countries.id_countries WHERE ';
    }


    var operatorRequired = 0;
    var clientIDQuery = ' clientId like "%' + clientID + '%" ';
    var addressQuery = '( address1 like "%' + address + '%" || address2 like "%' + address + '%" )';
    var fullnameQuery = '( fname like "%' + fullname + '%" || lname like "%' + fullname + '%" )';
    var companyQuery = 'company like "%' + company + '%"';
    // var currencyQuery = 'countries.id_countries = "' + currency + '"';
    var countryQuery = 'countries.id_countries = "' + countryID + '"';
    var mobileQuery = 'mobile like "%' + mobile + '%"';
    var skypeIdQuery = 'skypeId like "%' + skypeId + '%"';
    var emailIdQuery = 'emailId like "%' + emailId + '%"';

    if (clientID)
    {
        baseQuery = baseQuery + clientIDQuery;
        operatorRequired = 1;
    }

    if (address)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + addressQuery;
        else
        {
            baseQuery = baseQuery + addressQuery;
            operatorRequired = 1;
        }
    }

    if (fullname)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + fullnameQuery;
        else
        {
            baseQuery = baseQuery + fullnameQuery;
            operatorRequired = 1;
        }
    }

    if (company)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + companyQuery;
        else
        {
            baseQuery = baseQuery + companyQuery;
            operatorRequired = 1;
        }
    }

    // if (currency)
    // {
    //     if (operatorRequired == 1)
    //         baseQuery = baseQuery + ' and ' + currencyQuery;
    //     else
    //     {
    //         baseQuery = baseQuery + currencyQuery;
    //         operatorRequired = 1;
    //     }
    // }

    if (countryID)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + countryQuery;
        else
        {
            baseQuery = baseQuery + countryQuery;
            operatorRequired = 1;
        }
    }

    if (mobile)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + mobileQuery;
        else
        {
            baseQuery = baseQuery + mobileQuery;
            operatorRequired = 1;
        }
    }

    if (skypeId)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + skypeIdQuery;
        else
        {
            baseQuery = baseQuery + skypeIdQuery;
            operatorRequired = 1;
        }
    }

    if (emailId)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and ' + emailIdQuery;
        else
        {
            baseQuery = baseQuery + emailIdQuery;
            operatorRequired = 1;
        }
    }

    if (dateSwitch)
    {
        if (operatorRequired == 1)
            baseQuery = baseQuery + ' and regDate between CAST("' + startDate + '" AS DATE) and CAST("' + endDate + '" AS DATE)';
        else
        {
            baseQuery = baseQuery + ' regDate between CAST("' + startDate + '" AS DATE) and CAST("' + endDate + '" AS DATE)';
            operatorRequired = 1;
        }

    }

//    var gatewayQuery = 'transactions.paymentMethod = "' + gateway + '"';
//    var baseQuery = 'SELECT * FROM client WHERE fname like "%' + fullname + '%" || lname like "%' + fullname + '%"|| mobile="' + mobile + '"||address1 like "%' + address + '%" || address2 like "%' + address + '%"|| company like "%' + company + '%"||skypeId like "%' + skypeId + '%"||emailId like "' + emailId + '"||currency like "%' + currency + '%" ';
    //c.query('SELECT * FROM client WHERE fname like "%' + fullname + '%"')
    console.log("-----------------------");
    console.log("Base Query: " + baseQuery);
    console.log("-----------------------");

//    c.query('SELECT * FROM client WHERE fname like "%' + fullname + '%" || lname like "%' + fullname + '%"|| mobile="' + mobile + '"||address1 like "%' + address + '%" || address2 like "%' + address + '%"|| company like "%' + company + '%"||skypeId like "%' + skypeId + '%"||emailId like "' + emailId + '"||currency like "%' + currency + '%" ')
    c.query(baseQuery)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            //         console.log('Result error: ' + inspect(err));
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

exports.finddomain = function (req, res) {
    var data = req.body.data;
    console.log(data);
    var domainName = data.domain;
    var registrar = data.registrar;
    var status = data.status;
    var clientName = data.cName;
    // var splitName = clientName.split(" "); split is trowing error

    var data = [];

    c.query('SELECT domainId,domainName, client.fname, client.lname, regPeriod, price, dueDate, registrar,expiryDate FROM domain INNER JOIN client on client.clientId = domain.clientId WHERE ( domain.domainName like "%' + domainName + '%" || domain.registrar like "%' + registrar + '%" ||  domain.status like "%' + status + '%" )')
            // c.query('SELECT * FROM domain INNER JOIN client on client.clientId = domain.clientId WHERE ( client.fname IN ("client1", "client2") )')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            //        console.log('Result error: ' + inspect(err));
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

exports.getcancellations = function (req, res) {

    var data = [];
    c.query('SELECT cancellation.cancellationId,cancellation.clientId,client.fname,client.lname,cancellation.date,cancellation.productName,cancellation.reason,cancellation.type,cancellation.requestStatus, cancellation.repliedByAdminId,cancellation.lastModifiedOn FROM cancellation join client on client.clientId=cancellation.clientId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            //         console.log('Result error: ' + inspect(err));
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

exports.getPendingCancellations = function (req, res) {

    var data = [];
    c.query('SELECT cancellation.cancellationId,cancellation.clientId,client.fname,client.lname,cancellation.date,cancellation.productName,cancellation.reason,cancellation.type,cancellation.requestStatus, cancellation.repliedByAdminId,cancellation.lastModifiedOn FROM cancellation join client on client.clientId=cancellation.clientId where cancellation.requestStatus = 0')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {

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

exports.getAcceptedCancellations = function (req, res) {

    var data = [];
    c.query('SELECT cancellation.cancellationId,cancellation.clientId,client.fname,client.lname,cancellation.date,cancellation.productName,cancellation.reason,cancellation.type,cancellation.requestStatus, cancellation.repliedByAdminId,cancellation.lastModifiedOn FROM cancellation join client on client.clientId=cancellation.clientId where cancellation.requestStatus = 1')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            //         console.log('Result error: ' + inspect(err));
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


exports.updatecancellations = function (req, res) {
    var data = req.body;
    var cancellationId = data.cancellationId;
    var action = data.action;
    var adminId = data.adminId;
    var data = [];

    if (action == 1)
    {
        var basequery = 'UPDATE cancellation SET requestStatus= 1, repliedByAdminId = "' + adminId + '" WHERE cancellationId="' + cancellationId + '"';
    }
    else if (action == 2)
    {
        var basequery = 'UPDATE cancellation SET requestStatus= 2, repliedByAdminId = "' + adminId + '" WHERE cancellationId="' + cancellationId + '"';
    }
    else if (action == 3)
    {
        var basequery = 'DELETE from cancellation WHERE cancellationId="' + cancellationId + '"';
    }

    c.query(basequery)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            //         console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            res.json({
                                code: 200
                            });
                            console.log('Updated cancellation table successfully');
                        });
            })



}


//update client info by admin during domain registration

exports.updateClientInfo = function (req, res) {
     var dataInput = req.body.data;
     console.log(dataInput);
     var clientID = req.body.clientID;
     console.log(clientID);
     
     var fname = dataInput.RegistrantFirstName;
     var lname = dataInput.RegistrantLastName;
     var company = dataInput.RegistrantOrganizationName;
     var address1 = dataInput.RegistrantAddress1;
     var city = dataInput.RegistrantCity;
     var state = dataInput.RegistrantStateProvince;
     var zip = dataInput.RegistrantPostalCode;
     var country = dataInput.RegistrantCountry;
     var emailId = dataInput.RegistrantEmailAddress;
     var phone = dataInput.RegistrantPhone;
     var mobile = phone.split(".")[1]; 
//     console.log("Split"+mobile);
     
     if(company)
     {
         var updateQuery = 'UPDATE client SET fname= "'+fname+'", lname = "' + lname + '", company = "' + company + '", address1 = "' + address1 + '", city = "' + city + '", state = "' + state + '", zipcode = "' + zip + '", country = "' + country + '", emailId = "' + emailId + '", mobile = "' + mobile + '" WHERE clientId="' + clientID + '"';
     }else
     {
         var updateQuery = 'UPDATE client SET fname= "'+fname+'", lname = "' + lname + '", address1 = "' + address1 + '", city = "' + city + '", state = "' + state + '", zipcode = "' + zip + '", country = "' + country + '", emailId = "' + emailId + '", mobile = "' + mobile + '" WHERE clientId="' + clientID + '"';
     }
     console.log(updateQuery);
     
          var data = [];
         c.query(updateQuery)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            //         console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            res.json({
                                code: 200
                            });
                            console.log('Updated Client Info successfully');
                        });
            })
     
//     res.end("done");

//    var data = [];
//    c.query('select * from client left join countries on client.country = countries.id_countries')
//            .on('result', function (resrow) {
//                resrow.on('row', function (row) {
//                    data.push(row);
//                })
//                        .on('error', function (err) {
//                            console.log('Result error: ' + inspect(err));
//                        })
//                        .on('end', function (info) {
//
//                            res.json({
//                                code: 200,
//                                message: "Success",
//                                Data: data
//
//                            })
//                            //                                res.end(JSON.stringify({
//                            //                                    Data: data
//                            //                                }));
//                            console.log('Result finished successfully');
//                        });
//            })
}


//generating random characters for javavscript


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
