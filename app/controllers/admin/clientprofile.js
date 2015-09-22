'use strict';
var express = require('express');
var inspect = require('util').inspect;
var connect = require('../../../app/models/maria.js');
var c = new connect.maria();

exports.getclientprofile=function(req,res){

var data=[];

     c.query('select * FROM client WHERE clientId="'+req.body.clientId+'"')
        .on('result', function(resrow) {
            resrow.on('row', function(row) {
                    data.push(row)
                })
                .on('error', function(err) {
                     res.json({
                        Data: inspect(err),
                        code: 198
                    })
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function(info) {
                    res.json({
                        Data: data,
                        code: 200
                    })
                    console.log('Result finished successfully');
                });
        })


}