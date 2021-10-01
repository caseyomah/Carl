const shell = require('linux-shell-command').shellCommand;
let err=[];
parseShell=(s) => {
    s=s.split(/[\r\n]+/).filter(a=>{b=a.match(/\s\/media\/plex\/Plex([^\/]+?)\s/)?true:false;console.log(b,a);return b;}).map(a=>{let b=a.split(/\s+/)[1].substring(16);return b.substring(0,1)=="-"?b.substring(1):b;});
    return s;
}
module.exports=async function(chan,staff) {	// Drive checking
	if (chan&&staff) {
		try {
			let fstb=shell("cat /etc/fstab");
			fstb.execute()
			.then(success=> {
				if (success === true && fstb.stdout != "") {
      //              console.log(fstb.stdout);
					let f=parseShell(fstb.stdout);
					let mtb=shell("cat /etc/mtab");
					mtb.execute()
					.then(success => {
						if (success === true && mtb.stdout != "") {
							let m=parseShell(mtb.stdout);
							let msng=[];
							f.forEach(drv=>{
								if (!m.includes(drv)) msng.push(drv);
							});
							if (msng.length>0) {
								let e=false;
								msng.forEach(d=>{if (!err.includes(d)) {e=true;err.push(d);}});
								if(e) {
									msgs=[
										`${msng[0]} has been reported missing${(msng.length>1?", it was last seen in the company of "+(msng.length>2?msng.slice(1,-1).join(", ")+", and ":"")+msng.slice(-1)[0]:"")}.`,
										`be on the lookout for ${msng[0]}${(msng.length>1?", last seen in the company of "+(msng.length>2?msng.slice(1,-1).join(", ")+", and ":"")+msng.slice(-1)[0]:"")}.`,
										`little Bopeep has lost her sheep named ${msng[0]}${(msng.length>1?", "+(msng.length>2?msng.slice(1,-1).join(", ")+", and ":"")+msng.slice(-1)[0]:"")}, and doesn't know where to find ${(msng.length>1?"them":"it")}! Would you be a dear, and seek them out?`,
										`drive${(msng.length>1?"s":"")}  ${msng[0]}${(msng.length>1?", "+(msng.length>2?msng.slice(1,-1).join(", ")+", and ":"")+msng.slice(-1)[0]:"")} ${(msng.length>1?"are":"is")} on the lam... can you please find ${(msng.length>1?"them":"it")}?`
									];
									let say=msgs[Math.floor(Math.random()*msgs.length)];
									if (say) chan.send(`${staff}, ${say}`);
								}
							}
							else {
								err=[];
							}
							
						}
					}).catch(e => {
						console.error(e);
					});
				}
			}).catch(e => {
				console.error(e);
			});
		}
		catch (e) {
			console.log('There was an issue with drive checking.');
			console.error(e);
		}
	}
}
