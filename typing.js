var read = 2500; // Set time (in milliseconds) to read a message before beginning typing.
var wpm = 35; // Set typing speed in words per minute.
var proof = 2500; // Set time (in milliseconds) to proof message before sending.
var mpc = (wpm*5)/60000; // Convert words per minute to milliseconds per character.
var typingQueue=[]; // Messages being typed.

module.exports=function(text, chan) {
    typingQueue.push([text,chan]);
	while (typingQueue.length>0) {
        var [text,chan]=typingQueue.shift();
        try {
            return new Promise(msg =>{
				setTimeout(()=>{
					chan.startTyping();
					setTimeout(()=>{
						chan.stopTyping();
						setTimeout(()=>{
							chan.send(text).then(m=>msg(m));
						},proof);
					},text.length*mpc);
				},typingQueue.length?0:read);
			});
		}
        catch (e) {
            console.error(e);
        }
    }
}
