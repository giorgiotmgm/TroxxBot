module.exports = {
    name: 'rename',
    aliases: ['ren'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}rename\``)
            .setDescription(`**Usage:** \`${config.client.prefix}rename <name>\`\n**Alias:** \`${config.client.prefix}ren\`\n**Category:** Tickets`)
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

        let name = args.slice(0).join(' ')
        if (!name) return message.channel.send(usageEmbed)

        let embed = new Discord.RichEmbed()
            .setDescription(`This channel has renamed to \`${name}\``)
            .addField('Renamed by:', message.author.tag)
            .setColor(config.client.color)

        message.channel.setName(name)
        message.channel.send(embed)
    }
}