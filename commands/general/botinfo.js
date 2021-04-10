module.exports = {
    name: 'botinfo',
    aliases: ['bi'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}botinfo\``)
            .setDescription(`**Usage:** \`${config.client.prefix}botinfo\`\n**Alias:** \`${config.client.prefix}bi\`\n**Category:** General`)
            .addField('Permission(s) Required', '\`SEND_MESSAGES\`')
            .setThumbnail(message.guild.iconURL)
            .setFooter('[] = Optional Arguments • <> = Required Arguments')
            .setColor(config.client.color)

        // Checking Permission
        if (message.author.id !== config.client.owner) {
            if (!message.member.permissions.has('ADMINISTRATOR') && !message.member.permissions.has('SEND_MESSAGES')) {
                return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions')) && message.channel.send(usageEmbed)
            }
        }

        // CODE GOES HERE 🡫

        let embed = new Discord.RichEmbed()
            .setTitle('Bot Information')
            .setURL('https://discord.gg/uHx44tp')
            .setDescription('This bot can be purchaed [here](https://discord.gg/uHx44tp).')
            .addField('Name', config.server.name, true)
            .addField('Developer', 'yhGG#0001', true)
            .addField('Version', 'v2.1.0', true)
            .addField('Guilds', client.guilds.size, true)
            .addField('Users', client.users.size, true)
            .addField('Channels', client.channels.size, true)
            .setThumbnail('https://cdn.discordapp.com/attachments/750147035243610205/797299652957044816/energyLetter.png')
            .setFooter(`© Copyright 2021, Energy Development. All rights reserved.`, `https://cdn.discordapp.com/attachments/750147035243610205/797299652957044816/energyLetter.png`)
            .setColor(config.client.color)

        message.channel.send(embed)
    }
}