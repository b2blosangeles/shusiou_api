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
pkg.request({
    url: 'http://'+v[0]+'/checkip/',
    headers: {
        "content-type": "application/json"
    },    
    method: "POST"
    }, function (error, resp, body) { 
      res.send(typeof body);
   });

