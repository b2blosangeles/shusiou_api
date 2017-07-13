var v = req.body.ip;

pkg.request({
    url: 'http://'+v[0]+'/checkip/',
    method: "GET"
    }, function (error, resp, body) { 
      res.send(body+'---');
   });

