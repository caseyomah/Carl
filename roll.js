let min=4,max=100,count=10,def="1D20"
function calcMatch(s) {
	m=(s||this).match(/^(.*?)(\d*)d(\d+|%)(.*)$/i);
	if (m?.length != 5) {
		return undefined;
	}
	m[2]=m[2]||1;
	if (m[2]>count??10 || m[3]<min??2 || m[3]>max??100) {
		return undefined;
	}
    let total=0,raw=[],percent=false;
	if(m[3]=="%") {
		percent=true;
		m[3]=10;
	}
    for (let i=0;i<m[2];i++) {
        let save=Math.ceil(Math.random()*m[3]);
		if (percent) {
			save*=10;
		}
        raw.push(save);
        total+=save;
    }
    return {
        pre:`${m[1]}`,
        input:`${m[2]}D${m[3]}`,
        post:`${m[4]}`,
        raw:raw,
        sum:total,
        outsum:`${m[1]}${total}${m[4]}`,
        outraw:`${m[1]}(${raw.join("+")})${m[4]}`
    };
}
Object.defineProperty(String.prototype,"calcMatch",{get:calcMatch});
module.exports = {
	name: 'roll',
	aliases: ['dice'],
	description: `Rolls the given number of dice. Default is "${def}".`,
	usage: `\`!roll\`, \`!roll d6\`, \`!roll 1d20\`, between 1-${count} dice, ${min}-${max} sides.`,
	execute(msg, args) {
		let text="";
		if (args.length==0) {
            args.push(def);
        }
		while (args.length>0) {
			let dice=[],raws=[],sums=[],roll=args.shift(),error=true;
			while(calcMatch(roll)) {
				roll=calcMatch(roll);
				dice.push(roll.input);
				raws.push(roll.raw);
				sums.push(roll.sum);
				roll=roll.outraw;
				error=false;
			}
			if (text.length>2) {
				text +="\n\n";
			}
			if (error) {
				text+="Error";
			}
			else {
				let rol1=roll;
				[["{","abs("],["}",")"],["[[]","sqrt("],["]",")"]]
					.forEach(r=>{rol1=rol1.replace(RegExp(r[0],"g"),r[1]);});
				text+=`You rolled ${dice.length>1?dice.slice(0,-1).join(", "):dice[0]}${dice.length>2?",":""}${dice.length>1?" and "+dice.slice(-1)[0]:""}...\n`
				text+=`for (${raws.length>1?raws.slice(0,-1).map(r=>r.join("+")).join("), ("):raws.map(r=>r.join("+"))[0]}${raws.length>2?"),":rows.length>1?")":""}${raws.length>1?" and ("+raws.map(r=>r.join("+")).slice(-1)[0]:""}).\n`
				with(Math) text+=`Total of ${roll} is ${(rol1.match(/[a-z]+/gi)||[]).map(p=>this[p]=Math.hasOwnProperty(p)).every(v=>v===true)?eval(rol1):"unable to be calculated"}.`;
			}
		}
		msg.channel.send(`${msg.member.nickname||msg.author.username}, ${text}`,msg.channel);
	}
}