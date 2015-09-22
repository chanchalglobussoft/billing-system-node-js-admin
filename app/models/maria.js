var mariaClient = require('mariasql');
var inspect = require('util').inspect;

exports.maria=function(){//exporting maria connection

  var connect = new mariaClient();

  connect.connect({
      host: '127.0.0.1',
      user: 'root',
      password: 'root',
      db: 'billing',
      port: 3307
  });

return connect;
}
