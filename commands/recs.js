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
                    console.log();
            if (args.length==0) do args=[Math.floor(Math.random()*list.length)];
            while (args[0]==this.lastShown && list.length > 1);
            var embed=(() => {return this.rich})();
            if (Number(args[0])<list.length) {
                var r=list[Number(args[0])];
                embed.description="Have you seen the "+cat[r.cat]+" **"+r.title+"**? "+name[r.user]+" recommends it saying, '"+r.reason+'" Check it out in the '+lib[r.cat]+" library!";
                this.lastShown=r;
            }
            else embed.description="I only have "+list.length.toLocaleString()+" recommendations. I can't locate the one you asked for.";
            message.channel.send({embed});
        }
    },
    recadd:{
        name:"recadd",
        description:"Tell me a recommendation to offer later",
        execute(message,args) {
            args=args.join(" ").slice(1,-1).split('" "');
            args.unshift(message.author.id);
            if (args.length==4) {
                if (load(args)) {
                    message.reply("Thank you for your recommendation.");
                    // add/update name lookup
                    if (!name[args[0]]) {
                        name[args[0]]=message.member.nickname||message.author.username;
                        // write namefile
                        fs.fileAppendSync(namefile,'"'+args[0]+'"'+name[args[0]]+"\n");
                    }
                    // write recfile
                    fs.fileWriteSync(recfile,list.map((a) => {return '"'+a.join('","')+'"'}).join("\n")+"\n");
                }
                else {
                    
                }
            }
            else {
                cats=cat.keys()
                //message.reply('To add a recommendation tell me `!recadd "`**');
            }
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
