var ytdl = require(env.space_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
ytdl.getInfo(req.body.video_url, {},  function(err, info){
  if (err) {
    res.send(info);
  } else {
    var r = {vid:info.video_id, title:info.title, length_seconds:parseInt(info.length_seconds), thumbnail_url:info.thumbnail_url};
    res.send(r);
  }  
});
