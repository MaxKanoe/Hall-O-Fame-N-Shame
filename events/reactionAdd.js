const { Events, EmbedBuilder } = require('discord.js');
const { channel } = require('node:diagnostics_channel');
const fs = require('node:fs');

const shameEmbed = new EmbedBuilder().setColor(0xB03119);
const fameEmbed = new EmbedBuilder().setColor(0xF5BB27);


/*function archiveToJSON(name,msgID,chnlID,gildID) {
    var messageArchive = fs.readFileSync('messagearchive.json', err => {
        if (err) {
            console.log(err.message)
        }
    })
    messageArchive = JSON.parse(messageArchive)

    var messageObject = {
        reaction: {
            name: name,
            messageId: msgID,
            channelId: chnlID,
            guildId: gildID
        }
    }

    messageArchive.push(messageObject)

    fs.writeFileSync('messagearchive.json', JSON.stringify(messageArchive, null, 2))
    console.log(messageArchive)
}*/

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user, message, member) {
        if (user.bot) return;

        const fameHall = reaction.client.channels.cache.get('1410059784119652445');
        const shameHall = reaction.client.channels.cache.get('1410059812447846570');

        const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/


        var messageContent = reaction.message.content
        var messageChannel = reaction.client.channels.cache.get(reaction.message.channelId)
        var messageAttachment = reaction.message.attachments

        var reactionID = reaction.message.id
        var reactionChannel = reaction.message.channelId
        var reactionGuild = reaction.message.guildId

        function hofnsEmbed(embedType, channelType, channelName) {
            console.log(`Added to ${channelName}: ${user}, ${messageContent}`);

            embedType.setAuthor({ name: `@${reaction.message.member.displayName}`, iconURL: `${reaction.message.member.displayAvatarURL()}` })

            if (messageContent) {
                embedType.setDescription(messageContent)
            } else {
                embedType.setDescription(' ')
            }
            if (messageAttachment.size > 0) {
                var firstAttachment = messageAttachment.first();
                embedType.setImage(firstAttachment.url);
            } else if (httpRegex.test(messageContent) == true) {
                embedType.setImage(messageContent);
                console.log('found gif');
            } else {
                embedType.setImage('https://www.google.com/');
            };

            embedType.setTimestamp(reaction.message.createdTimestamp);

            embedType.setFooter({ text: `${reaction.message.id} • ${reaction.message.channelId}` });

            if (reaction.count <= 1 ) {
                channelType.send({ content: `## ${channelName} \n https://discordapp.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id}`, embeds: [embedType] }).then((sent) => {
                    let archiveId = sent.id
                    let archiveChannel = sent.channelId
                    let archiveGuild = sent.guildId

                    var messageArchive = fs.readFileSync('messagearchive.json', err => {
                        if (err) {
                            console.log(err.message)
                        }
                    });
                    
                    messageArchive = JSON.parse(messageArchive) || {};

                    messageArchive[reactionID] = {
                        message: messageContent,
                        reaction: {
                            messageId: reactionID,
                            channelId: reactionChannel,
                            guildId: reactionGuild
                        },
                        archive: {
                            messageId: archiveId,
                            channelId: archiveChannel,
                            guildId: archiveGuild
                        }
                    };

                    fs.writeFileSync('messagearchive.json', JSON.stringify(messageArchive, null, 2));

                    sent.client.channels.cache.get(reactionChannel).send({ content: `Sent to **${channelName}**` }).then(sentReply => {
                        sentReply.delete()
                    })
                });
            }
        };
            if (reaction.emoji.name == '💢') {
                hofnsEmbed(shameEmbed, shameHall, "💢 Hall of Shame")
            } else if (reaction.emoji.name == '⭐') {
                hofnsEmbed(fameEmbed, fameHall, "⭐ Hall of Fame")
            }
        
    },
};
