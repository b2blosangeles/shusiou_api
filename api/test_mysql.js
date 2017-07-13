var v = req.body.ip;
res.send(v[0]);
pkg.request({
    url: 'http://'+v[0]+'/checkip/',
    method: "POST",
    json: {}
    }, function (error, resp, body) { 
      res.send(body+'---');
   });

