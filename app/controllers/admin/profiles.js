'use strict';
var express = require('express');
var async = require('async');
var inspect = require('util').inspect;



var connect=require('../../../app/models/maria.js');




function getDaysInMonth(m, year) {
    var month = m - 1; //month starts from 0
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        var trimDate = new Date(date);
        var stringDate = trimDate.toString();
        var splitDate = stringDate.split(" ");
        var formatttedDate = splitDate[0] + " " + splitDate[2] + "/" + m + "/" + year;
        days.push(formatttedDate);
        date.setDate(date.getDate() + 1);
    }
    return days;
}
//Eg: getDaysInMonth(6,2015)
//[ 'Mon 01/6/2015',...
//  'Tue 30/6/2015' ]
//--------------------------------------------------------------------------------------------
function getOnlyDaysInMonth(m, year) {
    var month = m - 1; //month starts from 0
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        var trimDate = new Date(date);
        var stringDate = trimDate.toString();
        var splitDate = stringDate.split(" ");
        var formatttedDate = year + "/" + m + "/" + splitDate[2];
        days.push(formatttedDate);
        date.setDate(date.getDate() + 1);
    }
    return days;
}
//Eg: getOnlyDaysInMonth(7,2015)
//[ '2015/7/01', ...
//  '2015/7/31' ]
//--------------------------------------------------------------------------------------------
function getOnlyDayNameInMonth(m, year) {
    var month = m - 1; //month starts from 0
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        var trimDate = new Date(date);
        var stringDate = trimDate.toString();
        var splitDate = stringDate.split(" ");
        var formatttedDate = splitDate[0];
        days.push(formatttedDate);
        date.setDate(date.getDate() + 1);
    }
    return days;
}

exports.clients=function(req, res) {
        //        var data = [];
        //        c.query('SELECT status, COUNT(*)  as count FROM transactions GROUP BY status')
        //                .on('result', function (resrow) {
        //                    resrow.on('row', function (row) {
        //                        data.push(row);
        //                    })
        //                            .on('error', function (err) {
        //                                console.log('Result error: ' + inspect(err));
        //                            })
        //                            .on('end', function (info) {
        //
        //                                res.json({
        //                                    code: 200,
        //                                    message: "Success",
        //                                    Data: data
        //
        //                                })
        //                                console.log('Result finished successfully');
        //                            });
        //                });
    }


    exports.allstaff=function(req, res) {
            var data = [];
            c.query('SELECT * FROM staff')
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

        exports.staffbyId=function(req, res) {
            var staffId = req.params.id;
            var data = [];
            c.query('SELECT * FROM staff where staffId = ' + staffId + '')
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



        exports.addStaff= function(req, res) {
                var data = req.body; //only for testing

                //replace the above code with the below in production
                //var data = req.body.data;

                c.query('INSERT INTO staff ( role, fname, lname, emailId, username, password, assignedDepartments, enableTicketNotifications, supportTicketSignature, privateNotes, templateId, language, isActivated) VALUES (:role, :fname, :lname, :emailId, :username, :password, :assignedDepartments, :enableTicketNotifications, :supportTicketSignature, :privateNotes, :templateId, :language, :isActivated)', {
                        role: data.role,
                        fname: data.fname,
                        lname: data.lname,
                        emailId: data.emailId,
                        username: data.username,
                        password: data.password,
                        assignedDepartments: data.assignedDepartments,
                        enableTicketNotifications: data.enableTicketNotifications,
                        supportTicketSignature: data.supportTicketSignature,
                        privateNotes: data.privateNotes,
                        templateId: data.templateId,
                        language: data.language,
                        isActivated: data.isActivated
                    })
                    .on('result', function(result) {
                        result.on('end', function(info) {
                            res.json({
                                Data: info,
                                code: 200
                            });
                            console.log('Result finished successfully');
                        });
                    })
                    .on('error', function(err) {
                        res.json({
                            message: "Didn't get data",
                            code: 198
                        });
                        console.log('Result error while adding a staff: ' + inspect(err));
                    })
            }


          exports.reportsbymonth=function(req, res) {
                    var monthId = parseInt(req.params.monthId);
                    var yearId = parseInt(req.params.yearId);
                    var onlyDates = getOnlyDaysInMonth(monthId, yearId);
                    var dayNames = getOnlyDayNameInMonth(monthId, yearId);
                    var CompletedOrdersCount;
                    var NewInvoicesCount;
                    var PaidInvoicesCount;
                    var OpenedTicketsCount;
                    var TicketRepliesCount;
                    var OpenedTicketsCount;
                    var CancellationRequestsCount;
                    var fullJSON = [];
                    var dayCounter = 0;

                    async.each(onlyDates,
                        function(item, callback) {
                            var dateloop = item;
                            //----------------------------------------------------------------------------------------------------------------------------------//
                            var CompletedOrders = 'SELECT count(*) as count FROM orders WHERE orderStatus = 5 AND DATE(date) = "' + dateloop + '" ';
                            c.query(CompletedOrders)
                                .on('result', function(resrow) {
                                    resrow.on('row', function(row) {
                                            CompletedOrdersCount = row;
                                        })
                                        .on('error', function(err) {
                                            res.json({
                                                code: 198
                                            });
                                            console.log('Result error in CompletedOrdersCount: ' + inspect(err));
                                        })
                                        .on('end', function() {
                                            console.log('Calculated CompletedOrdersCount' + dateloop);
                                        });
                                })
                                //----------------------------------------------------------------------------------------------------------------------------------//
                            var NewInvoices = 'SELECT count(*) as count FROM invoices WHERE DATE(date) = "' + dateloop + '" ';
                            c.query(NewInvoices)
                                .on('result', function(resrow) {
                                    resrow.on('row', function(row) {
                                            NewInvoicesCount = row;
                                        })
                                        .on('error', function(err) {
                                            res.json({
                                                code: 198
                                            });
                                            console.log('Result error in NewInvoicesCount: ' + inspect(err));
                                        })
                                        .on('end', function() {
                                            console.log('Calculated NewInvoicesCount');
                                        });
                                })
                                //----------------------------------------------------------------------------------------------------------------------------------//
                            var PaidInvoices = 'SELECT count(*) as count FROM invoices WHERE DATE(datePaid) = "' + dateloop + '" ';
                            c.query(PaidInvoices)
                                .on('result', function(resrow) {
                                    resrow.on('row', function(row) {
                                            PaidInvoicesCount = row;
                                        })
                                        .on('error', function(err) {
                                            res.json({
                                                code: 198
                                            });
                                            console.log('Result error in PaidInvoicesCount: ' + inspect(err));
                                        })
                                        .on('end', function() {
                                            console.log('Calculated PaidInvoicesCount');
                                        });
                                })
                                //----------------------------------------------------------------------------------------------------------------------------------//
                                //  OpenedTicketsCount
                            var OpenedTickets = 'SELECT count(*) as count FROM tickets WHERE status = 3 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';

                            c.query(OpenedTickets)
                                .on('result', function(resrow) {
                                    resrow.on('row', function(row) {
                                            OpenedTicketsCount = row;
                                        })
                                        .on('error', function(err) {
                                            res.json({
                                                code: 198
                                            });
                                            console.log('Result error in OpenedTicketsCount: ' + inspect(err));
                                        })
                                        .on('end', function() {
                                            console.log('Calculated OpenedTicketsCount');
                                        });
                                })
                                //----------------------------------------------------------------------------------------------------------------------------------//
                                // TicketRepliesCount
                            var TicketReplies = 'SELECT count(*) as count FROM tickets WHERE DATE(firstReplyDate) = "' + dateloop + '" ';

                            c.query(TicketReplies)
                                .on('result', function(resrow) {
                                    resrow.on('row', function(row) {
                                            TicketRepliesCount = row;
                                        })
                                        .on('error', function(err) {
                                            res.json({
                                                code: 198
                                            });
                                            console.log('Result error in TicketRepliesCount: ' + inspect(err));
                                        })
                                        .on('end', function() {
                                            console.log('Calculated TicketRepliesCount');
                                        });
                                })
                                //----------------------------------------------------------------------------------------------------------------------------------//
                                //CancellationRequestsCount
                            var CancellationRequests = 'SELECT count(*) as count FROM cancellation WHERE DATE(date) = "' + dateloop + '" ';

                            c.query(CancellationRequests)
                                .on('result', function(resrow) {
                                    resrow.on('row', function(row) {
                                            CancellationRequestsCount = row;
                                        })
                                        .on('error', function(err) {
                                            res.json({
                                                code: 198
                                            });
                                            console.log('Result error in CancellationRequestsCount: ' + inspect(err));
                                        })
                                        .on('end', function() {
                                            console.log('Calculated CancellationRequestsCount');
                                        });
                                })
                                //----------------------------------------------------------------------------------------------------------------------------------//
                                .on('end', function() {
                                    fullJSON.push(({
                                        Reports: {
                                            Date: dateloop,
                                            Day: dayNames[dayCounter],
                                            CompletedOrders: CompletedOrdersCount,
                                            NewInvoices: NewInvoicesCount,
                                            PaidInvoices: PaidInvoicesCount,
                                            OpenedTickets: OpenedTicketsCount,
                                            TicketReplies: TicketRepliesCount,
                                            CancellationRequests: CancellationRequestsCount
                                        }
                                    }));
                                    dayCounter++;
                                    console.log('Done with all results');
                                    callback();
                                });
                            //----------------------------------------------------------------------------------------------------------------------------------//
                        },
                        function() {
                            res.json({
                                Data: fullJSON,
                                code: 200
                            });
                        }
                    );
                }
