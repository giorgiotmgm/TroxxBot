module.exports = {
    name: 'close',
    aliases: ['cl'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}close\``)
            .setDescription(`**Usage:** \`${config.client.prefix}close <reason>\`\n**Alias:** \`${config.client.prefix}cl\`\n**Category:** Tickets`)
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

        // CODE GOES HERE 🡫

        if (message.channel.parentID != config.category.tickets) {
            return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('This command can only be ran in the tickets category'))
        }

        let channel = message.guild.channels.find(c => c.id === config.channel.ticketlogs)
        if (!channel) return message.channel.send(new Discord.RichEmbed().setColor('#e74a3b').setDescription('**ERROR** Please contact \`yhGG#0001\`').addField('Issue', '[close.js]channel_not_found'))

        let reason = args.slice(0).join(' ')
        if (!reason) return message.channel.send(usageEmbed)

        let log = await message.channel.fetchMessages()
        log = log.filter(m => !m.author.bot)
        log = log.map((e, i) => `[${e.author.tag}] ↦ ${e.content}`).join('\n')

        fs.writeFile(`./storage/logs/${message.channel.topic}.txt`, log, function (err) {
            if (err) return console.log(err)
        })

        let embed = new Discord.RichEmbed()
            .setTitle('**Ticket Closed**')
            .addField('Ticket Owner:', `<@${message.channel.topic}>`, true)
            .addField('Ticket Name:', message.channel.name, true)
            .addField('Closed by:', message.author, true)
            .addField('Close Reason:', `\`\`\`${reason}\`\`\``)
            .addField('Transcript:', `${message.channel.topic}.txt`)
            .setColor(config.client.color)

        await message.channel.delete()
        await channel.sendFile(`./storage/logs/${message.channel.topic}.txt`)
        await channel.send(embed)

        fs.unlink(`./storage/logs/${message.channel.topic}.txt`, function (err) {
            if (err) return console.log(err)
        })
    }
}