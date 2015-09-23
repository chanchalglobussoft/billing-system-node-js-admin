var mongoose = require('mongoose');

var ticketReplySchema = new mongoose.Schema({
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

module.exports = mongoose.model('TicketReply', ticketReplySchema);
