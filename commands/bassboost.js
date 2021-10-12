const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const levels = {
  none: 0.0,
  low: 0.2,
  medium: 0.3,
  high: 0.35,
};
module.exports = {
  name: "bassboost",
  description: "Enables bass boosting audio effect",
  usage: "<none|low|medium|high>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["bb", "bass"],
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

    if (!args[0])
      return client.sendTime(
        message.channel,
        "**Please provide a bassboost level. \nAvailable Levels:** `none`, `low`, `medium`, `high`"
      ); //if the user do not provide args [arguments]

    let level = "none";
    if (args.length && args[0].toLowerCase() in levels)
      level = args[0].toLowerCase();

    player.setEQ(
      ...new Array(3)
        .fill(null)
        .map((_, i) => ({ band: i, gain: levels[level] }))
    );

    return client.sendTime(
      message.channel,
      `✅ | **Bassboost level set to** \`${level}\``
    );
  },
  SlashCommand: {
    options: [
      {
        name: "level",
        description: `Please provide a bassboost level. Available Levels: low, medium, high, or none`,
        value: "[level]",
        type: 3,
        required: true,
      },
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

    run: async (client, interaction, args, { GuildDB }) => {
      const levels = {
        none: 0.0,
        low: 0.2,
        medium: 0.3,
        high: 0.35,
      };

      let player = await client.Manager.get(interaction.guild_id);
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Hiện đang không phát nhạc...**"
        );
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **Bạn phải trong một kênh thoại để sử dụng câu lệnh này.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(voiceChannel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Bạn phải cùng kênh thoại với bot để sử dụng câu lệnh này!**"
        );
      if (!args)
        return client.sendTime(
          interaction,
          "**Please provide a bassboost level. \nAvailable Levels:** `none`, `low`, `medium`, `high`"
        ); //if the user do not provide args [arguments]

      let level = "none";
      if (args.length && args[0].value in levels) level = args[0].value;

      player.setEQ(
        ...new Array(3)
          .fill(null)
          .map((_, i) => ({ band: i, gain: levels[level] }))
      );

      return client.sendTime(
        interaction,
        `✅ | **Set the bassboost level to** \`${level}\``
      );
    },
  },
};
