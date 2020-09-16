module.exports={
	hi:{
		0:{
			trigger(msg) {
				return !!msg.content.match(/^h(e(llo)?|i|y)a?.* carl.*/i);
			},
			execute(msg) {
				return "Hello, "+msg.author+", is there something I can help you with?";
			}
		},
		1:{
			trigger(msg) {
				return !!msg.content.match(/morning.* carl.*/i);
			},
			execute(msg) {
				return [
					"Great to see you again.",
					"Great to see you again, "+msg.author+"."
				];
			}
		}
	},
	bye:{
		trigger(msg) {
			return !!msg.content.match(/^(good ?)?(bye|n(ight|ite)).* carl.*/i);
		},
		execute(msg) {
			return [
				"Hope to see you again soon.",
				"Hope to see you again soon, "+msg.author+"."
			];
		}
	},
	thank:{
		trigger(msg) {
            return !!msg.content.match(/thank(s.*| ?you.*) carl.*/i);
		},
		execute(msg) {
			return [
				"It is a pleasure to be of service.",
				"You are most welcome."
			];
		}
	}
}