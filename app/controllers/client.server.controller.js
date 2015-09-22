'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./client/users.authentication.server.controller'),
	require('./client/users.authorization.server.controller'),
	require('./client/users.password.server.controller'),
	require('./client/users.profile.server.controller'),
	require('./client/auth.js')
);