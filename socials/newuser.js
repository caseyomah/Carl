module.exports={
	newuser:{
		trigger(msg) {
            return !!(msg.content.match(/i understand/i) && msg.channel == newconn&&msg.member.roles.cache.has("701907216479027281"))
		},
		execute(msg) {
			newconn.send(`Done? Great! Sorry to put you through that mess, but it was pretty important. Now, I'll slip a note to our ${CastingRef} department. They should be by soon to answer any questions and let you in.`);
			setTimeout(function() {msg.channel.send(`Oh, I almost forgot! Once you're in, if you need help, be sure to ask in the ${HelpRef} channel. You can also type !help to see what I can help you with.`);msg.member.roles.remove("701907216479027281");},5000);
		}
	}
}
