/*
    ToDo:
        Add keyword startsWith search (count|user|category|title|description] (Falls through to full data (not user) search
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
const CSV=require('./csv.js');
//const f/s = require('fs');
const cat={tv:"show",movie:"movie",music:"song",audiobook:"audiobook",book:"book",rpg:"role-playing game",comic:"comic book"};
const lib={tv:"TV English",movie:"Movies",music:"Music",audiobook:"Audiobook",book:"Book",rpg:"RPG",comic:"Comics"};
const recfile="data/recommends.txt";
const namefile="data/names.txt";
var compare={};
list=[];
//list.toString=()=>{console.log(this);};
class Recommendation {
    constructor(u,c,t,r) {
        this.user=u;
        this.cat=c;
        this.title=t;
        this.reason=r;
    }
    toString() {
        return (Object.values(this)).join('","');
    };

}
function parseCSV(file,a) {
    return CSV.readArraySync(file,'utf8',a);
}
CSV.readArraySync(recfile).forEach(load);
name=CSV.readArraySync(namefile,'utf8',1);
module.exports={
    rec:{
        name:"rec",
        description:"Request a recommendation",
        usage:"[<keyword> [...<keyword>]] [<searchTerm>]",
        rich:{
            color: 0xFF9900,
            title: "Recommendation"
        },
        execute(message,args) {
            var keywords=["counts","username","type","name","description"];
            var opts={};
            while (matchedKeys=keywords.filter((word)=>{return word.startsWith(args[0])}),matchedKeys.length&&args[0]!="*") {
                opts[matchedKeys[0]]=1;
                args.shift();
            }
            if (args.length==0) do args=[Math.floor(Math.random()*list.length)];
            while (args[0]==this.lastShown&&list.length>1);
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
                embed.description="Have you seen the "+cat[r.cat]+" **"+r.title+"**? "+name[r.user]+' recommends it saying, "'+r.reason+'" Check it out in the '+lib[r.cat]+" library!";
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
        usage:'"<type>" "<name>" "<description>"\n\nValid types are: '+Object.keys(cat).join(", "),
        args:true,
        execute(message,args) {
            args=message.content.slice(8).slice(1,-1).split('" "');
            args.unshift(message.author.id);
            if (args.length==4) {
                args[1]=args[1].toLowerCase();
                if (load(args)) {
                    message.reply("thank you for your recommendation, added as recommendation "+list.length+".");
                    // add/update name lookup
                    if (!name[args[0]]) {
                        name[args[0]]=message.member.nickname||message.author.username;
                        // write namefile
                        CSV.writeObjectSync(namefile,name);
                    }
                    // write recfile
                    CSV.writeArraySync(recfile,list);
                }
                else {
                    message.reply("I'm sorry, there was a problem adding your recommendation, have you added it before?");
                }
            }
            else {
                message.reply('to add a recommendation tell me `!recadd '+this.usage+'`');
            }
        }
    },
    recname:{
        name:"recname",
        description:"Change how your name is displayed on your recommendations",
        usage:"<new name>",
        args:true,
        execute(message,args) {
            args=message.content.slice(9);
            name[message.author.id]=args;
            CSV.writeObjectSync(namefile,name);
            message.reply('Your recommendation display name has been changed to "'+args+'"');
        }
    }
};
function load(rec) {
    var o=new Recommendation(...rec);
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
