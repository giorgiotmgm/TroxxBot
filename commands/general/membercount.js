module.exports = {
    name: 'membercount',
    aliases: ['mc'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}membercount\``)
            .setDescription(`**Usage:** \`${config.client.prefix}membercount\`\n**Alias:** \`${config.client.prefix}mc\`\n**Category:** General`)
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
            .setDescription(`**Member Count** \`${message.guild.memberCount}\``)
            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
            .setColor(config.client.color)

        message.channel.send(embed)
    }
}