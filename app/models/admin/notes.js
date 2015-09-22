var mongoose = require('mongoose');

var notes = new mongoose.Schema({
        notesId: Number,
        date: { type: Date, default: Date.now },
	    adminId : String,
	    note:String,
	    status:{ type: Number }
       
});

module.exports = mongoose.model('notes', notes);
