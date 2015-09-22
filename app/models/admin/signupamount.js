var mongoose = require('mongoose');

var signup = new mongoose.Schema({
        insertId: Number,
        date: { type: Date, default: Date.now },
        amount: String,
	    adminId : String,
	    note:String
	   
       
});

module.exports = mongoose.model('signup', signup);
