var v = req.body.ip;
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
					    cbk(err.message + '---' + body);
					}
					cbk(a);
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
