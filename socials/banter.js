module.exports={
	start1:{
		trigger(msg) {
		return !!(msg.content.toLowerCase()=="sorry, i was doing some uhh... nerdy stuff."&&Math.floor(Math.random() * 4)==0);
		},
		execute(msg) {
			return [
				"Oh my!",
				"I'm sure I don't want to know.",
				"You don't say...",
				"My goodness.",
				"Was that Star Trek or Star Wars?"
			];
		}
	},
	cont1:{
		trigger(msg) {
            return !!(msg.content.toLowerCase()=="what's her name?");
		},
		execute(msg) {
			return [
				"I don't want to talk about it.",
				"I'm sure I don't know what you are implying.",
				"Her? Who?",
				"Don't you wish you knew?",
				"I don't kiss and tell."
			];
		}
	}
	
}
