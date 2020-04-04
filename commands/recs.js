/*
    ToDo:
        Add keyword startsWith search (user|category|title|description] (Falls through to full data (not user) search
*/
/*
    RichEmbed:{
        title: undefined,
        description: undefined,
        url: undefined,
        color: undefined,
        author: undefined,
        timestamp: undefined,
        fields: [],
        thumbnail: undefined,
        image: undefined,
        footer: undefined,
        file: undefined,
        files: []
    },
*/
const fs = require('fs');
const cat={tv:"show",movie:"movie",music:"song",audiobook:"audiobook",book:"book",rpg:"role-playing game",comic:"comic book"};
const lib={tv:"TV English",movie:"Movies",music:"Music",audiobook:"Audiobook",book:"Book",rpg:"RPG",comic:"Comics"};
const recfile="data/recommends.txt";
const namefile="data/names.txt";
var compare={};
list=[];

function parseCSV(file,a) {
    var contents=fs.readFileSync(file, 'utf8');
    while (contents.slice(-1)=="\n") contents=contents.slice(0,-1);
    arr=contents.split("\n").map((line)=>{return line.slice(1,-1).split('","');});
    if (a) {
        aarr=[];
        arr.forEach((line)=>{var key=line.shift();aarr[key]=line.length==1?line[0]:line;});
        arr=aarr;
    }
    return arr;
}
parseCSV(recfile).forEach(load);
name=parseCSV(namefile,1);
module.exports={
    rec:{
        name:"rec",
        rich:{
            color: 0xFF9900,
            title: "Recommendation"
        },
        description:"Request a recommendation",
        execute(message,args) {
            if (args.length==0) do args=[Math.floor(Math.random()*list.length)];
            while (args[0]==this.lastShown && list.length > 1);
            var embed=(() => {return this.rich})();
            if (!isNaN(args[0]) && Number(args[0])<=list.length) {
                var r=list[Number(--args[0])];
                embed.description="Have you seen the "+cat[r.cat]+" **"+r.title+"**? "+name[r.user]+" recommends it saying, '"+r.reason+'" Check it out in the '+lib[r.cat]+" library!";
                this.lastShown=r;
            }
            else {
                var found=list.filter((o)=>{return Object.values(o).join(",").toLowerCase().includes(args.join(" ").toLowerCase());})
                if (found.length>=1) { [];
                    var r=found[Math.floor(Math.random()*found.length)];
                embed.description="Have you seen the "+cat[r.cat]+" **"+r.title+"**? "+name[r.user]+" recommends it saying, '"+r.reason+'" Check it out in the '+lib[r.cat]+" library!";
                this.lastShown=r;
                }
                else {
                    embed.description="I only have "+list.length.toLocaleString()+" recommendations. I can't locate the one you asked for.";
                }
            }
            message.channel.send({embed});
        }
    },
    recadd:{
        name:"recadd",
        description:"Tell me a recommendation to offer later",
        execute(message,args) {
            args=message.content.slice(8).slice(1,-1).split('" "');
            args.unshift(message.author.id);
            if (args.length==4) {
                args[1]=args[1].toLowerCase();  
                if (load(args)) {
                    message.reply("Thank you for your recommendation.");
                    // add/update name lookup
                    if (!name[args[0]]) {
                        name[args[0]]=message.member.nickname||message.author.username;
                        // write namefile
                        fs.appendFileSync(namefile,'"'+args[0]+'","'+name[args[0]]+'"\n');
                    }
                    // write recfile
                    fs.writeFileSync(recfile,list.map((a)=>{return '"'+Object.values(a).join('","')+'"';}).join("\n")+"\n");
                }
                else {
                    
                }
            }
            else {
                cats=Object.keys(cat);
                //message.reply('To add a recommendation tell me `!recadd "`**');
            }
        }
    },
    recname:{
        name:"recname",
        description:"Change how your name is displayed on your recommendations",
        execute(message,args) {
            args=message.content.slice(9);
            name[message.author.id]=args;
            fs.appendFileSync(namefile,'"'+message.author.id+'","'+name[message.author.id]+'"\n');
            message.reply('Your recommendation display name has been changed to "'+args+'"');
        }
    }
};
function load(rec) {
    var o={};
    [o.user,o.cat,o.title,o.reason]=rec;
    for (a of list) {
        Object.keys(a).forEach((b) => {
        if ((""+a[b]).localeCompare(o[b], undefined, { sensitivity: 'base' })==0) compare[b]+=1;
        });
    }
    if ((compare.user&&compare.cat&&compare.title)||(compare.user&&compare.reason)) {
        return false;
    }
    return list.push(o);
}

/*
var contents=fs.readFileSync(recfile, 'utf8')
while (contents.slice(-1)=="\n") contents=contents.slice(0,-1);
recs=contents.split("\n");
for (var a in recs) {
    recs[a]=recs[a].slice(1,-1).split('","');
    load(recs[a]);
}
*/
