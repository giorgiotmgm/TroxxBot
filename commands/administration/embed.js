module.exports = {
    name: 'embed',
    aliases: ['em'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}embed\``)
            .setDescription(`**Usage:** \`${config.client.prefix}embed <title> + <message>\`\n**Alias:** \`${config.client.prefix}em\`\n**Category:** Administration`)
            .addField('Permission(s) Required', '\`MANAGE_MESSAGES\`')
            .setThumbnail(message.guild.iconURL)
            .setFooter('[] = Optional Arguments • <> = Required Arguments')
            .setColor(config.client.color)

        if (message.author.id !== config.client.owner) {
            if (!message.member.permissions.has('ADMINISTRATOR') && !message.member.permissions.has('MANAGE_MESSAGES')) {
                return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions')) && message.channel.send(usageEmbed)
            }
        }

        message.delete()

        // CODE GOES HERE 🡫

		let channel = message.mentions.channels.first()
        if (!channel) return message.channel.send(usageEmbed)

        let split = '+'
        args = args.join(' ').split(split)

        let title = args[1].split(split)
        if (!title) return message.channel.send(usageEmbed)

        let description = args.slice(2).join(' ').split(split)
        if (!description) return message.channel.send(usageEmbed)

        let embed = new Discord.RichEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(config.client.color)

        channel.send(embed)
    }
}