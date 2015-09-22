var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
});

var logStatusSchema = new mongoose.Schema({
        label: String,  
        status: Number,
        lastChange: Date
});

module.exports = mongoose.model('logStatus', logStatusSchema);
