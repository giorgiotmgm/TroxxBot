module.exports = {
    name: 'ticketembed',
    aliases: ['te'],
    execute: async (message, args, Discord, client, config, moment, fs, ms, Logs) => {

        // Command Usage 
        let usageEmbed = new Discord.RichEmbed()
            .setTitle(`Command: \`${config.client.prefix}ticketembed\``)
            .setDescription(`**Usage:** \`${config.client.prefix}ticketembed\`\n**Alias:** \`${config.client.prefix}te\`\n**Category:** Tickets`)
            .addField('Permission(s) Required', '\`ADMINISTRATOR\`')
            .setThumbnail(message.guild.iconURL)
            .setFooter('[] = Optional Arguments โข <> = Required Arguments')
            .setColor(config.client.color)

        // Checking Permission
        if (message.author.id !== config.client.owner) {
            if (!message.member.permissions.has('ADMINISTRATOR')) {
                return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions')) && message.channel.send(usageEmbed)
            }
        }

        message.delete()

        // CODE GOES HERE ๐กซ

        let embed = new Discord.RichEmbed()
            .setTitle(`Welcome to ${message.guild.name}!`)
            .setDescription('Please click on one of the reactions below to start your ticket.\n\n๐ โ General Support\n๐ฐ โ Purchase Support\n๐จ โ Ban Appeal\n๐ต๏ธ โ Player Report\n๐ป โ Media')
            .setColor(config.client.color)

        let msg = await message.channel.send(embed)
        await msg.react('๐')
        await msg.react('๐ฐ')
        await msg.react('๐จ')
        await msg.react('๐ต๏ธ')
        await msg.react('๐ป')
    }
}