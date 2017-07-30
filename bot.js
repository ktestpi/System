const Eris = require("eris");
const util = require('./util.js');
const mango = require('./mango.js');
const config = require('./config.json');

config.color = parseInt(config.color.replace(/^#/, ''), 16);
config.cmds = mango.loadCmds('./cmds.json');

typeof process.env.BOT_TOKEN !== 'undefined' ? bot = new Eris(process.env.BOT_TOKEN): bot = new Eris(config.token);
if(config.token){
  config.guild = {
    id : "332023803691532289",
    "text" : {"reclutamiento" : "332024705177354240", "anuncios" : "332024661959376898", "normas" : "332266182302367744"},
    "voice" : {"lieSala1" : "332023803691532290","lieSala2" : "333240206209843201", "taberna" : "333218349167149058"}
  };
  config.ready.channel = "332023803691532289";
  config.emoji.logofed = "<:logofed:299543515279392775>";
  config.emoji.lie = "<:lie:330754604163923968>";
  config.emoji.rajoyface = "<:rajoyface:298173273211011076>";
  config.emoji.trumpface = "<:mango:332252468794621963>";
  config.emoji.angrypepe = "<:angrypepe:309766751783223306>";
  config.emoji.gabenface = "<:gabenface:292296092647686144>";
  config.emoji.crazy = "<:crazy:299542502753435651>";
  config.emoji.babyrage = "<:babyrage:299543494987350016>";
}
bot.on("ready", () => {
  bot.editStatus("online", {name : config.playing});
  console.log(util.DateF() + ' - ' + "Ready!");
  console.log('Bot estable');
  console.log('GuildID');
  console.log(config.guild);
  bot.createMessage(config.ready.channel,config.ready.msg)
  bot.createMessage(config.ready.server,config.ready.msg)
  //bot.editSelf({username: 'Mango Test'});
});

bot.on("messageCreate", (msg) => {
  //console.log(msg.content);
  mango.messageCreate(msg,config,bot);
  //if(msg.content == 'test'){};
  //if(msg.content == 'test2'){mango.closeLie(config,bot)};
});

bot.on("messageReactionAdd", (msg,emoji,userID) => {

});

bot.on("messageReactionRemove", (msg,emoji,userID) => {

});


bot.on("guildMemberAdd", (guild,member) => {
    mango.guildMemberAdd(guild,member,config,bot)
});

bot.connect();
