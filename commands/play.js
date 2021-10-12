const { Util, MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "play",
  description: "Phát bài hát yêu thích của bạn",
  usage: "[song]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["p"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Hey hey, vào kênh thoại trước đi rồi hẳn gọi tao!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Ê ku, lên đây với tao rồi tao cho sài cái lệnh đó!**"
      );
    let SearchString = args.join(" ");
    if (!SearchString)
      return client.sendTime(
        message.channel,
        `**Usage - **\`${GuildDB.prefix}play [song]\``
      );
    let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
    let Searching = await message.channel.send(":mag_right: Searching...");
    if (!CheckNode || !CheckNode.connected) {
      return client.sendTime(
        message.channel,
        "❌ | **Ờ thì... Server đang bị đéo gì ấy nên cho tao đi fix cái nha.**"
      );
    }
    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: client.botconfig.ServerDeafen,
      volume: client.botconfig.DefaultVolume,
    });

    let SongAddedEmbed = new MessageEmbed().setColor(
      client.botconfig.EmbedColor
    );

    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Còn méo gì để phát đâu 🤷‍♂️🤷‍♀️**"
      );

    if (player.state != "CONNECTED") await player.connect();

    try {
      if (SearchString.match(client.Lavasfy.spotifyPattern)) {
        await client.Lavasfy.requestToken();
        let node = client.Lavasfy.nodes.get(client.botconfig.Lavalink.id);
        let Searched = await node.load(SearchString);

        if (Searched.loadType === "PLAYLIST_LOADED") {
          let songs = [];
          for (let i = 0; i < Searched.tracks.length; i++)
            songs.push(TrackUtils.build(Searched.tracks[i], message.author));
          player.queue.add(songs);
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play();
          SongAddedEmbed.setAuthor(
            `Đã thêm danh sách nhạc vào hàng chờ`,
            message.author.displayAvatarURL()
          );
          SongAddedEmbed.addField(
            "Thêm vào hàng chờ",
            `\`${Searched.tracks.length}\` bài hát`,
            false
          );
          //SongAddedEmbed.addField("Playlist duration", `\`${prettyMilliseconds(Searched.tracks, { colonNotation: true })}\``, false)
          Searching.edit(SongAddedEmbed);
        } else if (Searched.loadType.startsWith("TRACK")) {
          player.queue.add(
            TrackUtils.build(Searched.tracks[0], message.author)
          );
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
          SongAddedEmbed.setAuthor(
            `Đã thêm vào hàng chờ`,
            client.botconfig.IconURL
          );
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
          );
          SongAddedEmbed.addField(
            "Tác giả",
            Searched.tracks[0].info.author,
            true
          );
          //SongAddedEmbed.addField("Thời lượng", `\`${prettyMilliseconds(Searched.tracks[0].length, { colonNotation: true })}\``, true);
          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              "Vị trí trong hàng chờ",
              `${player.queue.size - 0}`,
              true
            );
          Searching.edit(SongAddedEmbed);
        } else {
          return client.sendTime(
            message.channel,
            "**Có tìm thấy méo gì giống cái - **" +
              SearchString +
              "** - đâu ???**"
          );
        }
      } else {
        let Searched = await player.search(SearchString, message.author);
        if (!player)
          return client.sendTime(
            message.channel,
            "❌ | **Méo còn gì để phát...**"
          );

        if (Searched.loadType === "NO_MATCHES")
          return client.sendTime(
            message.channel,
            "**Có tìm thấy méo gì giống cái - **" +
              SearchString +
              "** - đâu ???**"
          );
        else if (Searched.loadType == "PLAYLIST_LOADED") {
          player.queue.add(Searched.tracks);
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play();
          SongAddedEmbed.setAuthor(
            `Đã thêm danh sách nhạc vào hàng chờ`,
            client.botconfig.IconURL
          );
          SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
          SongAddedEmbed.setDescription(
            `[${Searched.playlist.name}](${SearchString})`
          );
          SongAddedEmbed.addField(
            "Thêm vào hàng chờ",
            `\`${Searched.tracks.length}\` bài hát`,
            false
          );
          SongAddedEmbed.addField(
            "Thời lượng danh sách phát",
            `\`${prettyMilliseconds(Searched.playlist.duration, {
              colonNotation: true,
            })}\``,
            false
          );
          Searching.edit(SongAddedEmbed);
        } else {
          player.queue.add(Searched.tracks[0]);
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
          SongAddedEmbed.setAuthor(
            `Đã thêm vào hàng chờ`,
            client.botconfig.IconURL
          );

          SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`
          );
          SongAddedEmbed.addField("Tác giả", Searched.tracks[0].author, true);
          SongAddedEmbed.addField(
            "Thời lượng",
            `\`${prettyMilliseconds(Searched.tracks[0].duration, {
              colonNotation: true,
            })}\``,
            true
          );
          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              "Vị trí trong hàng chờ",
              `${player.queue.size - 0}`,
              true
            );
          Searching.edit(SongAddedEmbed);
        }
      }
    } catch (e) {
      console.log(e);
      return client.sendTime(
        message.channel,
        "**Có tìm thấy méo gì giống cái - **" + SearchString + "** - đâu ???**"
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "song",
        value: "song",
        type: 3,
        required: true,
        description: "Tên hoặc url của bài hát",
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
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **Hey hey, vào kênh thoại trước đi rồi hẳn gọi tao!**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          "❌ | **Ờ thì... Server đang bị đéo gì ấy nên cho tao đi fix cái nha.**"
        );
      let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
      if (!CheckNode || !CheckNode.connected) {
        return client.sendTime(
          interaction,
          "❌ | **Ờ thì... Server đang bị đéo gì ấy nên cho tao đi fix cái nha.**"
        );
      }

      let player = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel_id,
        selfDeafen: client.botconfig.ServerDeafen,
      });
      if (player.state != "CONNECTED") await player.connect();
      let search = interaction.data.options[0].value;
      let res;

      if (search.match(client.Lavasfy.spotifyPattern)) {
        await client.Lavasfy.requestToken();
        let node = client.Lavasfy.nodes.get(client.botconfig.Lavalink.id);
        let Searched = await node.load(search);

        switch (Searched.loadType) {
          case "LOAD_FAILED":
            if (!player.queue.current) player.destroy();
            return client.sendError(
              interaction,
              `❌ | **Có lỗi xảy ra khi tìm nhạc**`
            );

          case "NO_MATCHES":
            if (!player.queue.current) player.destroy();
            return client.sendTime(
              interaction,
              "❌ | **Không tìm thấy gì 🤷‍♂️🤷‍♀️.**"
            );
          case "TRACK_LOADED":
            player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            let SongAddedEmbed = new MessageEmbed();
            SongAddedEmbed.setAuthor(
              `Đã thêm vào hàng chờ`,
              client.botconfig.IconURL
            );
            SongAddedEmbed.setColor(client.botconfig.EmbedColor);
            SongAddedEmbed.setDescription(
              `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
            );
            SongAddedEmbed.addField(
              "Tác giả",
              Searched.tracks[0].info.author,
              true
            );
            if (player.queue.totalSize > 1)
              SongAddedEmbed.addField(
                "Vị trí trong hàng chờ",
                `${player.queue.size - 0}`,
                true
              );
            return interaction.send(SongAddedEmbed);

          case "SEARCH_RESULT":
            player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            let SongAdded = new MessageEmbed();
            SongAdded.setAuthor(
              `Đã thêm vào hàng chờ`,
              client.botconfig.IconURL
            );
            SongAdded.setColor(client.botconfig.EmbedColor);
            SongAdded.setDescription(
              `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
            );
            SongAdded.addField("Tác giả", Searched.tracks[0].info.author, true);
            if (player.queue.totalSize > 1)
              SongAdded.addField(
                "Vị trí trong hàng chờ",
                `${player.queue.size - 0}`,
                true
              );
            return interaction.send(SongAdded);

          case "PLAYLIST_LOADED":
            let songs = [];
            for (let i = 0; i < Searched.tracks.length; i++)
              songs.push(TrackUtils.build(Searched.tracks[i], member.user));
            player.queue.add(songs);
            if (
              !player.playing &&
              !player.paused &&
              player.queue.totalSize === Searched.tracks.length
            )
              player.play();
            let Playlist = new MessageEmbed();
            Playlist.setAuthor(
              `Danh sách phát đã được thêm vào hàng chờ`,
              client.botconfig.IconURL
            );
            Playlist.setDescription(
              `[${Searched.playlistInfo.name}](${interaction.data.options[0].value})`
            );
            Playlist.addField(
              "Thêm vào hàng chờ",
              `\`${Searched.tracks.length}\` bài hát`,
              false
            );
            return interaction.send(Playlist);
        }
      } else {
        try {
          res = await player.search(search, member.user);
          if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current) player.destroy();
            return client.sendError(
              interaction,
              `:x: | **Có lỗi xảy ra khi tìm nhạc**`
            );
          }
        } catch (err) {
          return client.sendError(
            interaction,
            `Có lỗi xảy ra khi tìm nhạc: ${err.message}`
          );
        }
        switch (res.loadType) {
          case "NO_MATCHES":
            if (!player.queue.current) player.destroy();
            return client.sendTime(
              interaction,
              "❌ | **Không tìm thấy gì 🤷‍♂️🤷‍♀️.**"
            );
          case "TRACK_LOADED":
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            let SongAddedEmbed = new MessageEmbed();
            SongAddedEmbed.setAuthor(
              `Đã thêm vào hàng chờ`,
              client.botconfig.IconURL
            );
            SongAddedEmbed.setThumbnail(res.tracks[0].displayThumbnail());
            SongAddedEmbed.setColor(client.botconfig.EmbedColor);
            SongAddedEmbed.setDescription(
              `[${res.tracks[0].title}](${res.tracks[0].uri})`
            );
            SongAddedEmbed.addField("Tác giả", res.tracks[0].author, true);
            SongAddedEmbed.addField(
              "Thời lượng",
              `\`${prettyMilliseconds(res.tracks[0].duration, {
                colonNotation: true,
              })}\``,
              true
            );
            if (player.queue.totalSize > 1)
              SongAddedEmbed.addField(
                "Vị trí trong hàng chờ",
                `${player.queue.size - 0}`,
                true
              );
            return interaction.send(SongAddedEmbed);

          case "PLAYLIST_LOADED":
            player.queue.add(res.tracks);
            await player.play();
            let SongAdded = new MessageEmbed();
            SongAdded.setAuthor(
              `Danh sách phát đã được thêm vào hàng chờ`,
              client.botconfig.IconURL
            );
            SongAdded.setThumbnail(res.tracks[0].displayThumbnail());
            SongAdded.setDescription(
              `[${res.playlist.name}](${interaction.data.options[0].value})`
            );
            SongAdded.addField(
              "Thêm vào hàng chờ",
              `\`${res.tracks.length}\` bài hát`,
              false
            );
            SongAdded.addField(
              "Thời lượng danh sách phát",
              `\`${prettyMilliseconds(res.playlist.duration, {
                colonNotation: true,
              })}\``,
              false
            );
            return interaction.send(SongAdded);
          case "SEARCH_RESULT":
            const track = res.tracks[0];
            player.queue.add(track);

            if (!player.playing && !player.paused && !player.queue.length) {
              let SongAddedEmbed = new MessageEmbed();
              SongAddedEmbed.setAuthor(
                `Đã thêm vào hàng chờ`,
                client.botconfig.IconURL
              );
              SongAddedEmbed.setThumbnail(track.displayThumbnail());
              SongAddedEmbed.setColor(client.botconfig.EmbedColor);
              SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
              SongAddedEmbed.addField("Tác giả", track.author, true);
              SongAddedEmbed.addField(
                "Thời lượng",
                `\`${prettyMilliseconds(track.duration, {
                  colonNotation: true,
                })}\``,
                true
              );
              if (player.queue.totalSize > 1)
                SongAddedEmbed.addField(
                  "Vị trí trong hàng chờ",
                  `${player.queue.size - 0}`,
                  true
                );
              player.play();
              return interaction.send(SongAddedEmbed);
            } else {
              let SongAddedEmbed = new MessageEmbed();
              SongAddedEmbed.setAuthor(
                `Đã thêm vào hàng chờ`,
                client.botconfig.IconURL
              );
              SongAddedEmbed.setThumbnail(track.displayThumbnail());
              SongAddedEmbed.setColor(client.botconfig.EmbedColor);
              SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
              SongAddedEmbed.addField("Tác giả", track.author, true);
              SongAddedEmbed.addField(
                "Đồ dài",
                `\`${prettyMilliseconds(track.duration, {
                  colonNotation: true,
                })}\``,
                true
              );
              if (player.queue.totalSize > 1)
                SongAddedEmbed.addField(
                  "Vị trí trong hàng chờ",
                  `${player.queue.size - 0}`,
                  true
                );
              interaction.send(SongAddedEmbed);
            }
        }
      }
    },
  },
};
