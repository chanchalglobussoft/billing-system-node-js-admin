var mongoose = require('mongoose');

var affiliates = new mongoose.Schema({
        settingsId: Number,
        adminId:Number,
        date: { type: Date, default: Date.now },
        commissionType:Number,
        commissionPercentage:Number, 
        commissionamount:Number, 
        payoutDay:Number

       
});

module.exports = mongoose.model('affiliates', affiliates);
