var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
});

var tldSchema = new mongoose.Schema({


    tld: Object
});

module.exports = mongoose.model('tlds', tldSchema);
