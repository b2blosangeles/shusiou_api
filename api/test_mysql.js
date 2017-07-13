var v = req.body.ip;

function isIp(ip) {
    var arrIp = ip.split(".");
    if (arrIp.length !== 4) return "Invalid IP";
    for (let oct of arrIp) {
        if ( isNaN(oct) || Number(oct) < 0 || Number(oct) > 255)
            return false;
    }
    return true;
}

var CP = new pkg.crowdProcess();
var _f = {};

for (var i = 0; i < v.length; i++) {
   _f[i] = function(cbk) {
        cbk(c[i]);   
   };
}


CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
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
