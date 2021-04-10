const Discord = require('discord.js')
const client = new Discord.Client({ autoReconnect: true })
const fs = require('fs')
const ms = require('ms')
const moment = require('moment')
const mongoose = require('mongoose')

const config = require('./storage/config.json')
client.commands = new Discord.Collection()

const Logs = require('./models/logs.js')

mongoose.set('useFindAndModify', false)
mongoose.connect(config.client.database, { useNewUrlParser: true, useUnifiedTopology: true })

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
}

client.on('error', console.error)
client.login(config.client.token)
client.on('ready', async () => {
    console.clear()
    client.user.setPresence({ status: 'online', game: { name: config.server.ip, type: 'PLAYING', } })
    console.log(`${client.user.tag} Bot Enabled`)
})

const modules = ['general', 'administration', 'tickets', 'moderation']
modules.forEach(c => {
    fs.readdir(`./commands/${c}/`, (err, files) => {
        if (err) throw err
        files.forEach(f => {
            const cmds = require(`./commands/${c}/${f}`)
            client.commands.set(cmds.name, cmds)
        })
    })
})

client.on('message', async (message) => {
    if (message.author.bot) return
    if (message.channel.type == 'dm') return
    if (message.content === `<@!${client.user.id}>` || message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>` || message.content === `<@${client.user.id}> `) return message.channel.send(new Discord.RichEmbed().setColor(config.client.color).setDescription(`Hi my prefix \`${config.client.prefix}\`\nUse \`${config.client.prefix}help\` to see all available commands`))
    if (!message.content.startsWith(config.client.prefix)) return

    const args = message.content.slice(config.client.prefix.length).split(/ +/)
    const command = args.shift()

    let cmd = client.commands.get(command.toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command.toLowerCase()))
    if (cmd) cmd.execute(message, args, Discord, client, config, moment, fs, ms, Logs)
})

client.on('guildMemberAdd', async (member) => {
    let channel = member.guild.channels.find(c => c.id === config.channel.welcome)
    if (!channel) return

    let embed = new Discord.RichEmbed()
        .setDescription(`${config.server.emote} Welcome **${member.user.username}** to **${member.guild.name}** _(${member.guild.memberCount} members)_\n\n**Server Information:**\n${config.server.emote} Server IP: \`${config.server.ip}\`\n${config.server.emote} Store: \`${config.server.store}\`\n\n_(Need help? Feel free to create a support ticket)_`)
        .setThumbnail(member.user.avatarURL)
        .setColor(config.client.color)

    channel.send(embed)
})

// Message Delete
client.on('messageDelete', async message => {
    const args = message.content.slice(config.client.prefix.length).split(/ +/)
    const command = args.shift()
    let cmd = client.commands.get(command.toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command.toLowerCase()))
    if (cmd) return
    if (message.author.bot) return

    let channel = message.guild.channels.find(c => c.id === config.channel.logs)
    if (!channel) return

    let embed = new Discord.RichEmbed()
        .setTitle('Message Deleted')
        .addField('Member:', message.author.tag, true)
        .addField('Member ID:', message.author.id, true)
        .addField('Channel:', message.channel.name, true)
        .addField('Content:', `\`${message.content}\``)
        .setThumbnail(message.author.avatarURL)
        .setTimestamp()
        .setFooter(message.guild.name, message.guild.iconURL)
        .setColor(config.client.color)

    channel.send(embed)
})

// Message Update
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.content !== newMessage.content) {
        let channel = newMessage.guild.channels.find(c => c.id === config.channel.logs)
        if (!channel) return

        let embed = new Discord.RichEmbed()
            .setTitle('Message Edited')
            .addField('Member:', newMessage.author.tag, true)
            .addField('Member ID:', newMessage.author.id, true)
            .addField('Channel:', newMessage.channel.name, true)
            .addField('Old Message:', `\`${oldMessage.content}\``)
            .addField('New Message:', `\`${newMessage.content}\``)
            .setThumbnail(newMessage.author.avatarURL)
            .setTimestamp()
            .setFooter(newMessage.guild.name, newMessage.guild.iconURL)
            .setColor(config.client.color)

        channel.send(embed)
    }
})

client.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return
    const { d: data } = event
    const user = client.users.get(data.user_id)
    if (user.bot) return
    const channel = client.channels.get(data.channel_id)
    if (!channel) return
    const message = await channel.fetchMessage(data.message_id)
    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name
    const reaction = message.reactions.get(emojiKey)

    let member = reaction.message.guild.members.get(user.id)

    // Suggestions
    if (reaction.message.channel.id === config.channel.pending_suggestions) {
        reaction.remove(member)

        if (member.id !== config.client.owner) {
            if (!reaction.message.guild.member(member).permissions.has('ADMINISTRATOR')) {
                reaction.remove(member)
                return reaction.message.guild.member(member).send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions'))
            }
        }

        if (reaction.emoji.name === '✅') {
            let embed = new Discord.RichEmbed()
                .setTitle(`Suggestion from ${reaction.message.embeds[0].title.split(' ')[2]}`)
                .setDescription(reaction.message.embeds[0].description)
                .addField('Information', 'Status: \`Accepted\`')
                .setFooter(`Reviewed by ${member.username}`, member.avatarURL)
                .setColor(config.client.color)

            reaction.message.delete()
            reaction.message.guild.channels.get(config.channel.accepted_suggestions).send(embed)

            if (reaction.emoji.name === '❎') {
                let embed = new Discord.RichEmbed()
                    .setTitle(`Suggestion from ${reaction.message.embeds[0].title.split(' ')[2]}`)
                    .setDescription(reaction.message.embeds[0].description)
                    .addField('Information', 'Status: \`Denied\`')
                    .setFooter(`Reviewed by ${member.username}`, member.avatarURL)
                    .setColor(config.client.color)

                reaction.message.delete()
                reaction.message.guild.channels.get(config.channel.denied_suggestions).send(embed)
            }
        }
    }

    // Bugs
    if (reaction.message.channel.id === config.channel.bugs) {
        reaction.remove(member)

        if (member.id !== config.client.owner) {
            if (!reaction.message.guild.member(member).permissions.has('ADMINISTRATOR')) {
                reaction.remove(member)
                return reaction.message.guild.member(member).send(new Discord.RichEmbed().setColor(config.client.color).setDescription('Insufficient Permissions'))
            }
        }

        if (reaction.emoji.name === '✅') {
            let embed = new Discord.RichEmbed()
                .setTitle(`Bug Report from ${reaction.message.embeds[0].title.split(' ')[3]}`)
                .setDescription(reaction.message.embeds[0].description)
                .addField('Information', 'Status: \`Reviewed\`')
                .setFooter(`Reviewed by ${member.username}`, member.avatarURL)
                .setColor(config.client.color)

            reaction.message.delete()
            reaction.message.guild.channels.get(config.channel.bugs).send(embed)
        }
    }

    // Notifications
    if (reaction.message.channel.id === config.channel.notification) {
        reaction.remove(member)

        if (reaction.emoji.name === '🔑') {
            if (member.roles.has(config.role.notify1)) return member.removeRole(config.role.notify1)

            member.addRole(config.role.notify1)
        }

        if (reaction.emoji.name === '🏳️') {
            if (member.roles.has(config.role.notify2)) return member.removeRole(config.role.notify2)

            member.addRole(config.role.notify2)
        }

        if (reaction.emoji.name === '⚙️') {
            if (member.roles.has(config.role.notify3)) return member.removeRole(config.role.notify3)

            member.addRole(config.role.notify3)
        }

        if (reaction.emoji.name === '🎉') {
            if (member.roles.has(config.role.notify4)) return member.removeRole(config.role.notify4)

            member.addRole(config.role.notify4)
        }

        if (reaction.emoji.name === '⛏️') {
            if (member.roles.has(config.role.notify5)) return member.removeRole(config.role.notify5)

            member.addRole(config.role.notify5)
        }

        if (reaction.emoji.name === '🌲') {
            if (member.roles.has(config.role.notify6)) return member.removeRole(config.role.notify6)

            member.addRole(config.role.notify6)
        }

        if (reaction.emoji.name === '⚔️') {
            if (member.roles.has(config.role.notify7)) return member.removeRole(config.role.notify7)

            member.addRole(config.role.notify7)
        }
    }

    // Staff Regions
    if (reaction.message.channel.id === config.channel.timezone) {
        reaction.remove(user)

        if (reaction.emoji.name === '🇪🇺') {
            if (member.roles.has(config.role.eu)) return member.removeRole(config.role.eu)
            if (member.roles.has(config.role.au)) member.removeRole(config.role.au)
            if (member.roles.has(config.role.na)) member.removeRole(config.role.na)

            member.addRole(config.role.eu)
        }

        if (reaction.emoji.name === '🇺🇸') {
            if (member.roles.has(config.role.na)) return member.removeRole(config.role.na)
            if (member.roles.has(config.role.eu)) member.removeRole(config.role.eu)
            if (member.roles.has(config.role.au)) member.removeRole(config.role.au)

            member.addRole(config.role.na)
        }

        if (reaction.emoji.name === '🇦🇺') {
            if (member.roles.has(config.role.au)) return member.removeRole(config.role.au)
            if (member.roles.has(config.role.eu)) member.removeRole(config.role.eu)
            if (member.roles.has(config.role.na)) member.removeRole(config.role.na)

            member.addRole(config.role.au)
        }
    }

    // Verification
    if (reaction.message.channel.id === config.channel.verification) {
        reaction.remove(member)

        if (reaction.emoji.name === '✅') {
            member.addRole(config.role.member)
        }
    }

    // Tickets
    if (reaction.message.channel.id === config.channel.tickets) {
        let limit = 0
        reaction.remove(user)
        // General Support
        if (reaction.emoji.name === '📋') {
            function createChannel() {
                message.guild.createChannel(`ticket-${member.displayName}`, 'text').then(async c => {
                    await c.setTopic(member.id)
                    await c.setParent(config.category.tickets)

                    await c.overwritePermissions(message.guild.defaultRole, {
                        VIEW_CHANNEL: false
                    })
                    await c.overwritePermissions(member.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true
                    })
                    await c.overwritePermissions(config.role.support, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true
                    })
                    await c.send(`<@&${config.role.support}>`).then(msg => msg.delete())

                    let embed = new Discord.RichEmbed()
                        .setDescription('Thank you for creating a ticket! Our support team will be with you shortly.')
                        .addField('Format', '```diff\n- Minecraft Username:\n- Question:```', true)
                        .addField('Topic', 'General Support', true)
                        .setTimestamp()
                        .setFooter(message.guild.name, message.guild.iconURL)
                        .setColor(config.client.color)

                    c.send(`<@${member.id}>`)
                    c.send(embed)
                })
            }
            reaction.message.guild.channels.forEach(c => {
                if (c.parentID === config.category.tickets) {
                    if (c.topic === member.id) {
                        limit++
                    }
                }
            })
            if (limit === 1) {
                return member.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('You have reached the maximum amount of tickets opened'))
            } else {
                createChannel()
            }
        }
        // Purchase Support
        if (reaction.emoji.name === '💰') {
            function createChannel() {
                message.guild.createChannel(`purchase-${member.displayName}`, 'text').then(async c => {
                    await c.setTopic(member.id)
                    await c.setParent(config.category.tickets)

                    await c.overwritePermissions(message.guild.defaultRole, {
                        VIEW_CHANNEL: false
                    })
                    await c.overwritePermissions(member.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true
                    })
                    await c.send(`<@&${config.role.support}>`).then(msg => msg.delete())

                    let embed = new Discord.RichEmbed()
                        .setDescription('Thank you for creating a ticket! Our support team will be with you shortly.')
                        .addField('Format', '```diff\n- Minecraft Username:\n- Transaction ID:\n- Issue:```', true)
                        .addField('Topic', 'Purchase Support', true)
                        .setTimestamp()
                        .setFooter(message.guild.name, message.guild.iconURL)
                        .setColor(config.client.color)

                    c.send(`<@${member.id}>`)
                    c.send(embed)
                })
            }
            reaction.message.guild.channels.forEach(c => {
                if (c.parentID === config.category.tickets) {
                    if (c.topic === member.id) {
                        limit++
                    }
                }
            })
            if (limit === 1) {
                return member.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('You have reached the maximum amount of tickets opened'))
            } else {
                createChannel()
            }
        }
        // Ban Appeal
        if (reaction.emoji.name === '🔨') {
            function createChannel() {
                message.guild.createChannel(`appeal-${member.displayName}`, 'text').then(async c => {
                    await c.setTopic(member.id)
                    await c.setParent(config.category.tickets)

                    await c.overwritePermissions(message.guild.defaultRole, {
                        VIEW_CHANNEL: false
                    })
                    await c.overwritePermissions(member.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true
                    })
                    await c.overwritePermissions(config.role.support, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true
                    })
                    await c.send(`<@&${config.role.support}>`).then(msg => msg.delete())

                    let embed = new Discord.RichEmbed()
                        .setDescription('Thank you for creating a ticket! Our support team will be with you shortly.')
                        .addField('Format', '```diff\n- Minecraft Username:\n- Punisher:\n- Ban Reason:\n- Appeal:```', true)
                        .addField('Topic', 'Ban Appeal', true)
                        .setTimestamp()
                        .setFooter(message.guild.name, message.guild.iconURL)
                        .setColor(config.client.color)

                    c.send(`<@${member.id}>`)
                    c.send(embed)
                })
            }
            reaction.message.guild.channels.forEach(c => {
                if (c.parentID === config.category.tickets) {
                    if (c.topic === member.id) {
                        limit++
                    }
                }
            })
            if (limit === 1) {
                return member.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('You have reached the maximum amount of tickets opened'))
            } else {
                createChannel()
            }
        }
        // Player Report
        if (reaction.emoji.name === '🕵️') {
            function createChannel() {
                message.guild.createChannel(`report-${member.displayName}`, 'text').then(async c => {
                    await c.setTopic(member.id)
                    await c.setParent(config.category.tickets)

                    await c.overwritePermissions(message.guild.defaultRole, {
                        VIEW_CHANNEL: false
                    })
                    await c.overwritePermissions(member.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true
                    })
                    await c.overwritePermissions(config.role.support, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true
                    })
                    await c.send(`<@&${config.role.support}>`).then(msg => msg.delete())

                    let embed = new Discord.RichEmbed()
                        .setDescription('Thank you for creating a ticket! Our support team will be with you shortly.')
                        .addField('Format', '```diff\n- Minecraft Username:\n- Their Minecraft Username:\n- Reason:\n- Evidence:```', true)
                        .addField('Topic', 'Player Report', true)
                        .setTimestamp()
                        .setFooter(message.guild.name, message.guild.iconURL)
                        .setColor(config.client.color)

                    c.send(`<@${member.id}>`)
                    c.send(embed)
                })
            }
            reaction.message.guild.channels.forEach(c => {
                if (c.parentID === config.category.tickets) {
                    if (c.topic === member.id) {
                        limit++
                    }
                }
            })
            if (limit === 1) {
                return member.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('You have reached the maximum amount of tickets opened'))
            } else {
                createChannel()
            }
        }
        // Media
        if (reaction.emoji.name === '🕵️') {
            function createChannel() {
                message.guild.createChannel(`media-${member.displayName}`, 'text').then(async c => {
                    await c.setTopic(member.id)
                    await c.setParent(config.category.tickets)

                    await c.overwritePermissions(message.guild.defaultRole, {
                        VIEW_CHANNEL: false
                    })
                    await c.overwritePermissions(member.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true
                    })
                    await c.send(`<@&${config.role.support}>`).then(msg => msg.delete())

                    let embed = new Discord.RichEmbed()
                        .setDescription('Thank you for creating a ticket! Our support team will be with you shortly.')
                        .addField('Format', '```diff\n- Minecraft Username:\n- Channel Link:\n- Question:```', true)
                        .addField('Topic', 'Media', true)
                        .setTimestamp()
                        .setFooter(message.guild.name, message.guild.iconURL)
                        .setColor(config.client.color)

                    c.send(`<@${member.id}>`)
                    c.send(embed)
                })
            }
            reaction.message.guild.channels.forEach(c => {
                if (c.parentID === config.category.tickets) {
                    if (c.topic === member.id) {
                        limit++
                    }
                }
            })
            if (limit === 1) {
                return member.send(new Discord.RichEmbed().setColor(config.client.color).setDescription('You have reached the maximum amount of tickets opened'))
            } else {
                createChannel()
            }
        }
    }
})