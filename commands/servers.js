function Check(srv,chan,pass) {
    var shellCommand = require("linux-shell-command").shellCommand;
    for (var s=0;s<Server.length;s++) {
        if (srv == Server[s]) {
            var sc = shellCommand("systemctl status "+ServerProc[s]+"|grep Active|while read a b c;do echo $b;done");
            sc.execute()
            .then(success => {
                for (var r in Server) {
                    if(srv==Server[r]) s=r;
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
        else if (srv==ServerProc[s]) {
            Check(Server[s],chan);
        }
        else if (srv==""||srv=="all") {
            Check(Server[s],chan,"all");
        }
    }
    if(chan) Report(srv,chan);
}
function Mbr(mem,leadcap) {
    return leadcap?mem||"Friend":mem||"friend";
}
function Report(srv,chan,tag) {
    var ch=chan||onconn;
    if (srv==""||srv=="all") {
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
        if (srv=="plex"||srv=="calibre") {
            if (Online[srv]) stat="open.";
            else stat="closed.";
        }
        else {
            if (Online[srv]) stat="up.";
            else stat="down.";
        }
        if(code[srv]&&stat) {
            if (tag) {
                ch.send(tag+", "+code[srv]+" is "+stat);
            }
            else {
                ch.send(code[srv].substr(0,1).toUpperCase()+code[srv].substr(1)+" is "+stat);
            }
        }
    }
]
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
    for (srv in Server) {
        Online[Server[srv]]="unknown";
    }
    // First check
    Check('');

    // Repeat checks
    setInterval(function() {Check('')},5000);
        // ping reply
        if (input.match(/^!ping/)) {
            var srv=input.slice(6);
            if (srv.length>0) {
                srv=srv.split(" ");
                if (srv.length==3 && srv[1]=="for") {
                    Report(srv[0],msg.channel,srv[2]);
                }
                else {
                    for (var a=0;a<srv.length;a++) {
                        Report(srv[a],msg.channel);
                    }
                }
            }
            else Report("",msg.channel);
        }
        
