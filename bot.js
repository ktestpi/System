const Eris = require("eris");
const util = require('./util.js');
const system = require('./system.js');
const config = require('./config.json');

config.color = parseInt(config.color.replace(/^#/, ''), 16);
config.cmds = system.loadCmds('./cmds.json');

typeof process.env.BOT_TOKEN !== 'undefined' ? bot = new Eris(process.env.BOT_TOKEN): bot = new Eris(config.token);

bot.on("ready", () => {
  bot.editStatus("online", {name : config.playing});
  console.log(util.DateF() + ' - ' + "Ready!");
});

bot.on("messageCreate", (msg) => {
  system.messageCreate(msg,config,bot);
});

bot.on("messageReactionAdd", (msg,emoji,userID) => {

});

bot.on("messageReactionRemove", (msg,emoji,userID) => {

});

bot.on("guildMemberAdd", (guild,member) => {
    system.guildMemberAdd(guild,member,config,bot)
});

bot.connect();
