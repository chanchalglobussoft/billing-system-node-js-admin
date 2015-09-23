'use strict';
var express = require('express');
var Logger = require('../models/logger.js');
var inspect = require('util').inspect;
var connect = require('../../../models/maria.js');
var c = new connect.maria();


exports.getAllData = function (req, res) {
    var data = [];
    c.query('select *  from security_questions')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
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

exports.getOnlyQuestions = function (req, res) {
    var data = [];
    c.query('select sqID,question from security_questions')
            .on('result', function (resrow) {
                resrow.on('row', function (row) {
                    data.push(row);
                })
                        .on('error', function (err) {
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
