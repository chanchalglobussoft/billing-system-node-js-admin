var mongoose = require('mongoose');

var kbaseSchema = new mongoose.Schema({
    
    categoryID: Number,
    
        ticketId: Number,
        adminId: Number,
        adminfname: String,
        adminlname: String,
        repliedText: String,
        repliedWithOption: Number,
        numberOfFilesAttached: Number,
        adminIPaddress: String,      
        date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KBase', kbaseSchema);
