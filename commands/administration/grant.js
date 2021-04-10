module.exports = {
    name: 'grant',
    aliases: ['gra'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}grant\``)
            .setDescription(`**Usage:** \`${config.client.prefix}grant <user> <role>\`\n**Alias:** \`${config.client.prefix}gra\`\n**Category:** Administration`)
            .addField('Permission(s) Required', '\`MANAGE_ROLES\`')
            .setThumbnail(message.guild.iconURL)
            .setFooter('[] = Optional Arguments • <> = Required Arguments')
            .setColor(config.client.color)

        if (message.author.id !== config.client.owner) {
            if (!message.member.permissions.has('ADMINISTRATOR') && !message.member.permissions.has('MANAGE_ROLES')) {
                return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions')) && message.channel.send(usageEmbed)
            }
        }

        // CODE GOES HERE 🡫

        let channel = message.guild.channels.find(c => c.id === config.channel.logs)
        if (!channel) return message.channel.send(new Discord.RichEmbed().setColor('#e74a3b').setDescription('**ERROR** Please contact \`yhGG#0001\`').addField('Issue', '[grant.js]channel_not_found'))

        let member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.find(m => m.user.username.toLowerCase().includes(args[0]))
        if (!member) return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Please specify a member'))

        let role = message.mentions.roles.first() || message.guild.roles.find(c => c.name.toLowerCase() === args.slice(1).join(' ')) || message.guild.roles.find(c => c.id.toLowerCase() === args.slice(1).join(' '))
        if (!role) return message.channel.send(usageEmbed)

        let embed = new Discord.RichEmbed()
            .setTitle('Role Granted')
            .addField('Member:', member.user.tag, true)
            .addField('Member ID:', member.user.id, true)
            .addField('Granted By:', message.author.tag, true)
            .setThumbnail(member.user.avatarURL)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setColor(config.client.color)

        member.addRole(role.id)
        channel.send(embed)
        return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription(`You granted ${role} to **${member.user.username}**`))
    }
}