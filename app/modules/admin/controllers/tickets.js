'use strict';
var express = require('express');
var inspect = require('util').inspect;
var moment = require('moment');
var Logger = require('../models/logger.js');
var connect = require('../../../models/maria.js');
//var multer  = require('multer'); //Multer will take care of the file handling and HTML for handling form input.
var c = new connect.maria();
var mongoose = require('mongoose');
var TicketReply = require('../models/ticketreply.js');
//The disk storage engine gives full control on storing files to disk.
//billing-system-node-js\trunk\public\assets\uploads\ticket-attachements
//var storage = multer.diskStorage({
//  destination: function (req, file, cb) {
//    cb(null, '/uploads/ticket-attachements')
//  },
//  filename: function (req, file, cb) {
//    cb(null, file.fieldname + '-' + Date.now())
//  }
//})

//var upload = multer({ storage: storage })

//var upload = multer({ dest: './uploads/ticket-attachements' });


exports.globalsearch = function (req, res) {
//    console.log("hello");
    var request = req.body.data;
//    console.log(request);

    var data = [];
    var temp = [];
    var temp1 = [];
    var temp2 = [];
    var temp3 = [];

    c.query('select client.fname,client.lname,client.clientId from client where fname LIKE "%' + request + '%"|| lname LIKE "%' + request + '%" || mobile LIKE"%' + request + '%"|| emailId LIKE"%' + request + '%"|| skypeId LIKE"%' + request + '%"|| fbId LIKE"%' + request + '%"')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    temp.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {

                            data.push({
                                client: temp
                            });
                            console.log('Result finished successfully');
                        });


            });


    c.query('select * from domain where domainName LIKE "%' + request + '%"')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    temp1.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {

                            data.push({
                                domain: temp1
                            });

                            console.log('Result finished successfully');
                        });


            });
    c.query('select orderId from orders where orderId like "%' + request + '%"')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    temp2.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {

                            data.push({
                                order: temp2
                            });

                            console.log('Result finished successfully');
                        });


            });


    c.query('select invoices.invoiceId from invoices where  invoiceId LIKE "%' + request + '%"')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    temp3.push(row);
                })
                        .on('error', function (err) {
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {


                            data.push({
                                invoice: temp3
                            });




                            res.json({
                                Data: data,
                                code: 200
                            });
                            console.log('Result finished successfully');
                        });
            })

}




exports.mytickets = function (req, res) {
    var adminId = req.params.adminId;
    var data = [];

    c.query('SELECT tickets.*,client.clientId, client.fname,client.lname FROM tickets,client WHERE tickets.assignedTo = "' + adminId + '" and tickets.submitter = client.clientId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
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

//0:Awaiting Reply, 1:Flagged Ticket, 2:Active Ticket, 3:Open, 4:Answered, 5:Customer-Reply, 6:On Hold, 7:In Progress, 8:Closed
exports.activetickets = function (req, res) {
    var departmentId = req.params.departmentId;
    var data = [];

//    c.query('SELECT tickets.*,client.fname,client.lname FROM tickets,client WHERE tickets.departmentId = "' + departmentId + '" and tickets.submitter = client.clientId')
    c.query('SELECT tickets.*,client.clientId, client.fname,client.lname FROM tickets,client WHERE tickets.status = 2 and tickets.submitter = client.clientId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
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


exports.scheduledtickets = function (req, res) {

    var data = [];

    c.query('SELECT tickets.*,client.clientId,client.fname,client.lname FROM tickets,client WHERE tickets.ticketGeneratedDate  >= DATE_SUB(NOW(), INTERVAL 24 HOUR) and tickets.submitter = client.clientId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
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

exports.recentlyanswered = function (req, res) {
    var data = [];

    c.query('SELECT tickets.*,client.clientId,client.fname,client.lname FROM tickets,client WHERE tickets.lastReplyDate IS NOT NULL and tickets.submitter = client.clientId and tickets.status = 4 ORDER BY lastReplyDate DESC LIMIT 5')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
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

exports.onHold = function (req, res) {
    var adminId = req.params.adminId;
    var data = [];

    c.query('SELECT tickets.*,client.clientId,client.fname,client.lname FROM tickets,client WHERE tickets.assignedTo = "' + adminId + '" and tickets.status = 6 and tickets.submitter = client.clientId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
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


exports.listall = function (req, res) {
    var data = [];
    c.query('SELECT tickets.*, client.fname FROM tickets,client where tickets.submitter = client.clientId')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            res.json({
                                Data: data,
                                code: 200
                            });
                            console.log('Listed all tickets');
                        });
            });
}


exports.overview = function (req, res) {

    var adminId = req.params.adminId;
    var period = req.params.period;

    var queryNewTickets; // Preparing queries based on the period/duration submitted for the Support overview
    var queryClientReplies;
    var queryAdminReplies;
    var queryNoReplies;
    var queryAvgFirstResponse;

    var newTickets; //counts the number of tickets not yet replied
    var clientReplies;
    var adminReplies; //staff replies
    var noReplies;
    var avgFirstResponse; //stores the avgFirstResponse of the admin in seconds, this has to be handled in the frontend (Convert into hours)
    // null if no records in the selected period/duration
    //duration logic
    if (period === "1") {
        console.log('Today\'s Overview');
        queryNewTickets = 'SELECT count(*) as count FROM tickets WHERE assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) = CURDATE()';
        queryClientReplies = 'SELECT count(*) as count FROM tickets WHERE status = 5 AND assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) = CURDATE()';
        queryAdminReplies = 'SELECT count(*) as count FROM tickets WHERE DATE(lastReplyDate) = CURDATE() AND assignedTo="' + adminId + '"';
        queryNoReplies = 'SELECT count(*) as count FROM tickets WHERE status = 0 AND assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) = CURDATE()';
        queryAvgFirstResponse = 'SELECT AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as totalRespTime FROM tickets WHERE assignedTo="' + adminId + '" AND lastReplyDate IS NOT NULL AND DATE(lastReplyDate) = CURDATE()'; //calculate the average of the admin's first reply response time in seconds
    } else if (period === "2") {
        console.log('Yesterday\'s Overview');
        queryNewTickets = 'SELECT count(*) as count FROM tickets WHERE assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) = (CURDATE()-1)';
        queryClientReplies = 'SELECT count(*) as count FROM tickets WHERE status = 5 AND assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) = (CURDATE()-1)';
        queryAdminReplies = 'SELECT count(*) as count FROM tickets WHERE DATE(lastReplyDate) = (CURDATE()-1) AND assignedTo="' + adminId + '"';
        queryNoReplies = 'SELECT count(*) as count FROM tickets WHERE status = 0 AND assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) = (CURDATE()-1)';
        queryAvgFirstResponse = 'SELECT AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as totalRespTime FROM tickets WHERE assignedTo="' + adminId + '" AND lastReplyDate IS NOT NULL AND DATE(lastReplyDate) = (CURDATE()-1)'; //calculate the average of the admin's first reply response time in seconds
    } else if (period === "3") {
        console.log('This week\'s Overview');
        queryNewTickets = 'SELECT count(*) as count FROM tickets WHERE assignedTo="' + adminId + '" AND YEARWEEK(ticketGeneratedDate) = YEARWEEK(NOW()) ';
        queryClientReplies = 'SELECT count(*) as count FROM tickets WHERE status = 5 AND assignedTo="' + adminId + '" AND YEARWEEK(ticketGeneratedDate) = YEARWEEK(NOW())';
        queryAdminReplies = 'SELECT count(*) as count FROM tickets WHERE YEARWEEK(lastReplyDate) = YEARWEEK(NOW()) AND assignedTo="' + adminId + '" ';
        queryNoReplies = 'SELECT count(*) as count FROM tickets WHERE status = 0 AND assignedTo="' + adminId + '" AND YEARWEEK(ticketGeneratedDate) = YEARWEEK(NOW())';
        queryAvgFirstResponse = 'SELECT AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as totalRespTime FROM tickets WHERE assignedTo="' + adminId + '" AND lastReplyDate IS NOT NULL AND YEARWEEK(lastReplyDate) = YEARWEEK(NOW())'; //calculate the average of the admin's first reply response time in seconds

    } else if (period === "4") {
        console.log('This month\'s Overview');
        queryNewTickets = 'SELECT count(*) as count FROM tickets WHERE assignedTo="' + adminId + '" AND MONTH(ticketGeneratedDate) = MONTH(NOW()) AND YEAR(ticketGeneratedDate) = YEAR(NOW())';
        queryClientReplies = 'SELECT count(*) as count FROM tickets WHERE status = 5 AND assignedTo="' + adminId + '" AND MONTH(ticketGeneratedDate) = MONTH(NOW()) AND YEAR(ticketGeneratedDate) = YEAR(NOW()) ';
        queryAdminReplies = 'SELECT count(*) as count FROM tickets WHERE MONTH(lastReplyDate) = MONTH(NOW()) AND YEAR(lastReplyDate) = YEAR(NOW()) AND assignedTo="' + adminId + '"';
        queryNoReplies = 'SELECT count(*) as count FROM tickets WHERE status = 0 AND assignedTo="' + adminId + '" AND MONTH(ticketGeneratedDate) = MONTH(NOW()) AND YEAR(ticketGeneratedDate) = YEAR(NOW())';
        queryAvgFirstResponse = 'SELECT AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as totalRespTime FROM tickets WHERE assignedTo="' + adminId + '" AND lastReplyDate IS NOT NULL AND MONTH(lastReplyDate) = MONTH(NOW()) AND YEAR(lastReplyDate) = YEAR(NOW())'; //calculate the average of the admin's first reply response time in seconds
    } else if (period === "5") {
        console.log('Last month\'s Overview');
        queryNewTickets = 'SELECT count(*) as count FROM tickets WHERE assignedTo="' + adminId + '" AND MONTH(ticketGeneratedDate) = (MONTH(NOW())-1) AND YEAR(ticketGeneratedDate) = YEAR(NOW())';
        queryClientReplies = 'SELECT count(*) as count FROM tickets WHERE status = 5 AND assignedTo="' + adminId + '" AND MONTH(ticketGeneratedDate) = (MONTH(NOW())-1) AND YEAR(ticketGeneratedDate) = YEAR(NOW()) ';
        queryAdminReplies = 'SELECT count(*) as count FROM tickets WHERE MONTH(lastReplyDate) = (MONTH(NOW())-1) AND YEAR(lastReplyDate) = YEAR(NOW()) AND assignedTo="' + adminId + '"';
        queryNoReplies = 'SELECT count(*) as count FROM tickets WHERE status = 0 AND assignedTo="' + adminId + '" AND MONTH(ticketGeneratedDate) = (MONTH(NOW())-1) AND YEAR(ticketGeneratedDate) = YEAR(NOW())';
        queryAvgFirstResponse = 'SELECT AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as totalRespTime FROM tickets WHERE assignedTo="' + adminId + '" AND lastReplyDate IS NOT NULL AND MONTH(lastReplyDate) = MONTH(NOW()-1) AND YEAR(lastReplyDate) = YEAR(NOW())'; //calculate the average of the admin's first reply response time in seconds
    } else {
        console.log('Default Switch: Lets pull Today\'s Overview');
        queryNewTickets = 'SELECT count(*) as count FROM tickets WHERE assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) = CURDATE()';
        queryClientReplies = 'SELECT count(*) as count FROM tickets WHERE status = 5 AND assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) = CURDATE()';
        queryAdminReplies = 'SELECT count(*) as count FROM tickets WHERE DATE(lastReplyDate) = CURDATE() AND assignedTo="' + adminId + '"';
        queryNoReplies = 'SELECT count(*) as count FROM tickets WHERE status = 0 AND assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) = CURDATE()';
        queryAvgFirstResponse = 'SELECT AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as totalRespTime FROM tickets WHERE assignedTo="' + adminId + '" AND lastReplyDate IS NOT NULL AND DATE(lastReplyDate) = CURDATE()'; //calculate the average of the admin's first reply response time in seconds
    }

    c.query(queryNewTickets)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    newTickets = row;
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in newTickets: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Counted newTickets');
                        });
            })

    c.query(queryClientReplies)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    clientReplies = row;
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in clientReplies: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Counted clientReplies');
                        });
            })

    c.query(queryAdminReplies)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    adminReplies = row;
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in adminReplies: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Counted adminReplies');
                        });
            })

    c.query(queryNoReplies)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    noReplies = row;
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in noReplies: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Counted noReplies');
                        });
            })

    c.query(queryAvgFirstResponse)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    avgFirstResponse = row;
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in avgFirstResponse: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Calculated avgFirstResponse');
                        });
            })

            .on('end', function () {
                res.json({
                    Data: {
                        newTicketsCount: newTickets,
                        clientRepliesCount: clientReplies,
                        adminRepliesCount: adminReplies,
                        noRepliesCount: noReplies,
                        avgFirstResponseTime: avgFirstResponse
                    },
                    code: 200
                });
                console.log('Done with all results');
            });
}



exports.setTicketStatus = function (req, res) {
    var ipaddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var adminId = req.params.adminId;
    var ticketId = req.params.ticketId;
    var updateTicketStatus = 'update tickets set status = 8 , lastStatusChangeDate = CURRENT_TIMESTAMP WHERE ticketId="' + ticketId + '"';

    c.query(updateTicketStatus)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    console.log("row" + row)
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in setTicketStatus: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Updated ticket status' + info.affectedRows);
                            if (info.affectedRows > 0) {
                                Logger.log("1", adminId, "5", "Ticket ID: " + ticketId + " was closed", "1", "1", ipaddress);
                            }
                            res.json({
                                Data: info,
                                code: 200
                            });
                        });
            })
}

exports.changeTicketStatus = function (req, res) {
    var ipaddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var adminId = req.params.adminId;
    var ticketId = req.params.ticketId;
    var status = req.params.status;
    var statusLog;
    switch (status) {
        case "0":
            statusLog = "Awaiting Reply";
            break;
        case "1":
            statusLog = "Flagged Ticket";
            break;
        case "2":
            statusLog = "Active Ticket";
            break;
        case "3":
            statusLog = "Open";
            break;
        case "4":
            statusLog = "Answered";
            break;
        case "5":
            statusLog = "Customer-Reply";
            break;
        case "6":
            statusLog = "On Hold";
            break;
        case "7":
            statusLog = "In Progress";
            break;
        case "8":
            statusLog = "Closed";
            break;
    }
    var updateTicketStatus = 'update tickets set status = "' + status + '" , lastStatusChangeDate = CURRENT_TIMESTAMP WHERE ticketId="' + ticketId + '"';
    c.query(updateTicketStatus)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    console.log("row" + row)
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in changeTicketStatus: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Updated ticket status' + info.affectedRows);
                            if (info.affectedRows > 0) {
                                Logger.log("1", adminId, "5", "Ticket ID: " + ticketId + " status was changed to : " + statusLog, "1", "1", ipaddress);
                            }
                            res.json({
                                Data: info,
                                code: 200
                            });
                        });
            })
}

exports.getClientsProdsOrServices = function (req, res) {

    var data = [];

    var clientId = req.params.clientId;
    var getClientsProdsServices = 'select i.productId,i.subTotal,i.datePaid,i.dueDate,i.status, p.productName, p.price from invoices i, products p WHERE clientId="' + clientId + '" and i.productId = p.productId order by i.datePaid ';

    c.query(getClientsProdsServices)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in getClientsProdsOrServices: ' + inspect(err));
                        })
                        .on('end', function () {
                            res.json({
                                Data: data,
                                code: 200
                            });
                        });
            })
}

exports.saveTicketReply = function (req, res) {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var ticketId = req.body.ticketId;
    var adminId = req.body.adminId;
    var adminfname = req.body.adminfname;
    var adminlname = req.body.adminlname;
    var addReplyText = req.body.addReplyText;
    var countFiles = req.body.countFiles;
    var replyOption = req.body.replyOption;
    var files = req.files;

    if (addReplyText == 0)
    {
        addReplyText = ""; //Admin havent wrote anything in add reply tab
    }

    console.log("ticketId " + ticketId);
    console.log("adminId " + adminId);
    console.log("addReplyText " + addReplyText);
    console.log("countFiles " + countFiles);
    console.log("replyOption " + replyOption);
    console.log("files " + JSON.stringify(files));
    console.log("req.body: " + JSON.stringify(req.body));
    console.log("req.files: " + JSON.stringify(req.files));
    console.log(ip);


// console.log("count this file "+ files.length);

    var reply = new TicketReply({ticketId: ticketId, adminId: adminId, adminfname: adminfname, adminlname: adminlname, repliedText: addReplyText, repliedWithOption: replyOption, numberOfFilesAttached: countFiles, adminIPaddress: ip});
    reply.save(function (err) {
        if (err) {
            return err;
        }
        else {
            Logger.log("1", adminId, "6", "Ticket ID: " + ticketId + " was replied by admin", "1", "1", ip);
            res.json({code: 200});
            console.log("Log saved");
        }
    })
}

exports.getTicketReplies = function (req, res) {
    var ticketId = req.body.ticketId;
//    var adminId = req.body.adminId;
//    res.json({data: "Inside getTicketReplies", code: 200});

//all ticket replies based on ticketID, no adminID is considered here
//only reply those docs which has repliedText in it.
    TicketReply.find({ticketId: ticketId, repliedText: {$ne: ""}}, function (err, docs) {
        if (err) {
            return err;
        }
        else {
            res.json({
                Data: docs,
                code: 200
            });
        }
    });

}
exports.deleteThisReply = function (req, res) {
     var ipaddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var ticketId = req.body.ticketId;
    var adminId = req.body.adminId;
    var replyToDelete = req.body.replyObjectId;

    TicketReply.remove({_id: replyToDelete}, function (err) {
        if (!err) {
        Logger.log("1", adminId, "6", "Ticket ID: " + ticketId + " with reply ID: " + replyToDelete + " was deleted", "1", "1", ipaddress);
            res.json({
                msg: "Deleted the reply",
                code: 200
            });
        }
        else {
            res.json({
                msg: "Failed to delete the reply",
                code: 198
            });
        }
    });
}


exports.rangeOverview = function (req, res) {

  var queryNewTickets; // Preparing queries based on the period/duration submitted for the Support overview
  var queryClientReplies;
  var queryAdminReplies;
  var queryNoReplies;
  // var queryTimeDiff;
  // var queryARTDetails;
  var queryAvgFirstResponse;

  var newTickets; //counts the number of tickets not yet replied
  var clientReplies;
  var adminReplies; //staff replies
  var noReplies;
  // var timeDiffDetails;
  // var aRTDetails;
  var avgFirstResponse; //stores the avgFirstResponse of the admin in seconds, this has to be handled in the frontend (Convert into hours)
  // null if no records in the selected period/duration
  //duration logic

console.log("Hit tickets.js");
console.log(req.body);

var adminId = req.body.adminId;
var dateswitch = req.body.dateswitch;
var dayswitch = req.body.dayswitch;

// console.log("aID "+adminId+"datesr - start "+startDate+"end -"+endDate+"daysa "+daysAgo+"dateswitch "+dateswitch+"dayswitch "+dayswitch);

if(dateswitch)
{
      console.log("dateswitch enabled");
      //moment(dateRange.startDate).format("YYYY-MM-DD");
      var startDate = req.body.data.datesrange.startDate;
      var endDate = req.body.data.datesrange.endDate;

    console.log("startDate "+startDate);
    console.log("endDate" + endDate);

      var sDate = moment(startDate).format("YYYY-MM-DD");
      var eDate = moment(endDate).format("YYYY-MM-DD");

      // var sMonth = moment(startDate).month()+1 ;
      // var eMonth = moment(endDate).month()+1;
      //
      // var sYear = moment(startDate).year();
      // var eYear = moment(endDate).year();
      //
      //
      // console.log(sDate+" and " + eDate);
      // console.log(sMonth+" and " + eMonth);
      // console.log(sYear+" and " + eYear);


       queryNewTickets = 'SELECT count(*) as count FROM tickets WHERE assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) between CAST("' + sDate + '" AS DATE) and CAST("' + eDate + '" AS DATE)';
       queryClientReplies = 'SELECT count(*) as count FROM tickets WHERE status = 5 AND assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) between CAST("' + sDate + '" AS DATE) and CAST("' + eDate + '" AS DATE)';
       queryAdminReplies = 'SELECT count(*) as count FROM tickets WHERE DATE(lastReplyDate) between CAST("' + sDate + '" AS DATE) and CAST("' + eDate + '" AS DATE) AND assignedTo="' + adminId + '"';
       queryNoReplies = 'SELECT count(*) as count FROM tickets WHERE status = 0 AND assignedTo="' + adminId + '" AND ticketGeneratedDate between CAST("' + sDate + '" AS DATE) and CAST("' + eDate + '" AS DATE)';
      //  queryTimeDiff = 'SELECT min(ticketGeneratedDate) as minDate ,max(ticketGeneratedDate) as maxDate, TIMESTAMPDIFF(SECOND, MIN(ticketGeneratedDate),MAX(ticketGeneratedDate)) as timeDiffSeconds from tickets where ticketGeneratedDate between CAST("' + sDate + '" AS DATE) and CAST("' + eDate + '" AS DATE)';
      //  queryARTDetails = 'SELECT AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as avgRespTime from tickets where assignedTo="' + adminId + '" and ticketGeneratedDate between CAST("' + sDate + '" AS DATE) and CAST("' + eDate + '" AS DATE)';
       queryAvgFirstResponse = 'SELECT AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as totalRespTime FROM tickets WHERE assignedTo="' + adminId + '" AND lastReplyDate IS NOT NULL AND DATE(lastReplyDate) between CAST("' + sDate + '" AS DATE) and CAST("' + eDate + '" AS DATE)'; //calculate the average of the admin's first reply response time in seconds

}

if(dayswitch)
{
    console.log("dayswitch enabled");
    var daysAgo = req.body.data.daysAgo;

    //between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()'

    queryNewTickets = 'SELECT count(*) as count FROM tickets WHERE assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
    queryClientReplies = 'SELECT count(*) as count FROM tickets WHERE status = 5 AND assignedTo="' + adminId + '" AND DATE(ticketGeneratedDate) between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
    queryAdminReplies = 'SELECT count(*) as count FROM tickets WHERE DATE(lastReplyDate) between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate() AND assignedTo="' + adminId + '"';
    queryNoReplies = 'SELECT count(*) as count FROM tickets WHERE status = 0 AND assignedTo="' + adminId + '" AND ticketGeneratedDate between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
    // queryTimeDiff = 'select min(ticketGeneratedDate) as minDate ,max(ticketGeneratedDate) as maxDate, TIMESTAMPDIFF(SECOND, MIN(ticketGeneratedDate),MAX(ticketGeneratedDate)) as timeDiffSeconds from tickets where ticketGeneratedDate between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
    // queryARTDetails = 'SELECT AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as avgRespTime from tickets where assignedTo="' + adminId + '" and ticketGeneratedDate between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()';
    queryAvgFirstResponse = 'SELECT AVG(TIMESTAMPDIFF(SECOND,ticketGeneratedDate,firstReplyDate)) as totalRespTime FROM tickets WHERE assignedTo="' + adminId + '" AND lastReplyDate IS NOT NULL AND DATE(lastReplyDate) between DATE_SUB(curdate(), INTERVAL ' + daysAgo + ' DAY) and curdate()'; //calculate the average of the admin's first reply response time in seconds
}

    c.query(queryNewTickets)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    newTickets = row;
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in newTickets: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Counted newTickets');
                        });
            })

    c.query(queryClientReplies)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    clientReplies = row;
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in clientReplies: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Counted clientReplies');
                        });
            })

    c.query(queryAdminReplies)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    adminReplies = row;
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in adminReplies: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Counted adminReplies');
                        });
            })

    c.query(queryNoReplies)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    noReplies = row;
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in noReplies: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Counted noReplies');
                        });
            })

    c.query(queryAvgFirstResponse)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    avgFirstResponse = row;
                })
                        .on('error', function (err) {
                            res.json({
                                code: 198
                            });
                            console.log('Result error in avgFirstResponse: ' + inspect(err));
                        })
                        .on('end', function (info) {
                            console.log('Calculated avgFirstResponse');
                        });
            })

            // c.query(queryTimeDiff)
            //         .on('result', function (resrow) {
            //             resrow.on('row', function (row) {
            //                 timeDiffDetails = row;
            //             })
            //                     .on('error', function (err) {
            //                         res.json({
            //                             code: 198
            //                         });
            //                         console.log('Result error in queryTimeDiff: ' + inspect(err));
            //                     })
            //                     .on('end', function (info) {
            //                         console.log('Calculated queryTimeDiff');
            //                     });
            //         })

                    // c.query(queryARTDetails)
                    //         .on('result', function (resrow) {
                    //             resrow.on('row', function (row) {
                    //                 aRTDetails = row;
                    //             })
                    //                     .on('error', function (err) {
                    //                         res.json({
                    //                             code: 198
                    //                         });
                    //                         console.log('Result error in aRTDetails: ' + inspect(err));
                    //                     })
                    //                     .on('end', function (info) {
                    //                         console.log('Calculated aRTDetails');
                    //                     });
                    //         })

            .on('end', function () {
                res.json({
                    Data: {
                        newTicketsCount: newTickets,
                        clientRepliesCount: clientReplies,
                        adminRepliesCount: adminReplies,
                        noRepliesCount: noReplies,
                        avgFirstResponseTime: avgFirstResponse
                        // timeDiffInRange: timeDiffDetails
                    },
                    code: 200
                });
                console.log('Done with all results');
            });
}
