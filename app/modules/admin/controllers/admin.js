'use strict';
var express = require('express');
var inspect = require('util').inspect;
var notes = require('../models/notes.js');
var connect = require('../../../models/maria.js');
var c = new connect.maria();


exports.insertNotes = function (req, res) {
    var adminId = req.body.adminId;
    var date = req.body.date;
    var data = req.body.data;

    var Data = new notes({
        //  data: data,
        notesId: Math.round((new Date()).getTime() / 1000),
        date: {type: Date, default: Date.now},
        adminId: adminId,
        note: data,
        status: 1

    });
    Data.save(function (err, Data) {
        console.log(Data);

        if (err)
            return console.error(err);
        res.json({
            data: Data,
            code: 200
        })
        //  console.log("saved to database");
    });
}




exports.findnotes = function (req, res) {
    var adminId = req.body.adminId;

    notes.find({
        adminId: adminId,
        status: 1
    }, function (err, data) {

        if (err)
            return console.error(err);

        res.json({
            data: data,
            code: 200

        });
    });


}


exports.updatenotes = function (req, res) {
    var notesId = req.body.notesId;
    notes.update({notesId: notesId}, {$set: {status: 0}}, function () {
        res.send("Sucess");
    });
}


exports.getAdminInfo = function (req, res) {

    var data = req.body;
    var adminId = req.body.adminId;
//    var adminId = 11;
//    console.log("Hit getAdminInfo"+JSON.stringify(data));
    var data = [];
    c.query('select adminId,fname,lname,mobile,emailId,skypeId,fbId from admin where adminId = ' + adminId + '')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row)
//                    console.log(row);
                }).on('error', function (err) {
                    console.log('Result error in getAdminInfo: ' + inspect(err));
                }).on('end', function (info) {
                    res.json({
                        Data: data,
                        code: 200
                    });
                    console.log('Result finished successfully');
                });
            })
}

exports.getAdminReplies = function (req, res) {

    var data = req.body;
    var adminId = req.body.adminId;
    var catId = req.body.catId;

    if(catId)
      var baseQuery = 'select * from predefinedreplies where adminID = ' + adminId + ' and categoryID = ' + catId + ' ';
    else
      var baseQuery = 'select * from predefinedreplies where adminID = ' + adminId + '';


    var data = [];
    c.query(baseQuery)
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row)
                }).on('error', function (err) {
                    console.log('Result error in getAdminReplies: ' + inspect(err));
                }).on('end', function (info) {
                    res.json({
                        Data: data,
                        code: 200
                    });
                    console.log('Result finished successfully');
                });
            })
}
