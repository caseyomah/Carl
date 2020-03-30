const cat={tv:"show",movie:"movie",music:"song",audiobook:"audiobook",book:"book",rpg:"role-playing game",comic:"comic book"};
const lib={tv:"TV",movie:"Movie",music:"Music",audiobook:"Audiobook",book:"Book",rpg:"RPG",comic:"Comics"};
name=[];
const fs = require('fs');
const recfile="data/recommends.txt";
const namefile="data/names.txt";
parseCSV=function(file) {
    var contents=fs.readFileSync(file, 'utf8')
    while (contents.slice(-1)=="\n") {
        contents=contents.slice(0,-1);
    }
    arr=contents.split("\n");
    for (var a in arr) {
        arr[a]=arr[a].slice(1,-1).split('","');
    }
    return arr;
}
module.exports={
    load:function(u,c,t,r) {
        for (var a in list.length) {
            if (""+list[a].user.localeCompare(u, undefined, { sensitivity: 'base' })+list[a].cat.localeCompare(c, undefined, { sensitivity: 'base' })+list[a].title.localeCompare(t, undefined, { sensitivity: 'base' })!="000") {
                return false;
            }
        }
        list.push({user:u,cat:c,title:t,reason:r});
        return true;
    },
    getAll:function() {
        return list;
    },
    getRandom:function() {
        return module.exports.get.execute(message,Math.floor(Math.random()*list.length));
    },
    get:{
        name:"rec",
        rich:{
            color: 0xFFAA00,
            title: "Recommendation"
        },
        description:"Request a recommendation",
        execute(message,args) {
            if (args.length==0) do args=[Math.floor(Math.random()*list.length)];
            while (args[0]==this.lastShown);
            embed=() => {return this.rich;};
            if (Number(args[0])<list.length) {
                var r=list[Number(args[0])];
                embed.description="Have you seen the "+cat[r.cat]+" **"+r.title+"**? "+name[r.user]+" recommends it saying, '"+r.reason+'" Check it out in the '+lib[r.cat]+" library!";
                this.lastShown=r;
            }
            else embed.description="I only have "+list.length+" recommendations. I can't locate the one you asked for.";
            return message.reply({embed});
        }
    }
};
list=[];
var contents=fs.readFileSync(recfile, 'utf8')
while (contents.slice(-1)=="\n") {
    contents=contents.slice(0,-1);
}
recs=contents.split("\n");
for (var a in recs) {
    recs[a]=recs[a].slice(1,-1).split('","');
    module.exports.load(recs[a][0],recs[a][1],recs[a][2],recs[a][3],recs[a][4]);
}
