function Check(args,chan,pass) {
    var shellCommand = require("linux-shell-command").shellCommand;
    for (var s=0;s<Server.length;s++) {
        if (args == Server[s]) {
            var sc = shellCommand("systemctl status "+ServerProc[s]+"|grep Active|while read a b c;do echo $b;done");
            sc.execute()
            .then(success => {
                for (var r in Server) {
                    if(args==Server[r]) s=r;
                }
                if (success === true && sc.stdout != "") {
                    if (sc.stdout.slice(0,6) == "active") {
                        if (Online[Server[s]] === false&&OnMsg[s]) {
                            var say=new Array(code[Server[s]].slice(0,1).toUpperCase()+code[Server[s]].slice(1)+" has just reopened.");
                            onconn.send(say[Math.floor(Math.random()*say.length)]);
                        }
                        Online[Server[s]]=true;
                    }
                    else if (sc.stdout.slice(0,6) != "active") {
                        if (Online[Server[s]] === true&&OffMsg[s]) {
                            var say=new Array(code[Server[s]].slice(0,1).toUpperCase()+code[Server[s]].slice(1)+" has just closed.");
                            onconn.send(say[Math.floor(Math.random()*say.length)]);
                        }
                        Online[Server[s]]=false;
                    }
                }
            })
            .catch(e => {
                console.error(e);
            });
        }
        else if (args==ServerProc[s]) {
            Check(Server[s],chan);
        }
        else if (args==""||args=="all") {
            Check(Server[s],chan,"all");
        }
    }
    if(chan) Report(args,chan);
}
function Mbr(mem,leadcap) {
    return leadcap?mem||"Friend":mem||"friend";
}
function Report(args,chan,tag) {
    var ch=chan||onconn;
    if (args==""||args=="all") {
        if (Online["plex"] && Online["calibre"]) {
            var say=new Array("The theater and library are open. Everything appears to be running smoothly.");
            ch.send(say[Math.floor(Math.random()*say.length)]);
        }
        else if (Online["plex"] && !Online["calibre"]) {
            var say=new Array("The theater is open, however the library is currently closed... likely for restocking.");
            ch.send(say[Math.floor(Math.random()*say.length)]);
        }
        else if (!Online["plex"] && Online["calibre"]) {
            var say=new Array("The theater is currently closed, would you like to visit the library instead?");
            ch.send(say[Math.floor(Math.random()*say.length)]);
        }
        else if(Online["ftp"]) {
            var say=new Array("Both the theater and library are closed. Have you considered asking one of our @Casting staff about FTP access?");
            ch.send(say[Math.floor(Math.random()*say.length)]);
        }
        else {
            Casting = client.channel.server.roles.mention("name","Casting");
            var say=new Array(CastingRef+", we appear to be running by candlelight. Nothing is working. Why am I not at home?");
            ch.send(say[Math.floor(Math.random()*say.length)]);
        }
    }
    else {
        var stat;
        if (args=="plex"||args=="calibre") {
            if (Online[args]) stat="open.";
            else stat="closed.";
        }
        else {
            if (Online[args]) stat="up.";
            else stat="down.";
        }
        if(code[args]&&stat) {
            if (tag) {
                ch.send(tag+", "+code[args]+" is "+stat);
            }
            else {
                ch.send(code[args].substr(0,1).toUpperCase()+code[args].substr(1)+" is "+stat);
            }
        }
    }
}
    // Arrays of services and other related sundries.
    Server=new Array("plex","calibre","ftp");
    ServerProc=new Array("plexmediaserver","calibre-server","proftpd");
    code=new Array();
    code["plex"]="the theater";
    code["calibre"]="the library";
    code["ftp"]="FTP access";
    OnMsg=new Array(true,true,false);
    OffMsg=new Array(true,true,false);
    Online=new Array();

    // Fill Online status array with indeterminant state.
    for (args in Server) {
        Online[Server[args]]="unknown";
    }
    // First check
    Check('');

    // Repeat checks
    setInterval(function() {Check('')},5000);
        // ping reply
module.exports={
    name:"ping",
    description:"Check the status of servers",
    execute(message,args) {
        if (args.length==3 && args[1]=="for") {
            Report(args[0],message.channel,args[2]);
        }
        else if (args.length==0) {
            Report("",message.channel);
        }
        else {
            args.forEach((a)=> {
                Report(a,message.channel);
            });
        }
    }
}
        
