const { Client, MessageEmbed } = require('discord.js');
const config = require('./config');
const commands = require('./help');
const handleMessage = require('./messages');

let bot = new Client({
  presence: {
    status: 'online',
    activity: {
      name: `${config.prefix}help`,
      type: 'LISTENING'
    }
  }
});

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}.`);

    bot.channels.cache.find(channel => channel.name=="bot_testing").send("!a")
})

bot.on('message', async message => {
    handleMessage(bot,message);
});

bot.on('guildMemberAdd', member => {
    let admin = bot.guild.members.cache.get('351506093387677706')
    admin.send(member.username+" has join the server, give him a role!")
})

bot.on('messageReactionAdd', (reaction, user) => {
        let message = reaction.message, emoji = reaction.emoji;

        if (emoji.name == '✅') {
                // We don't have the member, but only the user...
                // Thanks to the previous part, we know how to fetch it
                message.guild.fetchMember(user.id).then(member => {
                        member.addRole('role_id');
                });
        }

        else if (emoji.name == '❎') {
                message.guild.fetchMember(user.id).then(member => {
                        member.removeRole('role_id');
                });
        }

        // Remove the user's reaction
        reaction.remove(user);
});

require('./server')();
bot.login(config.token);