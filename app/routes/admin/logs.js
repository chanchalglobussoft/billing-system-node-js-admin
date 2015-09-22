//-------------------------------------------------------------------------------------- By: Syed Arshad
'use strict';
var express = require('express');
var inspect = require('util').inspect;
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var logRoutes = express.Router();
var LogStatus = require('../../models/admin/logstatus.js');
var Log = require('../../models/admin/logschema.js');

module.exports = function (app) {

        app.use('/log', logRoutes);
        logRoutes.use(function (req, res, next) {
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });

//localhost:3000/log/getStatus/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.W3siYWRtaW5JZCI6IjExIiwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJmbmFtZSI6IkJpbGxpbmciLCJsbmFtZSI6IlN5c3RlbSIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJlbWFpbElkIjoiYWRtaW5AYmlsbGluZ3N5c3RlbS5jb20iLCJza3lwZUlkIjoiYWRtaW4iLCJmYklkIjoiMTIzNDU2In1d.zDPOBnQTnS-K3Hp9ULxLkTvKQYrUnfdj1LeiZG27Sm0
    logRoutes.get('/getStatus', function (req, res) {
        LogStatus.find({label: "LOGSTATUS"}, function (err, docs) {
             res.json({
                        Data: docs,
                        code: 200
                    });
        });
    });

    logRoutes.post('/setStatus', function (req, res) {
        var setStatus = req.body.status;
        var query = { label:"LOGSTATUS"};
        var update = {status: setStatus, lastChange: new Date()};
        var options = {new: true};
        LogStatus.findOneAndUpdate(query, update, options, function(err, data) {
          if (err) {
              res.json({
              code: 198,
              message: "Failed"
              });
            console.log('Got error in setStatus');
          }
          res.json({
          code: 200,
          message: "Success"
          });
        });

 });


 //LogSchema - The individual log storage:


     logRoutes.get('/get-all-logs', function (req, res) {
         console.log("inside /get-all-logs");
        Log.find({}).sort('-date').exec(function (err, docs) {
             res.json({
                        Data: docs,
                        code: 200
                    });
        });
    });


      logRoutes.get('/count-logs', function (req, res) {
         console.log("inside /get-all-logs");
        Log.count({}, function (err, docs) {
                    res.json({
                        LogCount: docs,
                        code: 200
                    });
        });
    });


    logRoutes.get('/clearLogs', function (req, res) {
        console.log("Came inside /clearLogs")
       Log.remove({}, function(err) {
            if (!err) {
                   res.json({
                        msg: "Cleared all logs",
                        code: 200
                    });
            }
            else {
                   res.json({
                        msg: "Failed clearing the logs",
                        code: 198
                    });
            }
            });
    });


    logRoutes.get('/filteredLogs/:filterId/:filterParam', function (req, res) {
        res.send("filteredLogs");
    });


//Logger schema initiators
//----------------------------------------------------------------------------------------
// localhost:3000/log/initiate-log-schema/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.W3siYWRtaW5JZCI6IjExIiwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJmbmFtZSI6IkJpbGxpbmciLCJsbmFtZSI6IlN5c3RlbSIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJlbWFpbElkIjoiYWRtaW5AYmlsbGluZ3N5c3RlbS5jb20iLCJza3lwZUlkIjoiYWRtaW4iLCJmYklkIjoiMTIzNDU2In1d.zDPOBnQTnS-K3Hp9ULxLkTvKQYrUnfdj1LeiZG27Sm0
     logRoutes.get('/initiate-log-schema', function (req, res) {
        var log = new Log({ role:"1", userId : "6", date: new Date(), level:"0", msg:"test log", type:"1", status:"1", IP:"127.0.0.1"});
         log.save(function (err) {
          if (err) {
                        return err;
          }
          else {
                console.log("Logger schema initiators ran and the log has been saved");
                res.send("Logger schema initiators ran and the log has been saved");
          }
        });
 });

 //localhost:3000/log/initiate-log-status-schema/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.W3siYWRtaW5JZCI6IjExIiwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJmbmFtZSI6IkJpbGxpbmciLCJsbmFtZSI6IlN5c3RlbSIsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJlbWFpbElkIjoiYWRtaW5AYmlsbGluZ3N5c3RlbS5jb20iLCJza3lwZUlkIjoiYWRtaW4iLCJmYklkIjoiMTIzNDU2In1d.zDPOBnQTnS-K3Hp9ULxLkTvKQYrUnfdj1LeiZG27Sm0
 logRoutes.get('/initiate-log-status-schema', function (req, res) {
  	var log = new LogStatus({ label:"LOGSTATUS", status : "1", lastChange: new Date() });
         log.save(function (err) {
          if (err) {
                        return err;
          }
          else {
                console.log("Log status initiators ran and a test log has been saved");
                res.send("Log status initiators ran and a test log has been saved");
          }
        });
 });

 //----------------------------------------------------------------------------------------


}//exports ends
