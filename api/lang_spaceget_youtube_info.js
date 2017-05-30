var ytdl = require(env.space_path + '/api/pkg/ytdl-core/node_modules/ytdl-core');
ytdl.getInfo(req.body.video_url, {},  function(err, info){
  var r = {vid:info.video_id, title:info.title, length_seconds:parseInt(info.length_seconds), thumbnail_url:info.thumbnail_url};
  res.send(r);
});
