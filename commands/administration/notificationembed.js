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
            .setFooter('[] = Optional Arguments â˘ <> = Required Arguments')
            .setColor(config.client.color)

        // Checking Permission
        if (message.author.id !== config.client.owner) {
            if (!message.member.permissions.has('ADMINISTRATOR')) {
                return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions')) && message.channel.send(usageEmbed)
            }
        }

        message.delete()

        // CODE GOES HERE đĄŤ

        let embed = new Discord.RichEmbed()
            .setTitle('Reaction Roles')
            .setDescription(`To customize which notifications you want to see, please react to the emoji for **topics** you want to follow.\n\nâď¸ - <@&${config.role.notify5}>\nđ˛ - <@&${config.role.notify6}>\nâď¸ - <@&${config.role.notify7}>`)
            .setColor(config.client.color)

        let embed1 = new Discord.RichEmbed()
            .setDescription(`To customize which notifications you want to see, please react to the emoji for **servers** you want to follow.\n\nđ - <@&${config.role.notify1}>\nđłď¸ - <@&${config.role.notify2}>\nâď¸ - <@&${config.role.notify3}>\nđ - <@&${config.role.notify4}>`)
            .setColor(config.client.color)

        let msg = await message.channel.send(embed)
        await msg.react('âď¸')
        await msg.react('đ˛')
        await msg.react('âď¸')

        let msg1 = await message.channel.send(embed1)
        await msg1.react('đ')
        await msg1.react('đłď¸')
        await msg1.react('âď¸')
        await msg1.react('đ')
    }
}