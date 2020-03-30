module.exports={
    add:function(name,id) {
        this[name]=name+":"+id;
    },
    find:function(id) {
        return onconn.guild.emojis.find(emoji => emoji.name === id);
    },
    use:function(name) {
        return "<"+this[name]+">";
    }
}
