var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var connection = mysql.createConnection({
          host     : 'db_dev.qalet.com',
          user     : 'shusiou',
          password : 'Montreal107#',
          database : 'shusiou'
});

connection.connect();

connection.query('SHOW TABLES;', function (error, results, fields) {
          if (error) {
                  res.send(error.message);
                  return true;
                 // throw error;
          }
          var v = [];
          for (var i = 0; i < results.length; i++) {
                    v[v.length] = results[i]['Tables_in_shusiou'];
          }
        res.send(v);
});
