var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var v = req.body.ip, sts = JSON.stringify(req.body.status);
/*
function isIp(ip) {
    var arrIp = ip.split(".");
    if (arrIp.length !== 4) return "Invalid IP";
    for (let oct of arrIp) {
        if ( isNaN(oct) || Number(oct) < 0 || Number(oct) > 255)
            return false;
    }
    return true;
}
*/

var CP = new pkg.crowdProcess();
var _f = {};

for (var i = 0; i < v.length; i++) {
	_f[i] = (function(i) {
		return function(cbk) {
			pkg.request({
				url: 'http://'+v[i]+'/checkip/',
				headers: {
				    "content-type": "application/json"
				}
			    }, function (error, resp, body) { 
				var a = [];
				try {
				    a = JSON.parse(body);
				} catch(err)  {
				}
				if (a.indexOf(v[i]) !== -1) {
					var cfg0 = require(env.space_path + '/api/cfg/db.json');
					var connection = mysql.createConnection(cfg0);
					connection.connect();
					var str = 'INSERT INTO cloud_node (`node_ip`, `created`, `updated`, `status`) ' +
						'values ("' +v[i] + '", NOW(), NOW(), "' +  encodeURIComponent(sts) + '") ON DUPLICATE KEY '+
					    	'UPDATE `updated` = NOW(), status = "' +  encodeURIComponent(sts) + '" ';

					connection.query(str, function (error, results, fields) {
						connection.end();
						if (error) {
							cbk(error.message);
							return true;
						} else {
							cbk(true);
						}
					});					
					
				} else cbk(false);
			   });
		}	
	})(i);
}


CP.parallel(
	_f,
	function(data) {
		res.send(data);
	},
	30000
);


/*
pkg.request({
        url: 'http://'+v[0]+'/checkip/',
        headers: {
            "content-type": "application/json"
        }
    }, function (error, resp, body) { 
        var a = [];
        try {
            a = JSON.parse(body);
        } catch(err)  {
            res.send(err.message + '---' + body);
        }
        res.send(a);
   });

*/
