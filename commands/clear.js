const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Xoá hàng chờ",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["cl", "cls"],
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

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return client.sendTime(
        message.channel,
        "❌ | **Hiện đang không phát nhạc...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Bạn phải trong kênh thoại để gọi nhạc!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Bạn phải cùng kênh thoại với bot để sử dụng câu lệnh này!**"
      );
    player.queue.clear();
    await client.sendTime(message.channel, "✅ | **Đã xoá hàng chờ!**");
  },

  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | Bạn phải trong một kênh thoại để sử dụng câu lệnh này."
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Bạn phải cùng kênh thoại với bot để sử dụng câu lệnh này!**"
        );
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Hiện đang không phát nhạc...**"
        );

      if (!player.queue || !player.queue.length || player.queue.length === 0)
        return client.sendTime(
          interaction,
          "❌ | **Hiện đang không phát nhạc...**"
        );
      player.queue.clear();
      await client.sendTime(interaction, "✅ | **Đã xoá hàng chờ!**");
    },
  },
};
