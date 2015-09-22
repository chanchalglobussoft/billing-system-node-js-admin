'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
        config = require('./config/config'),
        mongoose = require('mongoose'),
        chalk = require('chalk');
var inspect = require('util').inspect;
var Client = require('mariasql');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect('mongodb://localhost/billinglogs', function (err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    }
    else {
        console.log('MongoDB: Conneted to billinglogs');
    }
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Billing System started on port ' + config.port);
