module.exports = {
    name: 'remove',
    aliases: ['rem'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}remove\``)
            .setDescription(`**Usage:** \`${config.client.prefix}remove <user> <reason>\`\n**Alias:** \`${config.client.prefix}rem\`\n**Category:** Tickets`)
            .addField('Permission(s) Required', '\`MOVE_MEMBERS\`')
            .setThumbnail(message.guild.iconURL)
            .setFooter('[] = Optional Arguments • <> = Required Arguments')
            .setColor(config.client.color)

        // Checking Permission
        if (message.author.id !== config.client.owner) {
            if (!message.member.permissions.has('ADMINISTRATOR') && !message.member.permissions.has('MOVE_MEMBERS')) {
                return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions')) && message.channel.send(usageEmbed)
            }
        }

        message.delete()

        // CODE GOES HERE 🡫

        if (message.channel.parentID != config.category.tickets) {
            return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('This command can only be ran in the tickets category'))
        }

        let member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.find(m => m.user.username.toLowerCase().includes(args[0]))
        if (!member) return message.channel.send(usageEmbed)

        let reason = args.slice(1).join(' ')
        if (!reason) return message.channel.send(usageEmbed)

        let embed = new Discord.RichEmbed()
            .setDescription(`Removed ${member} from ${message.channel}`)
            .addField('Removed by:', message.author.tag, true)
            .addField('Reason:', reason, true)
            .setColor(config.client.color)

        message.channel.overwritePermissions(member, {
            VIEW_CHANNEL: false
        })

        message.channel.send(embed)
    }
}