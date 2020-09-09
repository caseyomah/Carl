module.exports={
	hi1:{
		trigger(msg) {
			return !!msg.content.match(/^h(e(llo)?|i|y)a?.* carl.*/i);
		},
		execute(msg) {
			var say=new Array("Hello, "+msg.author+", is there something I can help you with?");
			msg.channel.send(say[Math.floor(Math.random()*say.length)]);
		}
	},
	hi2:{
		trigger(msg) {
			return !!msg.content.match(/morning.* carl.*/i);
		},
		execute(msg) {
			var say=new Array("Great to see you again.","Great to see you again, "+msg.author+".");
			msg.channel.send(say[Math.floor(Math.random()*say.length)]);
		}
	},
	bye:{
		trigger(msg) {
			return !!msg.content.match(/^(good ?)?(bye|n(ight|ite)).* carl.*/i);
		},
		execute(msg) {
                var say=new Array("Hope to see you again soon.","Hope to see you again soon, "+msg.author+".");
                msg.channel.send(say[Math.floor(Math.random()*say.length)]);
            }
	},
	thank:{
		trigger(msg) {
            return !!msg.content.match(/thank(s.*| ?you.*) carl.*/i);
		},
		execute(msg) {
			var say=new Array("It is a pleasure to be of service.","You are most welcome.");
			msg.channel.send(say[Math.floor(Math.random()*say.length)]);
		}
	}
}