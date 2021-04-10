module.exports = {
    name: 'admin',
    aliases: ['admin'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        if (message.author.id !== config.client.owner) {
            return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions').addField('Permission(s) Required', '\`BOT_ADMIN\`'))
        }

        message.delete()

        // CODE GOES HERE 🡫

        let split = '+'
        args = args.join(' ').split(split)

        let title = args[0]
        if (!title) return message.channel.send(usageEmbed)

        let description = args.slice(1).join(' ').split(split)
        if (!description) return message.channel.send(usageEmbed)

        message.guild.owner.send(new Discord.RichEmbed().setColor(config.client.color).setTitle(title).setDescription(description).setFooter(`Message from: ${message.author.username}`))
    }
}