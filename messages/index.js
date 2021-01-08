const config = require('../config');
const Database = require("@replit/database")

module.exports = (client,message) => {
    //console.log(message.author.id);
    
    let msm = message.content.split(' ');
    //console.log(msm);
    const db = new Database();
    db.list("pila_").then(sinonimos => {
        for(let i=0;i<msm.length;i++){
            if(sinonimos.find(e=>e.replace("pila_", "")==msm[i])){
                message.reply('\n.................▄▄▄▄▄\n..............▄▌░░░░▐▄\n............▐░░░░░░░▌\n....... ▄█▓░░░░░░▓█▄\n....▄▀░░▐░░░░░░▌░▒▌\n.▐░░░░▐░░░░░░▌░░░▌\n▐ ░░░░▐░░░░░░▌░░░▐\n▐ ▒░░░ ▐░░░░░░▌░▒▒▐\n▐ ▒░░░░▐░░░░░░▌░▒▐\n..▀▄▒▒▒▒▐░░░░░░▌▄▀\n........ ▀▀▀ ▐░░░░░░▌\n.................▐░░░░░░▌\n.................▐░░░░░░▌\n.................▐░░░░░░▌\n.................▐░░░░░░▌\n................▐▄▀▀▀▀▀▄▌\n...............▐▒▒▒▒▒▒▒▒▌\n...............▐▒▒▒▒▒▒▒▒▌\n................▐▒▒▒▒▒▒▒▌\n..................▀▌▒▀▒▐▀');
            }
        }
    })

    if (message.content.startsWith(config.prefix)) {
        let args = message.content.slice(config.prefix.length).split(' ');
        let command = args.shift().toLowerCase();

        if(command=="pila"&&args[0]){
            const db = new Database();
            db.set("pila_"+args[0],args[0]).then(()=>{
                db.list("pila_").then(matches => console.log(matches));
            })
        }
        if(command=='rmpila'&&args[0]){
            const db = new Database();
            db.list("pila_").then(matches => {
                console.log(1,args[0])
                console.log(matches);
                const f = matches.find(e=>e=="pila_"+args[0]);
                console.log(f)
                if(f){
                    db.delete(f).then(()=>{
                        db.list("pila_").then(matches => console.log(matches));
                    })
                }
            });
        }
        if(command=='pilalist'){
            const db = new Database();
            db.list("pila_").then(matches => {
                let sins = [];
                for(let i=0;i<matches.length;i++){
                    sins.push(matches[i].replace("pila_",""))
                }
                //console.log(sins)
                message.reply("Sinonimos:```javascript\n[\n"+sins.join(',\n')+"\n]```")
            });
        }

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