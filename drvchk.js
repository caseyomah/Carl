const shell = require('linux-shell-command').shellCommand;
let err=false;
module.exports=async function(chan,staff) {	// Drive checking
	try {
		let fstb=shell("cat /etc/fstab");
		fstb.execute()
		.then(success=> {
			if (success === true && fstb.stdout != "") {
				let f={};
				fstb.stdout.match(/\/media\/plex\/Plex-([^\/]+?)\s/g).map(a=>{return a.slice(17,-1);}).forEach(a=>{f[a]=true;});
				f=Object.keys(f);
				let mtb=shell("cat /etc/mtab");
				mtb.execute()
				.then(success => {
					if (success === true && mtb.stdout != "") {
						let m={};
						mtb.stdout.match(/\/media\/plex\/Plex-([^\/]+?)\s/g).map(a=>{return a.slice(17,-1);}).forEach(a=>{m[a]=true;});
						m=Object.keys(m);
						let msng=[];
						f.forEach(drv=>{
							if (!m.includes(drv)) msng.push(drv);
						});
						if (msng.length>0) {
							err=true;
							msgs=[
								msng[0]+" has been reported missing"+(msng.length>1?", it was last seen in the company of "+(msng.length>2?msng.slice(1,-1).join(", ")+", and ":"")+msng.slice(-1)[0]:"")+".",
								"be on the lookout for "+msng[0]+(msng.length>1?", last seen in the company of "+(msng.length>2?msng.slice(1,-1).join(", ")+", and ":"")+msng.slice(-1)[0]:"")+".",
								"little Bopeep has lost her sheep named "+msng[0]+(msng.length>1?", "+(msng.length>2?msng.slice(1,-1).join(", ")+", and ":"")+msng.slice(-1)[0]:"")+", and doesn't know where to find them! Would you be a dear, and seek them out?",
								"drive"+(msng.length>1?"s":"")+" "+msng[0]+(msng.length>1?", "+(msng.length>2?msng.slice(1,-1).join(", ")+", and ":"")+msng.slice(-1)[0]:"")+" "+(msng.length>1?"are":"is")+" on the lam... can you please find them?"
							];
							let say=msgs[Math.floor(Math.random()*msgs.length)];
							chan.send(say?staff+", "+say:"burps.");
						}
						else {
							err=false;
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
	catch (error) {
		console.log('There was an issue with drive checking.');
		console.error(error);
	}
}