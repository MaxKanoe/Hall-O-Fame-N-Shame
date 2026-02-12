const { Events, EmbedBuilder, Collection, time } = require('discord.js');
const arraylist = require('arraylist')

const prefix = 'h!';

var obj = {}

var shameEmbed = new EmbedBuilder().setColor(0xB03119);
var fameEmbed = new EmbedBuilder().setColor(0xF5BB27);

module.exports = {
	name: Events.MessageCreate,
	execute(message, user) {
		if (!message.content.startsWith(prefix)) return;

		const args = message.content.trim().split(/ +/g);
		const cmd = args[0].slice(prefix.length).toLowerCase();
		const msgMaximum = 3

		const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

		const fameHall = message.client.channels.cache.get('1397038038844047431');
		const shameHall = message.client.channels.cache.get('1396265940299153509');



		function hofnsCommands(embedType, channelType, channelName) {
			if (message.reference) {
				message.fetchReference().then(async repliedTo => {
					var messageMember = repliedTo.member.nickname || repliedTo.member.displayName || repliedTo.member.username
					var messageContent = repliedTo.content
					var messageID = repliedTo.id
					var messageChannelID = repliedTo.channel.id
					var messgaeGuildID = repliedTo.guild.id
					var messageAttachment = repliedTo.attachments
					var messageTimestamp = repliedTo.createdTimestamp
					var messageFormattedDate = time(Math.floor(messageTimestamp / 1000), 'f');

					if (!args[1]) {
						console.log(`Added to ${channelName} by ${message.member}: ${messageContent}`);

						embedType.setAuthor({ name: `@${messageMember}`, iconURL: `${repliedTo.member.displayAvatarURL()}` })

						if (messageContent && !messageAttachment.size) {
							embedType.addFields({ name: messageFormattedDate, value: messageContent })

							if (httpRegex.test(messageContent) == true) {
								embedType.setImage(messageContent);
								console.log('found gif');
							} else {
								embedType.setImage(null);
							}

						} else if (messageAttachment.size > 0 && !messageContent) {
							var firstAttachment = messageAttachment.first();

							embedType.setImage(firstAttachment.url);
							embedType.addFields({ name: `\u200b`, value: `\u200b` })
						} else if (messageAttachment.size > 0 && messageContent) {
							var firstAttachment = messageAttachment.first();

							embedType.setImage(firstAttachment.url);
							embedType.addFields({ name: `\u200b`, value: messageContent })
						} else {
							message.reply('empty message!')
						}

						embedType.setTimestamp(messageTimestamp);

						embedType.setFooter({ text: `${messageID} • ${messageChannelID}` });

						channelType.send({ content: `## ${channelName} \n https://discordapp.com/channels/${messgaeGuildID}/${messageChannelID}/${messageID}`, embeds: [embedType] })

						shameEmbed = new EmbedBuilder().setColor(0xB03119);
						fameEmbed = new EmbedBuilder().setColor(0xF5BB27);

					} else if (args[1] <= msgMaximum && args[1] >= 1) {
						message.fetchReference().then(async repliedTo => {
							var messageMember = repliedTo.member.nickname || repliedTo.member.displayName || repliedTo.member.username
							var messageContent = repliedTo.content
							var messageID = repliedTo.id
							var messageChannelID = repliedTo.channel.id
							var messageGuildID = repliedTo.guild.id
							var messageAttachment = repliedTo.attachments
							var messageTimestamp = repliedTo.createdTimestamp
							var messageFormattedDate = time(Math.floor(messageTimestamp / 1000), 'f');

							console.log(`Added Collection to ${channelName} by ${message.member}: ${messageContent}`);

							embedType.setAuthor({ name: `@${messageMember}`, iconURL: `${repliedTo.member.displayAvatarURL()}` })

							if (messageContent && !messageAttachment.size) {
								embedType.addFields({ name: `@${messageMember} ${messageFormattedDate}`, value: messageContent })

								if (httpRegex.test(messageContent) == true) {
									embedType.setImage(messageContent);
									console.log('found gif');
								} else {
									embedType.setImage(null);
								}

							} else if (messageAttachment.size > 0 && !messageContent) {
								var firstAttachment = messageAttachment.first();

								embedType.setImage(firstAttachment.url);
								embedType.addFields({ name: `1`, value: ` ` })
							} else if (messageAttachment.size > 0 && messageContent) {
								var firstAttachment = messageAttachment.first();

								embedType.setImage(firstAttachment.url);
								embedType.addFields({ name: `\u200b`, value: messageContent })
							} else {
								message.reply('empty message!')
							}

							message.channel.messages.fetch({ after: repliedTo.id }).then(msgs => {
								var msgDataArray = [];
								const msgArray = msgs.reverse();

								msgArray.forEach(msg => {
									if (msg) {
										const member = msg.member;
										const currentuser = member.id || msg.author.id;
										const displayName = member.nickname || member.displayName || msg.author.username;

										if (typeof obj[currentuser + "_Index"] === "undefined") {
											obj[currentuser + "_Index"] = 2;
										}

										if (!msg.content.startsWith(prefix)) {
										msgDataArray["msg-" + obj[currentuser + "_Index"].toString()] = {
											user: displayName,
											userID: currentuser,
											messageID: msg.id,
											channelID: msg.channel.id,
											guildID: msg.guild.id,
											content: msg.content,
											attachments: msg.attachments,
											timestamp: msg.createdTimestamp
										};

										obj[currentuser + "_Index"] = obj[currentuser + "_Index"] + 1;
										}
									} else {
										console.log("error: failed to write message to the array");
									}
								});

								console.log(msgDataArray);

								for (let index = 2; index <= args[1]; index++) {
									if (msgDataArray["msg-" + index]) {
										var formattedMsgDate = time(Math.floor(msgDataArray["msg-" + index]["timestamp"] / 1000), 'f');

										if (msgDataArray["msg-" + index]["content"]) {
											if (httpRegex.test(msgDataArray["msg-" + index]["content"]) === true) {
												console.log("GIF Found");
												embedType.addFields({ name: `@${msgDataArray["msg-" + index]["user"]} ${formattedMsgDate}`, value: `${msgDataArray["msg-" + index]["content"]}` });
											} else {
												embedType.addFields({ name: `@${msgDataArray["msg-" + index]["user"]} ${formattedMsgDate}`, value: msgDataArray["msg-" + index]["content"] });
											}

											if (msgDataArray["msg-" + index]["attachments"] && msgDataArray["msg-" + index]["attachments"].size > 0) {
												console.log("Attachment Found");
												var attachmentUrl = msgDataArray["msg-" + index]["attachments"].first().url;

												embedType.addFields({ name: `\u200b`, value: attachmentUrl });
											}
										}

										console.log(msgDataArray["msg-" + index]);
										console.log("msg-" + index);

										if (index == args[1]) {
											console.log(`Sent Collection to: ${channelName}`);
											embedType.setTimestamp(msgDataArray["msg-" + index.toString()]["timestamp"]);

											embedType.setFooter({ text: `${msgDataArray["msg-" + index.toString()]["messageID"]} • ${msgDataArray["msg-" + index.toString()]["channelID"]}` });

											channelType.send({ content: `## ${channelName} \n https://discordapp.com/channels/${messgaeGuildID}/${messageChannelID}/${messageID}`, embeds: [embedType] });

											shameEmbed = new EmbedBuilder().setColor(0xB03119);
											fameEmbed = new EmbedBuilder().setColor(0xF5BB27);
										}
									}
								}
							});
						})
					} else {
						message.reply('Invalid argument!! Please make sure the number is between 2 and 5')
					}
				});
			} else {
				message.reply('you must reply to a message!')
			}
		}
		if (cmd === 'fame') {
			hofnsCommands(fameEmbed, fameHall, "⭐ Hall of Fame")
		} else if (cmd === 'shame') {
			hofnsCommands(shameEmbed, shameHall, "💢 Hall of Shame")
		} else {
			message.reply('That is not a command. use h!help please')
		}

	},
};