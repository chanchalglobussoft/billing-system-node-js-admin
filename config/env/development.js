'use strict';

module.exports = {
	jwtsecret: "ultrasecret",
	db: 'mongodb://localhost/billing-system-dev',
	host:'http://localhost:3000/#/',
	mandrill: {
		key: "FGgmDbZJFFX4Y-n_45jDRQ"
	},
	app: {
		title: 'Billing System - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1546626578950150',
		clientSecret: process.env.FACEBOOK_SECRET || '7f15cc6d4bcb9d4fc9f999ce41a509ca',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'JbDJzYGeDM9L0Q76Q4JsFJdQQ',
		clientSecret: process.env.TWITTER_SECRET || 'STZ4iwqYPPAv7j0y83Eme7r1D7VZ190RATCVbNJvfPA3zejZmh',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '321020382447-j8lei1sriukiph0q7a931lqucb82jt5p.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'Mrcf2tPB97W4m185poK2nZUK',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || '75otgqqilncr9k',
		clientSecret: process.env.LINKEDIN_SECRET || 'qstbk4Nzk7ug49HH',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || '2767c69d73f6c724f174',
		clientSecret: process.env.GITHUB_SECRET || 'c900cb58a702380853407225fbe936d641af7269',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};