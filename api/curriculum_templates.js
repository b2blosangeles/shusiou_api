var v = {
  lang:{mother:'en-US', learning:'zh-CN'},
	pro:[
		{text:'The next sentence is saying|The next paragraph is talking about', lang:'mother'},
		{text:'{l}'},
		{text:'Listen', lang:'mother'},
		{action:'play video'}, 
		{text:'Please repeat', lang:'mother'}
	],					
	match:[
		{text:'Good Job|Nice|good|excellent', lang:'mother'}
	],
	nomatch:[
		{text:'Incorrect, please try again|Wrong, repeat', lang:'mother'},
		{action:'play video'}, 
		{text:'Please try again.', lang:'mother'}					
	],
	done:[{text:'Lets continue', lang:'mother'}]
};
res.send(v);
