module.exports = {
    name: 'serverinfo',
    aliases: ['si'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}serverinfo\``)
            .setDescription(`**Usage:** \`${config.client.prefix}serverinfo\`\n**Alias:** \`${config.client.prefix}si\`\n**Category:** General`)
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

        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' })
        const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(new Date(message.guild.createdTimestamp))

        let tier = 'Level 0'
        if (message.guild.PremiumTier == 1) tier = 'Level 1'
        if (message.guild.PremiumTier == 2) tier = 'Level 2'
        if (message.guild.PremiumTier == 3) tier = 'Level 3'

        let embed = new Discord.RichEmbed()
            .setTitle('Server Information')
            .setURL(message.guild.iconURL)
            .addField('Name', message.guild.name, true)
            .addField('Owner', message.guild.owner.user.tag, true)
            .addField('Region', message.guild.region, true)
            .addField('Users', message.guild.members.size, true)
            .addField('Channels', message.guild.channels.size, true)
            .addField('Roles', message.guild.roles.size, true)
            .addField('Created', `${day}/${month}/${year} \`(${moment(new Date(message.guild.createdTimestamp)).fromNow()})\``)
            .setThumbnail(message.guild.iconURL)
            .setFooter(`Requested By ${message.author.username}`, message.guild.iconURL)
            .setColor(config.client.color)

        message.channel.send(embed)
    }
}