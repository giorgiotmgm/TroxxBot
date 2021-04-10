module.exports = {
    name: 'suggest',
    aliases: ['suggestion'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}suggest\``)
            .setDescription(`**Usage:** \`${config.client.prefix}suggest <suggestion>\`\n**Alias:** \`${config.client.prefix}suggestion\`\n**Category:** General`)
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

        message.delete()

        // CODE GOES HERE 🡫

        let channel = message.guild.channels.find(c => c.id === config.channel.pending_suggestions)
        if (!channel) return message.channel.send(new Discord.RichEmbed().setColor('#e74a3b').setDescription('**ERROR** Please contact \`yhGG#0001\`').addField('Issue', '[suggest.js]channel_not_found'))

        let content = args.slice(0).join(' ')
        if (!content) return message.channel.send(usageEmbed)

        let embed = new Discord.RichEmbed()
            .setTitle(`Suggestion from ${message.author.tag}`)
            .setDescription(`${content}\n\n`)
            .addField('Information', `Status: \`Pending\``)
            .setFooter('✅ = Accept Suggestion • ❎ = Deny Suggestion')
            .setColor(config.client.color)

        message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Your suggestion has been submitted'))
        let m = await channel.send(embed)
        await m.react('👍')
        await m.react('👎')
		await m.react('✅')
		await m.react('❎')
    }
}