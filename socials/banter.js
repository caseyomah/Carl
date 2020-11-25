module.exports={
	start1:{
		trigger(msg) {
		return !!(msg.content.toLowerCase()=="sorry, i was doing some uhh... nerdy stuff."&&Math.floor(Math.random() * 4)==0);
		},
		execute(msg) {
			var say=[
				"Oh my!",
				"I'm sure I don't want to know.",
				"You don't say...",
				"My goodness.",
				"Was that Star Trek or Star Wars?"
			];
		}
	}
}
