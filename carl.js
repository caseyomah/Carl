/*
    Future Plans:
        Ch and Role search by name
        Fix function Em (Figure out emoji lookup)
        Split Recommendations (Rec) out from Tips
		Make separate docs for: TV, movies, books, misc
		Call with `!rec TV` or `!rec`
		If no sub specified, randomly chose one of the available docs
		Then once in doc randomly choose one line and return it.
		Create an interface for adding new entries to these from Discord (Crypto should be able to help)
*/

// Set constants
findCommands=function(client,command) {
    if (Object.keys(command).includes("name") && Object.keys(command).includes("execute")) client.commands.set(command.name, command);
    else Object.keys(command).forEach((c) => {findCommands(client,command[c]);});
}

const fs=require('fs');
const Discord=require('discord.js');
const {prefix,token}=require('/home/plex/bots/authCarl.json');
const client=new Discord.Client();
client.commands=new Discord.Collection();
const commandFiles=fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) findCommands(client,require(`./commands/${file}`));
const Ch = require('./commands/ch.js');
const Em = require('./commands/em.js');
const Role = require('./commands/role.js');
const Recs = require("./commands/recs.js");

// Define Functions
function Mbr(mem,leadcap) {
    console.error("Mbr in use.");
    return leadcap?mem||"Friend":mem||"friend";
}

// acknowledge ready state
client.on('ready', () => {
    // console.log('Logged in as ${client.user.tag)!');
    
    //define Ch and Role objects.
    Ch.set("bot","675864898617606184");
    Ch.set("help","583979972578770945");
    Ch.set("test","681380531493142533");
    Ch.set("welcome","581340165520359424");
    Ch.set("plex","581346715852865547");
    Ch.set("calibre","590195078765608961");
    Ch.set("rules","581352180355694603");
    Role.set("casting","581334517151825920");
    
    // define frequently used channels.
    onconn = Ch.get(client,"bot");
    offconn = Ch.get(client,"test");
    newconn = Ch.get(client,"welcome");

    // uncomment below to set client to send to testing channel. (Ushers/Producer only)
    // onconn=offconn;

    // Links to roles and channels.
    CastingRef=Role.ref("CaStInG");
    RulesRef=Ch.ref("rules");
    CalibreRef=Ch.ref("calibre");
    PlexRef=Ch.ref("plex");
	HelpRef=Ch.ref("help");

    // Wakeup message.
    var say=new Array("Sorry, I must have dozed off for a bit.","Please excuse me, the best scene just finished. I'm here now.","My apologies, I was a bit distracted.");
	onconn.send(say[Math.floor(Math.random()*say.length)]);
});

// Reply to messages
client.on('message', msg => {
    if (client.user.id !== msg.author.id) {
        var input=msg.content.toLowerCase();
        const args = msg.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        if (client.commands.has(commandName)) {
            const command=client.commands.get(commandName);
            try {
                command.execute(msg, args);
            } catch (error) {
                console.error(error);
                console.log('there was an error trying to execute '+command+'!');
            }
        }
        //Plain text social responses
        if (input.match(/^h(e(llo)?|i|y)a?.* carl.*/)) {
            var say=new Array("Hello, "+Mbr(msg.member,0)+", is there something I can help you with?");
            msg.channel.send(say[Math.floor(Math.random()*say.length)]);
        }
        if (input.match(/^(good ?)?(bye|n(ight|ite)).* carl.*/)) {
            var say=new Array("Hope to see you again soon.","Hope to see you again soon, "+Mbr(msg.member,0)+".");
            msg.channel.send(say[Math.floor(Math.random()*say.length)]);
        }
        if (input.match(/morning.* carl.*/)) {
            var say=new Array("Great to see you again.","Great to see you again, "+Mbr(msg.member,0)+".");
            msg.channel.send(say[Math.floor(Math.random()*say.length)]);
        }
        if (input.match(/thank(s.*| ?you.*) carl.*/)) {
            var say=new Array("It is a pleasure to be of service.","You are most welcome.");
            msg.channel.send(say[Math.floor(Math.random()*say.length)]);
        }
        
        // Bot banter
        if (input=="sorry, i was doing some uhh... nerdy stuff." && Math.floor(Math.random() * 10)==0) {
            var say=new Array("Oh my!","I'm sure I don't want to know.","You don't say...","My goodness.","Was that Star Trek or Star Wars?");
            msg.channel.send(say[Math.floor(Math.random()*say.length)]);
        }
        //// Programatic triggers
        // emote
        if (input.match(/^!emote/)) {
            var em=input.slice(7);
            if (em.length>0) {
                em=em.split(" ");
                for (var a=0;a<em.length;a++) {
                    msg.channel.send("Emote:"+em[a]+"="+Em.find(em[a]));
                }
            }
        }

        // New Member follow-up
        if (input.match(/^\"?i understand.?\"?$/) && msg.channel == newconn) {
            newconn.send("Done? Great! Sorry to put you through that mess, but it was pretty important. Now, I'll slip a note to our "+CastingRef+" department. They should be by soon to answer any questions and let you in.");
            setTimeout(function() {newconn.send("Oh, I almost forgot! Once you're in, if you need help, be sure to ask in the "+HelpRef+" channel. You can also type !help to see what I can help you with.")},5000);
        }
        
        // recs reply
        /*
        if (args=input.match(/^!recs? ?(.*)?/)) {
            if (args[1]) {
                say= (Recs.get(args[1]));
            }
            else {
                say= (Recs.getRandom());
            }
            msg.reply(new Discord.RichEmbed()
			.setColor('#FFAA00')
			.setDescription(say));
            say=undefined;
        }
        
        
        */
        //tips reply
        if (input.match(/^!tip/)) {
            var say=new Array(
                "📺 🎞️ Did you know? you can get access to the video library by sending a DM to Vaesse that includes your Plex email address, and a request for access.",
                "📚 🎲 💥 Did you know? You can get access to our library of E-Books by requesting access to Calibre in the "+HelpRef+" channel!",
                "Need FTP access? You can request it in the "+HelpRef+" channel!",
                "📖 Looking for audiobooks? Check in the Audiobooks library! If you don't see it, check under the Music library. Still can't find it? Ask for help in the "+HelpRef+" channel, and someone will assist you soon!",
                "Having technical issues, or something is not working as expected? Ask for assistance in the "+HelpRef+" channel, and one of our volunteer Tech Support reps will get back to you soon!",
                "Have a show, movie, album, or book you want to recommend to everyone?  Let us know what you love and why in the "+HelpRef+" channel, and we'll add a tip!"
            );
            var embed = new Discord.RichEmbed()
			.setColor('#00AA00')
			.setDescription(say[Math.floor(Math.random()*say.length)]);
            msg.channel.send({ embed });
        }
        // "🇹 🇮 🇵 Have you seen the show **Nikita**? Vaesse recommends it saying, \"This reboot of 'La Femme Nikita' is an action-thriller. All the characters are amazing!\" Check it out in the TV library!"
        
        /* Unicode Symbols for various services
        *	 📺   TV
        *	 🎞️  Movies
        *	 🎵   Music
        *	 📖   Audiobook
        *	 📚   Book
        *	 🎲   RPG
        *	 💥   Comics
        */
        
        
        // help text
        if (input.match(/^!help/)||input.match(/^help.*carl.*/)) {
            msg.channel.send(msg.author+', here\'s a quick help list!\n\n!ping ["plex"/"calibre"/"ftp"/"all"/""] - Asks me the status of various services.\n!tips - Asks me for a random tip.\n!help - Tells me to display this message.\n\nIf you need assistance or have a suggestion for my service, let a member of our Casting staff know in '+HelpRef+'.');
        }
    }
});

// Member greeting
client.on('guildMemberAdd', member => {
    newconn.send(member+", welcome! Please read everything in "+RulesRef+", "+PlexRef+", and "+CalibreRef+", then come back here and tell me, \"**I understand**,\" to continue.");
});
client.login(token);
