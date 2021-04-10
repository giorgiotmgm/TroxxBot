module.exports = {
    name: 'unlock',
    aliases: ['ul'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}unlock\``)
            .setDescription(`**Usage:** \`${config.client.prefix}unlock <reason>\`\n**Alias:** \`${config.client.prefix}ul\`\n**Category:** Moderation`)
            .addField('Permission(s) Required', '\`MANAGE_CHANNELS\`')
            .setThumbnail(message.guild.iconURL)
            .setFooter('[] = Optional Arguments • <> = Required Arguments')
            .setColor(config.client.color)

        // Checking Permission
        if (message.author.id !== config.client.owner) {
            if (!message.member.permissions.has('ADMINISTRATOR') && !message.member.permissions.has('MANAGE_CHANNELS')) {
                return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions')) && message.channel.send(usageEmbed)
            }
        }

        // CODE GOES HERE 🡫

        let channel = message.guild.channels.find(c => c.id === config.channel.logs)
        if (!channel) return message.channel.send(new Discord.RichEmbed().setColor('#e74a3b').setDescription('**ERROR** Please contact \`yhGG#0001\`').addField('Issue', '[unlock.js]channel_not_found'))

        let reason = args.slice(0).join(' ')
        if (!reason) return message.channel.send(usageEmbed)

        let embed = new Discord.RichEmbed()
            .setTitle('Channel Unlocked')
            .addField('Channel:', message.channel, true)
            .addField('Unlocked By:', message.author.tag, true)
            .addField('Reason:', `\`${reason}\``)
            .setThumbnail(message.author.avatarURL)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setColor(config.client.color)

        message.channel.overwritePermissions('709476483646750772', {
            SEND_MESSAGES: true
        })

        channel.send(embed)
        return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription(`${message.channel} has been unlocked.`).addField('Unlocked by:', message.author.tag, true).addField('Reason:', reason, true))
    }
}