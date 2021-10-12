const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "seek",
  description: "Seek to a position in the song",
  usage: "<time s/m/h>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["forward"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Hiện đang không phát nhạc...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Bạn phải trong một kênh thoại để sử dụng câu lệnh này!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Bạn phải cùng kênh thoại với bot để sử dụng câu lệnh này!**"
      );
    if (!player.queue.current.isSeekable)
      return client.sendTime(
        message.channel,
        "❌ | **I'm not able to seek this song!**"
      );
    let SeekTo = client.ParseHumanTime(args.join(" "));
    if (!SeekTo)
      return client.sendTime(
        message.channel,
        `**Usage - **\`${GuildDB.prefix}seek <number s/m/h>\` \n**Example - **\`${GuildDB.prefix}seek 2m 10s\``
      );
    player.seek(SeekTo * 1000);
    message.react("✅");
  },
  /*
    SlashCommand: {
        options: [
            {
                name: "position",
                description: "Enter a timestamp you want to seek to. Example - 2m 10s",
                value: "position",
                type: 3,
                required: true,
                //**
                *
                * @param {import("../structures/DiscordMusicBot")} client
                * @param {import("discord.js").Message} message
                * @param {string[]} args
                * @param {*} param3
                *
                run: async (client, interaction, args, { GuildDB }) => {
                    const guild = client.guilds.cache.get(interaction.guild_id);
                    const member = guild.members.cache.get(interaction.member.user.id);
                    let player = await client.Manager.get(interaction.guild_id);
                    
                    if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Bạn phải trong một kênh thoại để sử dụng câu lệnh này.**");
                    if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Bạn phải cùng kênh thoại với bot để sử dụng câu lệnh này!**");
                    if (!player) return client.sendTime(interaction, "❌ | **Hiện đang không phát nhạc...**");
                    if (!player.queue.current.isSeekable) return client.sendTime(interaction, "❌ | **I'm not able to seek this song!**");
                    let SeekTo = client.ParseHumanTime(interaction.data.options[0].value);
                    if (!SeekTo) return client.sendTime(interaction, `**Usage - **\`${GuildDB.prefix}seek <number s/m/h>\` \n**Example -** \`${GuildDB.prefix}seek 2m 10s\``);
                    player.seek(SeekTo * 1000);
                    client.sendTime(interaction, "✅ | **Successfully moved the song to **", `\`${Seekto}\``);
                },
            },
        ],
    },
*/
};
