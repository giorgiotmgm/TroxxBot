module.exports = {
    name: 'neotificationembed',
    aliases: ['ne'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}neotificationembed\``)
            .setDescription(`**Usage:** \`${config.client.prefix}neotificationembed\`\n**Alias:** \`${config.client.prefix}ne\`\n**Category:** Staff`)
            .addField('Permission(s) Required', '\`ADMINISTRATOR\`')
            .setThumbnail(message.guild.iconURL)
            .setFooter('[] = Optional Arguments • <> = Required Arguments')
            .setColor(config.client.color)

        // Checking Permission
        if (message.author.id !== config.client.owner) {
            if (!message.member.permissions.has('ADMINISTRATOR')) {
                return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions')) && message.channel.send(usageEmbed)
            }
        }

        message.delete()

        // CODE GOES HERE 🡫

        let embed = new Discord.RichEmbed()
            .setTitle('Reaction Roles')
            .setDescription(`To customize which notifications you want to see, please react to the emoji for **topics** you want to follow.\n\n⛏️ - <@&${config.role.notify5}>\n🌲 - <@&${config.role.notify6}>\n⚔️ - <@&${config.role.notify7}>`)
            .setColor(config.client.color)

        let embed1 = new Discord.RichEmbed()
            .setDescription(`To customize which notifications you want to see, please react to the emoji for **servers** you want to follow.\n\n🔑 - <@&${config.role.notify1}>\n🏳️ - <@&${config.role.notify2}>\n⚙️ - <@&${config.role.notify3}>\n🎉 - <@&${config.role.notify4}>`)
            .setColor(config.client.color)

        let msg = await message.channel.send(embed)
        await msg.react('⛏️')
        await msg.react('🌲')
        await msg.react('⚔️')

        let msg1 = await message.channel.send(embed1)
        await msg1.react('🔑')
        await msg1.react('🏳️')
        await msg1.react('⚙️')
        await msg1.react('🎉')
    }
}