const config = require('../config');

module.exports = (client,message) => {
    if (message.content.startsWith(config.prefix)) {
        let args = message.content.slice(config.prefix.length).split(' ');
        let command = args.shift().toLowerCase();

        if(command=="temp"&&args[0]){
            let category = message.guild.channels.cache.find(c => c.name == "Temp Channels" && c.type == "category");
            if(args[0]=="v"){
                message.guild.channels.create(args[1]||"put a name bastard!", {type: 'voice', reason: 'added a temp voice channel'})
                    .then(channel=>{
                        channel.setParent(category.id)
                        let interval = setInterval(()=>{
                            console.log(channel.members.size)
                            if(channel.members.size==0){
                                channel.delete();
                                clearInterval(interval)
                            }
                        },60000);
                    })
                    .catch(console.error)
            }
            if(args[0]=="t"){
                message.guild.channels.create(args[1]||"put a name bastard!", {type: 'text', reason: 'added a temp text channel'})
                    .then(channel=>{
                        channel.setParent(category.id)
                        channel.send("Chat temporário criado com sucesso! Após 10 minutos de inutilização, irá ser removido!")
                        let interval = setInterval(()=>{
                            channel.messages.fetch({ limit: 1 }).then(messages => {
                            let lastMessage = messages.first();
                                if(new Date().getTime() - lastMessage.createdTimestamp > 600000){
                                    channel.delete()
                                    clearInterval(interval)
                                }
                            })
                            .catch(console.error);
                        },600000);
                    })
                    .catch(console.error)
            }
        }
    }
}