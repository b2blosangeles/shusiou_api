var v = req.body.ip;

pkg.request({
    url: 'http://'+v[0]+'/checkip/',
    method: "POST",
    json: {}
    }, function (error, resp, body) { 
      res.send(body+'---');
   });

