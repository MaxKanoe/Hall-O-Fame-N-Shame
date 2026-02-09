const { Events } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    name: Events.MessageReactionRemove,
    execute(reaction, user) {
        if (user.bot) return;

        let messageArchive = fs.readFileSync('messagearchive.json', err => {
            if (err) {
                console.log(err.message)
            }
        });

        messageArchive = JSON.parse(messageArchive);

        var messageContent = reaction.message.content
        var messageChannel = reaction.client.channels.cache.get(reaction.message.channelId)

        var reactedMessageId = reaction.message.id
        var reactedChannelId = reaction.message.channelId
        var reactedGuildId = reaction.message.guildId

        function hofnsRemove() {
            console.log(`Removed from Reaction by ${user}: ${messageContent}`);

            var ArchiveObject = messageArchive[reactedMessageId]

            var archiveMessageID = ArchiveObject['archive']['messageId']
            var archiveChannelId = ArchiveObject['archive']['channelId']
            var archiveGuildId = ArchiveObject['archive']['guildId']

            var archiveChannel = reaction.client.channels.cache.get(archiveChannelId)

            if (reaction.count <= 0 ) {
                archiveChannel.messages.fetch(archiveMessageID).then(msg => {
                    msg.delete();
                });

                delete messageArchive[reactedMessageId];
            }

            fs.writeFileSync('messagearchive.json', JSON.stringify(messageArchive, null, 2));
        }

        if (reaction.emoji.name == '💢' || reaction.emoji.name == '⭐') {
            hofnsRemove()
        }
    },
};