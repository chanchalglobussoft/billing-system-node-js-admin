'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);



//  app.get('/api/:id',function(req,res){
// var a=req.params.id;
// console.log(a);
// var a={"result":"green"};
// res.send(a);

// });
};