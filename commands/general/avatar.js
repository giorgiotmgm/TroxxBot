module.exports = {
    name: 'avatar',
    aliases: ['av'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}avatar\``)
            .setDescription(`**Usage:** \`${config.client.prefix}avatar (user)\`\n**Alias:** \`${config.client.prefix}av\`\n**Category:** General`)
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

        let embed = new Discord.RichEmbed()
            .setTitle(`${member.user.username}'s Avatar`)
            .setImage(member.user.avatarURL)
            .setDescription(`[Click here](${member.user.avatarURL})`)
            .setFooter(`Requested By ${message.author.username}`, message.author.avatarURL)
            .setColor(config.client.color)

        message.channel.send(embed)
    }
}