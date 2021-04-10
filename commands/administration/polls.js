module.exports = {
    name: 'polls',
    aliases: ['poll'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}polls\``)
            .setDescription(`**Usage:** \`${config.client.prefix}polls <question> + <option(1)> + <option(2)>\`\n**Alias:** \`${config.client.prefix}poll\`\n**Category:** Administration`)
            .addField('Permission(s) Required', '\`MANAGE_MESSAGES\`')
            .setThumbnail(message.guild.iconURL)
            .setFooter('[] = Optional Arguments • <> = Required Arguments')
            .setColor(config.client.color)

        if (message.author.id !== config.client.owner) {
            if (!message.member.permissions.has('ADMINISTRATOR') && !message.member.permissions.has('MANAGE_MESSAGES')) {
                return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions')) && message.channel.send(usageEmbed)
            }
        }

        message.delete()

        // CODE GOES HERE 🡫

        let split = '+'
        args = args.join(' ').split(split)

        let question = args[0]
        if (!question) return message.channel.send(usageEmbed)

        let options = args.slice(1).map(elm => elm.trim())
        if (!options) return message.channel.send(usageEmbed)
        if (options.length === 0) return message.channel.send('You have to use a minimum of 2 options')
        if (options.length > 4) return message.channel.send('You have to use a maximum of 4 options')
        if (options.length < 2) return message.channel.send('You have to use a minimum of 2 options')

        if (options.length === 2) {
            let embed = new Discord.RichEmbed()
                .setTitle(question)
                .setDescription(`1️⃣ → ${options[0]}\n2️⃣ → ${options[1]}`)
                .setColor(config.client.color)

            let msg = await message.channel.send(embed)
            await msg.react('1️⃣')
            await msg.react('2️⃣')
        }

        if (options.length === 3) {
            let embed = new Discord.RichEmbed()
                .setTitle(question)
                .setDescription(`1️⃣ → ${options[0]}\n2️⃣ → ${options[1]}\n<:c_:3️⃣> → ${options[2]}`)
                .setColor(config.client.color)

            let msg = await message.channel.send(embed)
            await msg.react('1️⃣')
            await msg.react('2️⃣')
            await msg.react('3️⃣')
        }

        if (options.length === 4) {
            let embed = new Discord.RichEmbed()
                .setTitle(question)
                .setDescription(`1️⃣ → ${options[0]}\n2️⃣ → ${options[1]}\n<:c_:3️⃣> → ${options[2]}\n<:d_:4️⃣> → ${options[3]}`)
                .setColor(config.client.color)

            let msg = await message.channel.send(embed)
            await msg.react('1️⃣')
            await msg.react('2️⃣')
            await msg.react('3️⃣')
            await msg.react('4️⃣')
        }
    }
}