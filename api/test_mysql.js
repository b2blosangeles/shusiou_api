var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var cfg = require(env.space_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg);

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
        res.send(results);
});
