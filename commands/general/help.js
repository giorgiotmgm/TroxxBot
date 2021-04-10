module.exports = {
    name: 'help',
    aliases: ['?'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}help\``)
            .setDescription(`**Usage:** \`${config.client.prefix}help\`\n**Alias:** \`${config.client.prefix}?\`\n**Category:** General`)
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

        let format = []
        let count = 0
        const load = dirs => {
            const commands = fs.readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'))
            let cmds = []
            for (let file of commands) {
                let pull = require(`../../commands/${dirs}/${file}`)
                cmds.push(`\`${pull.name}\``)
                count++
            }
            format.push({
                key: dirs.charAt(0).toUpperCase() + dirs.slice(1),
                value: cmds.join(', ')
            })
        }
        ['general', 'moderation', 'administration', 'tickets', 'staff'].forEach(x => load(x))

        let embed = new Discord.RichEmbed()
            .setTitle(`${message.guild.name} Bot Commands`)
            .setFooter(`Total: ${count} commands`)
            .setColor(config.client.color)

        Object.keys(format).forEach(value => {
            embed.addField(format[value].key, format[value].value)
        })

        message.channel.send(embed)
    }
}