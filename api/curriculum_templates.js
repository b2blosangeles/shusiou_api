var default0 = {
					lang:{mother:'en-US', learning:'zh-CN'},
					pro:[
						{text:'The next sentence is saying|The next paragraph is talking about', lang:'en-US', active:true},
						{text:'{l}', lang:'en-US', active:true},
						{text:'Listen', lang:'en-US', active:true},
						{action:'play video', active:true}, 
						{text:'Please repeat', lang:'en-US', active:false}
					],					
					match:[
						{text:'Good Job|Nice|good|excellent', lang:'en-US', active:true},
					],
					nomatch:[
						{text:'Incorrect, please try again|Wrong, repeat', lang:'en-US', active:false},
						{action:'play video', active:true}, 
						{text:'Please try again.', lang:'en-US', active:false}					
					],
					done:{text:'Lets continue', lang:'en-US', active:true}
				};
res.send(default0);
