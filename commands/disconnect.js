const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "disconnect",
  description: "Dừng phát nhạc và rời khỏi channel",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["leave", "exit", "quit", "dc", "stop"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Phải vào kênh thoại nếu muốn đuổi t ra**"
      );
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Không có gì để phát...**"
      );
    await client.sendTime(message.channel, ":notes: | **Đã ngắt kết nối!**");
    await message.react("✅");
    player.destroy();
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
          "❌ | **Join vào kênh thoại đi rồi hẳn đuổi t ra.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          `❌ | **Cần phải vào ${guild.me.voice.channel} để sử dụng lệnh này.**`
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(interaction, "❌ | **Không có gì để phát...**");
      player.destroy();
      client.sendTime(interaction, ":notes: | **Đã ngắt kết nối!**");
    },
  },
};
