//-------------------------------------------------------------------------------------- By: Syed Arshad
'use strict';
var mongoose = require('mongoose');
var LogStatus = require('./logstatus.js');
var Log = require('./logschema.js');

//--------------------------------------------------------------------------------------
//log(role,userId,level,msg,type,status,IP); //This is the logger signature
function log(role, userId, level, msg, type, status, IP)
{
    var IP = IP.replace('::ffff:',''); //converting IPv6 address format to IPv4
    
    //localhost fix for uniformity
    if(IP == "::1")
    {
        IP = "127.0.0.1";
    }
    LogStatus.find({label: "LOGSTATUS"}, function (err, docs) {
        if (docs.length>0)
        {
            var log = new Log({role: role, userId: userId, date: new Date(), level: level, msg: msg, type: type, status: status, IP: IP});
            log.save(function (err) {
                if (err) {
                    return err;
                }
                else {
                    console.log("Log saved");
                }
            })
        }
        else
        {
           console.log("Logger is disabled by Super Admin !");
        }
    });
}
//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
// Not using anywhere, but can be called to check the logger status 
// EG: 
// var Logger = require('../models/logger.js');
// Logger.loggerStatusCheck(); 
function loggerStatusCheck()
{
    var loggerStatus;
    LogStatus.find({label: "LOGSTATUS"}, function (err, docs) {
        if (docs[0].status)
        {
            console.log("Logger is enabled");
            loggerStatus = 1;
        }
        else
        {
            console.log("Logger is disabled");
            loggerStatus = 0;
        }
    });
}

exports.log = log;
exports.loggerStatusCheck = loggerStatusCheck;
//--------------------------------------------------------------------------------------