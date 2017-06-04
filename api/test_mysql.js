var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var connection = mysql.createConnection({
          host     : 'db_dev.qalet.com',
          user     : 'shusiou',
          password : 'Montreal107#'
        //,
        //  database : 'shusiou'
});

connection.connect();

connection.query('SHOW DATABASES', function (error, results, fields) {
          if (error) {
                  res.send(error.message);
                  return true;
                 // throw error;
          }
        res.send(results);
});
