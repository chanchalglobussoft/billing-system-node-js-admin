'use strict';
var express = require('express');
var Logger = require('../../models/admin/logger.js');
var inspect = require('util').inspect;
var connect = require('../../../app/models/maria.js');
var c = new connect.maria();


exports.getAllData = function (req, res) {
    var data = [];
    c.query('select *  from countries')
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

exports.getOnlyCountryNames = function (req, res) {
    var data = [];
    c.query('select id_countries, name  from countries')
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

exports.getOnlyCurrencies = function (req, res) {
    var data = [];
    c.query('select id_countries, currency_code  from countries')
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

