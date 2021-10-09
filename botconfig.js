module.exports = {
  Admins: ["443116194275524619", "506827356489515020"], //Admins of the bot
  ExpressServer: true, //If you wanted to make the website run or not
  DefaultPrefix: process.env.Prefix || "-", //Default prefix, Server Admins can change the prefix
  Port: 3000, //Which port website gonna be hosted
  SupportServer: "https://discord.gg/Femv5Hc6sZ", //Support Server Link
  Token:
    process.env.Token ||
    "NjA2NDEyODMxNDYxNjA1Mzc3.XUKr9Q.qyJew3kDuxI439PxxY3_88dVAac", //Discord Bot Token
  ClientID: process.env.Discord_ClientID || "606412831461605377", //Discord Client ID
  ClientSecret:
    process.env.Discord_ClientSecret || "en7_iqHuHfmyFqRBcwnxmtZKjmUUoA9N", //Discord Client Secret
  Scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
  ServerDeafen: true, //If you want bot to stay deafened
  CallbackURL: "/api/callback", //Discord OAuth2 Callback URL
  "24/7": false, //If you want the bot to be stay in the vc 24/7
  CookieSecret: "B@chtam2001", //A Secret like a password
  IconURL:
    "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/logo.gif", //URL of all embed author icons | Dont edit unless you dont need that Music CD Spining
  EmbedColor: "RANDOM", //Color of most embeds | Dont edit unless you want a specific color instead of a random one each time
  Permissions: 2205281600, //Bot Inviting Permissions
  Website: process.env.Website || "https://groovy.bachtam2001.codes", //Website where it was hosted at includes http or https || Use "0.0.0.0" if you using Heroku

  //Lavalink
  Lavalink: {
    id: "Main",
    host: "lava.link",
    port: 80, // The port that lavalink is listening to. This must be a number!
    pass: "youshallnotpass",
    secure: false, // Set this to true if the lavalink uses SSL or you're hosting lavalink on repl.it
  },

  //Please go to https://developer.spotify.com/dashboard/
  Spotify: {
    ClientID:
      process.env.Spotify_ClientID || "b8530a2569ec4a68bd51394f4c765dba", //Spotify Client ID
    ClientSecret:
      process.env.Spotify_ClientSecret || "7f038e9a77de49899b64d0086978928d", //Spotify Client Secret
  },
};
