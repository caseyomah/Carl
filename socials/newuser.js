const typing=require("../typing.js");
module.exports={
	newuser:{        
		trigger(msg) {
            return !!(msg.content.match(/i understand/i) && msg.channel == newconn&&msg.member.roles.cache.has("701907216479027281"));
		},
		execute(msg) {
			setTimeout(function() {typing(`Oh, I almost forgot! Once you're in, if you need help, be sure to ask in the ${HelpRef} channel. You can also type !help to see what I can help you with.`,newconn);msg.member.roles.remove("701907216479027281");},6000);
			return `Done? Great! Sorry to put you through that mess, but it was pretty important. Now, I'll slip a note to our ${CastingRef} department. They should be by soon to answer any questions and let you in.\n\nOnce you are in the main server, you will not have access to this channel.  This is to minimize potential ne'er-do-well influences.`;
		}
	}
}
