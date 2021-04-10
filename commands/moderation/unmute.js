module.exports = {
    name: 'unmute',
    aliases: ['unstfu'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}unmute\``)
            .setDescription(`**Usage:** \`${config.client.prefix}unmute <user> <reason>\`\n**Alias:** \`${config.client.prefix}unstfu\`\n**Category:** Moderation`)
            .addField('Permission(s) Required', '\`MUTE_MEMBERS\`')
            .setThumbnail(message.guild.iconURL)
            .setFooter('[] = Optional Arguments • <> = Required Arguments')
            .setColor(config.client.color)

        // Checking Permission
        if (message.author.id !== config.client.owner) {
            if (!message.member.permissions.has('ADMINISTRATOR') && !message.member.permissions.has('MUTE_MEMBERS')) {
                return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions')) && message.channel.send(usageEmbed)
            }
        }

        // CODE GOES HERE 🡫

        let channel = message.guild.channels.find(c => c.id === config.channel.logs)
        if (!channel) return message.channel.send(new Discord.RichEmbed().setColor('#e74a3b').setDescription('**ERROR** Please contact \`yhGG#0001\`').addField('Issue', '[unmute.js]channel_not_found'))

        let role = message.guild.roles.find(c => c.id === config.role.muted)
        if (!role) return message.channel.send(new Discord.RichEmbed().setColor('#e74a3b').setDescription('**ERROR** Please contact \`yhGG#0001\`').addField('Issue', '[unmute.js]role_not_found'))

        let member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.find(m => m.user.username.toLowerCase().includes(args[0]))
        if (!member) return message.channel.send(usageEmbed)
        if (member.user.id === message.author.id) return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('You cannot unmute yourself'))
        if (member.highestRole.position >= message.member.highestRole.position) return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('You cannot unmute that person'))

        let reason = args.slice(1).join(' ')
        if (!reason) return message.channel.send(usageEmbed)

        let embed = new Discord.RichEmbed()
            .setTitle('Member Unmuted')
            .addField('Member:', member.user.tag, true)
            .addField('Member ID:', member.user.id, true)
            .addField('Unmuted By:', message.author.tag, true)
            .addField('Reason:', `\`${reason}\``)
            .setThumbnail(member.user.avatarURL)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setColor(config.client.color)

        let now = new Date()
        let date = moment(now).format('MM/DD/YYYY')

        const newLogs = new Logs({
            serverID: message.guild.id,
            userID: member.id,
            userName: member.user.username,
            mod: message.author.username,
            type: 'Unmute',
            reason: reason,
            date: date
        })
        newLogs.save()

        member.removeRole(role.id)
        channel.send(embed)
        return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription(`You have unmuted **${member.user.tag}** for \`${reason}\``))
    }
}