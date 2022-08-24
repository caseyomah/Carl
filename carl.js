/*
    Future Plans:
*/

// Set constants
const typing=require("./typing.js");
const findPlugins=function(client,command,plg) {
    let [prop,key]=plg;
    (plg.length>2?true:("execute" in command) && (key in command))?client[prop].set(command[key],command):Object.keys(command).forEach((c) => {findPlugins(client,command[c],plg);});
}

const runSocials=function(msg) {
    say=[];
    client.socials.forEach(social => {if (social.trigger(msg)) say.push(social.execute(msg));});
    if (say.length > 0) {
        if (Array.isArray(say)) {
            say=say.flat();
            i=Math.floor(Math.random()*say.length);
            if (typeof say[i] == "string") typing(say[i],msg.channel);
            else console.error(`Nothing to say:\nindex ${i} of:\n${say}`);
        }
        else if (typeof say == "string") typing(say,msg.channel);
    }
}

const fs=require('fs');
global.Discord=require('discord.js');
const {prefix,token}=require('/home/plex/bots/authCarl.json');
global.client=new Discord.Client(Discord.Intents.ALL);
// folder/type, key
let plugins=[["commands","name"],["socials","trigger"],["core","name",0]];
plugins.forEach(plg=>{
    client[plg[0]]=new Discord.Collection();
    let tmp=fs.readdirSync("./"+plg[0]).filter(file => file.endsWith(".js"));
    for (const file of tmp) findPlugins(client,require(`./${plg[0]}/${file}`),plg);
});
const Ch = require('./core/ch.js');
const Em = require('./core/em.js');
const Role = require('./core/role.js');
const Recs = require("./commands/recs.js");

// Define Functions
function Mbr(mem,leadcap) {
    console.warn("Mbr in use.");
    return `${mem}`||((leadcap?"F":"f")+"riend");
}

// acknowledge ready state
client.on('ready', () => {
    // console.log('Logged in as ${client.user.tag)!');
	// define Ch and Role objects.
    Ch.set("bot","675864898617606184");
    Ch.set("help","583979972578770945");
    Ch.set("test","681380531493142533");
    Ch.set("welcome","581340165520359424");
    Ch.set("plex","581346715852865547");
    Ch.set("calibre","590195078765608961");
    Ch.set("rules","581352180355694603");
    Role.set("casting","581334517151825920");
	Role.set("staff","676660602688765962");

    // define frequently used channels.
    global.onconn = Ch.get(client,"bot");
    global.offconn = Ch.get(client,"test");
    global.newconn = Ch.get(client,"welcome");

    // uncomment below to set client to send to testing channel. (Ushers/Producer only)
    // onconn=offconn;

    // Links to roles and channels.
    global.CastingRef=Role.ref("CaStInG");
    global.RulesRef=Ch.ref("rules");
    global.CalibreRef=Ch.ref("calibre");
    global.PlexRef=Ch.ref("plex");
	global.HelpRef=Ch.ref("help");

    // Wakeup message.
    var say=new Array("Sorry, I must have dozed off for a bit.","Please excuse me, the best scene just finished. I'm here now.","My apologies, I was a bit distracted.");
	typing(say[Math.floor(Math.random()*say.length)],onconn);
	client.setInterval(()=> require('./drvchk.js')(Ch.get(client,"help"),Role.ref("staff")),350000);
});

// Member greeting
client.on('guildMemberAdd', (member) => {
    typing(`${member}, welcome! Please read everything in ${RulesRef}, ${PlexRef}, and ${CalibreRef}, then come back here and tell me, "**I understand**" to continue.`,newconn);
    member.roles.add("701907216479027281");
});

// Reply to messages
client.on('message', msg => {
    if (client.user.id !== msg.author.id) {
		require("./asyouwish.js")(msg);
        const args = msg.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        if (msg.content.startsWith(`${prefix}${commandName}`) && client.commands.has(commandName)) {
            const command=client.commands.get(commandName);
			if (command.args && !args.length) {
				let reply = `You didn't provide any arguments, ${msg.author}!`;
				if (command.usage) {
					reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
				}
				return typing(reply,msg.channel);
			}
			else command.execute(msg, args);
        }
		
        // Plain text social responses
        else {
            runSocials(msg);
        }
		
		 // help text
		if (msg.content.match(/^!help/i)||msg.content.match(/^help.*carl.*/i)) {
			typing(`${msg.author}, here's a quick help list!\n\n!ping ["plex"/"calibre"/"ftp"/"all"/""] - Asks me the status of various services.\n!tips - Asks me for a random tip.\n!help - Tells me to display this message.\n\nIf you need assistance or have a suggestion for my service, let a member of our Casting staff know in ${HelpRef}.`,msg.channel);
		}
    }
});

client.login(token);
