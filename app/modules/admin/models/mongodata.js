var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
});

var domainsPricesSchema = new mongoose.Schema({


    data: Object
});

module.exports = mongoose.model('domainsPrices', domainsPricesSchema);
