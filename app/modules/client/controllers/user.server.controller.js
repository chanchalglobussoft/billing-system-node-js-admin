'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./user/users.authentication.server.controller'),
	require('./user/users.authorization.server.controller'),
	require('./user/users.password.server.controller'),
	require('./user/users.profile.server.controller'),
	require('./user/auth.js')
);