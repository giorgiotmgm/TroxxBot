module.exports = {
    name: 'userinfo',
    aliases: ['ui'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}userinfo\``)
            .setDescription(`**Usage:** \`${config.client.prefix}userinfo\`\n**Alias:** \`${config.client.prefix}ui\`\n**Category:** General`)
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

        let member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.find(m => m.user.username.toLowerCase().includes(args[0]))
        if (!member) member = message.member

        let memberNickname = member.nickname
        if (!memberNickname) memberNickname = member.user.username

        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' })
        const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(new Date(member.user.createdAt))

        const dateTimeFormat2 = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' })
        const [{ value: month2 }, , { value: day2 }, , { value: year2 }] = dateTimeFormat2.formatToParts(new Date(message.guild.member(member.id).joinedAt))

        let roles = []
        message.guild.member(member.id).roles.forEach(r => {
            if (r.name.includes('everyone')) { } else {
                roles.push(r)
            }
        })
        if (roles.length < 1) {
            roles = ['None']
        } else {
            roles.sort(function (a, b) {
                return b.position - a.position
            })
        }

        let embed = new Discord.RichEmbed()
            .setTitle('User Information')
            .setURL(member.user.avatarURL)
            .addField('Name', member.user.tag, true)
            .addField('Nickname', memberNickname, true)
            .addField('ID', member.id, true)
            .addField('Roles', roles.join(' '))
            .addField('Joined', `${day2}/${month2}/${year2} \` (${(moment(new Date(message.guild.member(member.id).joinedAt)).fromNow())})\``)
            .addField('Created', `${day}/${month}/${year} \` (${(moment(new Date(member.user.createdAt)).fromNow())})\``)
            .setThumbnail(message.guild.iconURL)
            .setFooter(`Requested By ${message.author.username}`, message.guild.iconURL)
            .setColor(config.client.color)

        message.channel.send(embed)
    }
}