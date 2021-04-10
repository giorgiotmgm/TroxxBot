module.exports = {
    name: 'regionembed',
    aliases: ['re'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}regionembed\``)
            .setDescription(`**Usage:** \`${config.client.prefix}regionembed\`\n**Alias:** \`${config.client.prefix}re\`\n**Category:** Staff`)
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
            .setTitle('Select your region')
            .setDescription('Please click on one of the reactions below to select the region closest to you.\n\n🇪🇺 → EU\n🇺🇸 → NA\n🇦🇺 → AU')
            .setColor(config.client.color)

        let msg = await message.channel.send(embed)
        await msg.react('🇪🇺')
        await msg.react('🇺🇸')
        await msg.react('🇦🇺')
    }
}