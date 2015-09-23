'use strict';
var express = require('express');
var async = require('async');
var util = require('util');
var DatesHelper = require('./cutomDateFunctions.js');

var connect = require('../../../models/maria.js');

var c = new connect.maria();

exports.clientsReport = function (req, res) {

    var data = [];

    c.query(' select distinct client.clientId,client.fname,client.lname,client.status,client.groupId, transactions.amount  from client left join transactions on client.clientId=transactions.clientId ORDER BY status')
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
                                message: "sucess",
                                Data: data
                            })
                        });
            });
}


exports.transactionHistory = function (req, res) {

    var data = [];
    c.query('select * from transactions where clientId="' + req.body.clientId + '"')
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
                                message: "sucess",
                                Data: data

                            })

                        });
            });
}

exports.clientsReg = function (req, res) {

    var data = [];


    c.query('SELECT distinct client.clientId,client.fname,client.lname,client.groupId,client.regDate as reg_date,status, (select count(*) as count from orders where clientId=client.clientId) as no_of_orders_placed FROM client    where client.regDate like "%' + req.body.data + '%"')
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
                                message: "sucess",
                                Data: data

                            })

                        });
            });
}


exports.clientsSource = function (req, res) {

    var data = [];


    c.query('select client.clientId,client.fname,client.lname,client.source_name,client.source,client.status from client order by source')
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
                                message: "sucess",
                                Data: data

                            })

                        });
            });
}


exports.clientsStatement = function (req, res) {

    var data = [];


    c.query('select   wallet_activity.clientId,wallet_activity.description,wallet_activity.date,wallet_activity.date,wallet_activity.amount,wallet_activity.type,client_wallet.current_balance  from wallet_activity join client_wallet on client_wallet.clientId=wallet_activity.clientId where wallet_activity.clientId="' + req.body.clientId + '" AND date <"' + req.body.start_date + '" AND date>"' + req.body.end_date + '"')
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
                                message: "sucess",
                                Data: data

                            })

                        });
            });
}

exports.clientsStatementall = function (req, res) {

    var data = [];


    c.query('select   wallet_activity.clientId,wallet_activity.description,wallet_activity.date,wallet_activity.date,wallet_activity.amount,wallet_activity.type,client_wallet.current_balance  from wallet_activity join client_wallet on client_wallet.clientId=wallet_activity.clientId where wallet_activity.clientId="' + req.body.clientId + '"')
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
                                message: "sucess",
                                Data: data

                            })

                        });
            });
}

exports.clientsIncome = function (req, res) {

    var data = [];


    c.query('select client.clientId,client.fname,client.lname,client.emailId,client.mobile as phone_no,(SELECT   SUM(amount)FROM  transactions where transactions.paymentType=0 AND transactions.status=1 AND transactions.clientId=client.clientId ) as total from client order by total desc')
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
                                message: "sucess",
                                Data: data

                            })

                        });
            });
}

exports.clientsCountry = function (req, res) {
    var data = [];
    c.query('select country, count(*) as no_of_users from client group by country')
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
                                message: "sucess",
                                Data: data
                            })
                        });
            });
}

// Adding Support section's Report APIs by Syed Arshad 9/7/2015

//1. Response Time Per Tech API

//count total ticket and departements
exports.calculateRTPT = function (req, res) {
    var deptIds = []; //get all the unique departmentId in this array first
    var totalTicketCount;

    //get all the deptIds
    c.query('select distinct(departmentId) from tickets order by departmentId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    deptIds.push(row.departmentId);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            });

    //Array of objects
    var ticketsPerDept = [];
    c.query('select departmentId, count(*) as ticketCount,AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as avgRespTime from tickets group by departmentId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    ticketsPerDept.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            });

    c.query('select count(*) as totalcount from tickets')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    totalTicketCount = row.totalcount;
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function () {
                            console.log("Got this" + JSON.stringify(ticketsPerDept));
                            res.json({
                                code: 200,
                                message: "Success",
                                Data: deptIds,
                                count: totalTicketCount,
                                deptCount: deptIds.length,
                                ticketsPerDept: ticketsPerDept
                            })
                        });
            });
}

//2. Average Response Time calculation

exports.calculateART = function (req, res) {
    var adminIds = []; //get all the unique departmentId in this array first
    var totalTicketCount;

    //get all the adminIds
    c.query('select distinct(assignedTo) from tickets order by assignedTo')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    adminIds.push(row.assignedTo);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            });

    var ticketsPerAdmin = [];
    c.query('select assignedTo as adminId, a.fname, a.lname, departmentId, count(*) as ticketCount,AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,lastReplyDate)) as avgRespTime from tickets t, admin a where t.assignedTo = a.adminId group by assignedTo order by assignedTo')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    ticketsPerAdmin.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            });

    c.query('select count(*) as totalcount from tickets')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    totalTicketCount = row.totalcount;
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function () {
//                       console.log("Got this ticketsPerAdmin"+ JSON.stringify(ticketsPerAdmin));
                            res.json({
                                code: 200,
                                message: "Success",
                                Data: adminIds,
                                count: totalTicketCount,
                                adminCount: adminIds.length,
                                ticketsPerAdmin: ticketsPerAdmin
                            })
                        });
            });
}


//3. Average Response Time calculation

exports.calculateAFRT = function (req, res) {
    var adminIds = []; //get all the unique departmentId in this array first
    var totalTicketCount;

    //get all the adminIds
    c.query('select distinct(assignedTo) from tickets order by assignedTo')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    adminIds.push(row.assignedTo);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            });

    var ticketsPerAdmin = [];
    c.query('select assignedTo as adminId, a.fname, a.lname, departmentId, count(*) as ticketCount,AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as avgFirstRespTime from tickets t, admin a where t.assignedTo = a.adminId group by assignedTo order by assignedTo')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    ticketsPerAdmin.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            });

    c.query('select count(*) as totalcount from tickets')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    totalTicketCount = row.totalcount;
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function () {
                            res.json({
                                code: 200,
                                message: "Success",
                                Data: adminIds,
                                count: totalTicketCount,
                                adminCount: adminIds.length,
                                ticketsPerAdmin: ticketsPerAdmin
                            })
                        });
            });
}

//  4. Average Daily Tickets

exports.calculateADT = function (req, res) {
//    0:Awaiting Reply, 1:Flagged Ticket, 2:Active Ticket, 3:Open, 4:Answered, 5:Customer-Reply, 6:On Hold, 7:In Progress, 8:Closed
    var monthId = req.body.monthId;
    var yearId = req.body.yearId;
       
    var onlyDates = DatesHelper.getOnlyDaysInMonth(monthId, yearId);
    var dayNames = DatesHelper.getOnlyDayNameInMonth(monthId, yearId);

    var OpenedTicketsCount;
    var AwaitingReplyCount;
    var FlaggedTicketCount;
    var ActiveTicketCount;
    var AnsweredTicketCount;
    var CustomerReplyCount;
    var OnHoldTicketCount;
    var InProgressCount;
    var ClosedTicketCount;

    var fullJSON = [];
    var dayCounter = 0;

    var totalTicketCount; // total number of counts
    var ticketsThisMonth;
    var deptIds = [];
    var adminIds = []; //get all the unique departmentId in this array first      
    var ticketsPerAdmin = [];


    async.each(onlyDates,
            function (item, callback) {
                var dateloop = item;

                //  OpenedTicketsCount
                var OpenedTickets = 'SELECT count(*) as count FROM tickets WHERE status = 3 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';

                c.query(OpenedTickets)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                OpenedTicketsCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in OpenedTicketsCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated OpenedTicketsCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//
                // AwaitingReplyCount
                var AwaitingReply = 'SELECT count(*) as count FROM tickets WHERE status = 3 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(AwaitingReply)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                AwaitingReplyCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in AwaitingReplyCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated AwaitingReplyCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // FlaggedTicket
                var FlaggedTicket = 'SELECT count(*) as count FROM tickets WHERE status = 1 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(FlaggedTicket)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                FlaggedTicketCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in FlaggedTicketCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated FlaggedTicketCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // ActiveTicketCount
                var ActiveTicket = 'SELECT count(*) as count FROM tickets WHERE status = 2 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(ActiveTicket)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                ActiveTicketCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in ActiveTicketCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated ActiveTicketCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // AnsweredTicketCount
                var AnsweredTicket = 'SELECT count(*) as count FROM tickets WHERE status = 4 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(AnsweredTicket)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                AnsweredTicketCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in AnsweredTicketCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated AnsweredTicketCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // CustomerReplyCount
                var CustomerReply = 'SELECT count(*) as count FROM tickets WHERE status = 5 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(CustomerReply)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                CustomerReplyCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in CustomerReplyCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated CustomerReplyCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // OnHoldTicketCount
                var OnHoldTicket = 'SELECT count(*) as count FROM tickets WHERE status = 6 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(OnHoldTicket)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                OnHoldTicketCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in OnHoldTicketCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated OnHoldTicketCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // InProgressCount
                var InProgress = 'SELECT count(*) as count FROM tickets WHERE status = 7 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(InProgress)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                InProgressCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in InProgressCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated InProgressCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//
                // ClosedTicketCount
                var ClosedTicket = 'SELECT count(*) as count FROM tickets WHERE status = 8 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(ClosedTicket)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                ClosedTicketCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in ClosedTicketCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated ClosedTicketCount');
                                    });
                        })
                        //----------------------------------------------------------------------------------------------------------------------------------//
                        .on('end', function () {
                            fullJSON.push(({
                                Reports: {
                                    Date: dateloop,
                                    Day: dayNames[dayCounter],
                                    OpenedTickets: OpenedTicketsCount,
                                    AwaitingReply: AwaitingReplyCount,
                                    FlaggedTicket: FlaggedTicketCount,
                                    ActiveTicket: ActiveTicketCount,
                                    AnsweredTicket: AnsweredTicketCount,
                                    CustomerReply: CustomerReplyCount,
                                    OnHoldTicket: OnHoldTicketCount,
                                    InProgress: InProgressCount,
                                    ClosedTicket: ClosedTicketCount
                                }
                            }));
                            dayCounter++;
                            //console.log('Done with all results');
                            callback();
                        });
                //----------------------------------------------------------------------------------------------------------------------------------//
            },
            function () {
                console.log("callback: Done all the tests" + fullJSON.length);
//                            res.json({
//                                Data: fullJSON,
//                                code: 200
//                            });
            }
    );

    //get all the deptIds
    c.query('select distinct(departmentId) from tickets order by departmentId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    deptIds.push(row.departmentId);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            })


    //get all the adminIds
    c.query('select distinct(assignedTo) from tickets order by assignedTo')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    adminIds.push(row.assignedTo);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            })


    c.query('select assignedTo as adminId, a.fname, a.lname, departmentId, count(*) as ticketCount,AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as avgFirstRespTime from tickets t, admin a where t.assignedTo = a.adminId group by assignedTo order by assignedTo')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    ticketsPerAdmin.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            })


    c.query('select count(*) as ticketCount from tickets where month(ticketGeneratedDate) = ' + monthId)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    ticketsThisMonth = row.ticketCount;
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            })


    c.query('select count(*) as totalcount from tickets')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    totalTicketCount = row.totalcount;
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function () {
                            res.json({
                                code: 200,
                                message: "Success",
                                count: totalTicketCount,
                                monthlyTicket: ticketsThisMonth,
                                deptCount: deptIds.length,
                                adminCount: adminIds.length,
                                ticketsPerAdmin: ticketsPerAdmin,
                                monthReport: fullJSON,
                                daysInMonth:fullJSON.length
                            })
                        });
            });
    //          


}

//5. Calculate Daily Ticket Replies 

exports.calculateDTR = function (req, res) {
//    0:Awaiting Reply, 1:Flagged Ticket, 2:Active Ticket, 3:Open, 4:Answered, 5:Customer-Reply, 6:On Hold, 7:In Progress, 8:Closed
    var monthId = req.body.monthId;
    var yearId = req.body.yearId;
       
    var onlyDates = DatesHelper.getOnlyDaysInMonth(monthId, yearId);
    var dayNames = DatesHelper.getOnlyDayNameInMonth(monthId, yearId);

    var OpenedTicketsCount;
    var AwaitingReplyCount;
    var FlaggedTicketCount;
    var ActiveTicketCount;
    var AnsweredTicketCount;
    var CustomerReplyCount;
    var OnHoldTicketCount;
    var InProgressCount;
    var ClosedTicketCount;

    var fullJSON = [];
    var dayCounter = 0;

    var totalTicketCount; // total number of counts
    var ticketsThisMonth;
    var ticketsRepliedThisMonth;
    var deptIds = [];
    var adminIds = []; //get all the unique departmentId in this array first      
    var ticketsPerAdmin = [];


    async.each(onlyDates,
            function (item, callback) {
                var dateloop = item;

                //  OpenedTicketsCount
                var OpenedTickets = 'SELECT count(*) as count FROM tickets WHERE status = 3 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';

                c.query(OpenedTickets)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                OpenedTicketsCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in OpenedTicketsCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated OpenedTicketsCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//
                // AwaitingReplyCount
                var AwaitingReply = 'SELECT count(*) as count FROM tickets WHERE status = 3 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(AwaitingReply)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                AwaitingReplyCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in AwaitingReplyCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated AwaitingReplyCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // FlaggedTicket
                var FlaggedTicket = 'SELECT count(*) as count FROM tickets WHERE status = 1 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(FlaggedTicket)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                FlaggedTicketCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in FlaggedTicketCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated FlaggedTicketCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // ActiveTicketCount
                var ActiveTicket = 'SELECT count(*) as count FROM tickets WHERE status = 2 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(ActiveTicket)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                ActiveTicketCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in ActiveTicketCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated ActiveTicketCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // AnsweredTicketCount
                var AnsweredTicket = 'SELECT count(*) as count FROM tickets WHERE status = 4 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(AnsweredTicket)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                AnsweredTicketCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in AnsweredTicketCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated AnsweredTicketCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // CustomerReplyCount
                var CustomerReply = 'SELECT count(*) as count FROM tickets WHERE status = 5 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(CustomerReply)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                CustomerReplyCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in CustomerReplyCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated CustomerReplyCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // OnHoldTicketCount
                var OnHoldTicket = 'SELECT count(*) as count FROM tickets WHERE status = 6 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(OnHoldTicket)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                OnHoldTicketCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in OnHoldTicketCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated OnHoldTicketCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//

                //----------------------------------------------------------------------------------------------------------------------------------//
                // InProgressCount
                var InProgress = 'SELECT count(*) as count FROM tickets WHERE status = 7 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(InProgress)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                InProgressCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in InProgressCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated InProgressCount');
                                    });
                        })
                //----------------------------------------------------------------------------------------------------------------------------------//
                // ClosedTicketCount
                var ClosedTicket = 'SELECT count(*) as count FROM tickets WHERE status = 8 AND DATE(ticketGeneratedDate) = "' + dateloop + '" ';
                c.query(ClosedTicket)
                        .on('result', function (resrow) {
                            resrow.on('row', function (row) {
                                ClosedTicketCount = row;
                            })
                                    .on('error', function (err) {
                                        res.json({
                                            code: 198
                                        });
                                        console.log('Result error in ClosedTicketCount: ' + inspect(err));
                                    })
                                    .on('end', function () {
                                        console.log('Calculated ClosedTicketCount');
                                    });
                        })
                        //----------------------------------------------------------------------------------------------------------------------------------//
                        .on('end', function () {
                            fullJSON.push(({
                                Reports: {
                                    Date: dateloop,
                                    Day: dayNames[dayCounter],
                                    OpenedTickets: OpenedTicketsCount,
                                    AwaitingReply: AwaitingReplyCount,
                                    FlaggedTicket: FlaggedTicketCount,
                                    ActiveTicket: ActiveTicketCount,
                                    AnsweredTicket: AnsweredTicketCount,
                                    CustomerReply: CustomerReplyCount,
                                    OnHoldTicket: OnHoldTicketCount,
                                    InProgress: InProgressCount,
                                    ClosedTicket: ClosedTicketCount
                                }
                            }));
                            dayCounter++;
                            //console.log('Done with all results');
                            callback();
                        });
                //----------------------------------------------------------------------------------------------------------------------------------//
            },
            function () {
                console.log("callback: Done all the tests" + fullJSON.length);
//                            res.json({
//                                Data: fullJSON,
//                                code: 200
//                            });
            }
    );

    //get all the deptIds
    c.query('select distinct(departmentId) from tickets order by departmentId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    deptIds.push(row.departmentId);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            })


    //get all the adminIds
    c.query('select distinct(assignedTo) from tickets order by assignedTo')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    adminIds.push(row.assignedTo);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            })


    c.query('select assignedTo as adminId, a.fname, a.lname, departmentId, count(*) as ticketCount,AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as avgFirstRespTime from tickets t, admin a where t.assignedTo = a.adminId group by assignedTo order by assignedTo')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    ticketsPerAdmin.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            })


    c.query('select count(*) as ticketCount from tickets where month(ticketGeneratedDate) = ' + monthId)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    ticketsThisMonth = row.ticketCount;
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            })

    c.query('select count(*) as ticketCount from tickets where month(firstReplyDate) = ' + monthId)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    ticketsRepliedThisMonth = row.ticketCount;
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
            })


    c.query('select count(*) as totalcount from tickets')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    totalTicketCount = row.totalcount;
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function () {
                            res.json({
                                code: 200,
                                message: "Success",
                                count: totalTicketCount,
                                monthlyTicket: ticketsThisMonth,
                                deptCount: deptIds.length,
                                adminCount: adminIds.length,
                                ticketsPerAdmin: ticketsPerAdmin,
                                monthReport: fullJSON,
                                daysInMonth:fullJSON.length,
                                ticketsRepliedThisMonth:ticketsRepliedThisMonth
                            })
                        });
            });
    //          


}
