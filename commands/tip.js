module.exports={
    name:"tip",
    description:"Request a tip",
    rich:{
        color:0x00AA00,
        title:"tip"
    },
    execute(msg,args) {
                var say=new Array(
                    "📺 🎞️ Did you know? you can get access to the video library by sending a DM to Vaesse that includes your Plex email address, and a request for access.",
                    "📚 🎲 💥 Did you know? You can get access to our library of E-Books by requesting access to Calibre in the "+HelpRef+" channel!",
                    "Need FTP access? You can request it in the "+HelpRef+" channel!",
                    "📖 Looking for audiobooks? Check in the Audiobooks library! If you don't see it, check under the Music library. Still can't find it? Ask for help in the "+HelpRef+" channel, and someone will assist you soon!",
                    "Having technical issues, or something is not working as expected? Ask for assistance in the "+HelpRef+" channel, and one of our volunteer Tech Support reps will get back to you soon!",
                    "Have a show, movie, album, or book you want to recommend to everyone?  Let us know what you love and why in the "+HelpRef+" channel, and we'll add a tip!"
                );
                var embed=(()=>{return this.rich})();                embed.description=say[Math.floor(Math.random()*say.length)];
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
}
