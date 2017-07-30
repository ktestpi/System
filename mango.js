const util = require('./util.js');
const https = require('https');
const http = require('http');
//var memes = require('./memes.json');
var memes = {
  "lolicop" : {"msg" : "", "file" : "https://cdn.discordapp.com/attachments/250957055014338560/340916097387593729/DEh-u1gU0AI06VK.jpg" , "name" : "lolipop.jpg"}
}
var mango = {}
//var settings = require("config.json").guilds.fedd;

/*var settings = {
  prefix : 'f!',
  announceLie : {time : 15, keyword : '#playlie', tomorrow : "mañana", separator : ':', separatorH : 'h', msg : ':loudspeaker: :lie: La LIE empieza en <TIME> minutos'}, //Add @everyone
  newMember : {msg : '<ADMIN> ¡Bienvenido <MEMBER> al Discord de la FED! '},
  roleFederado : 'federad@',
  roleAdmin : 'Admin',
  welcome : true,
  constants : {},
  cmds : {},
  channels : {reclutamiento : "327603261085581312", anuncios : "327603106257043456"},
  guildID : "327603106257043456", // "331532564957233152"
  roles : {},
  msg : {}
}*/

//"fedd" : {"id" : "327603106257043456", "reclutamiento" : "327621996089180162", "anuncios" : "327603106257043456", "cmds" : {"prefix" : "fed", "lies" : "lies"}, "admins" : ["189996884322942976"],
//"msg" : {"lies": "Hoy a las <HOUR> se jugará la LIE @everyone"}, "roles" : {"lies" : ["admin","lies"]}}

mango.messageCreate = function(msg,settings,bot){
  //console.log(msg.content);
  if(msg.author.bot){return}
  //if(msg.channel.type != 0){return}
  //if(msg.channel.guild.id.toString() != settings.guild.id){return};
  var channel = msg.channel.id.toString();
  //console.log(channel,settings.reclutamiento,settings.anuncios);
  if(channel == settings.guild.text.anuncios){
    announceLIE(msg,settings,bot)
  }else if(channel == settings.guild.text.reclutamiento){
    templateMsg(msg,settings,settings.reclutamiento.startsEndsWith,settings.reclutamiento.templates,function(){msg.delete();msg.channel.createMessage(replaceMsg(settings.reclutamiento.msgTemplates,settings)).then((n) =>{setTimeout(function(){n.delete()},settings.reclutamiento.waitTimeMsgTemplates*1000)})})
    //templateMsg(msg,settings,settings.reclutamiento.startsEndsWith,settings.reclutamiento.templates,function(){msg.addReaction(settings.emoji.error);setTimeout(function(){msg.delete()},5000);msg.channel.createMessage(util.replaceText(settings.reclutamiento.msgTemplates,{key : '<EMOJI-TRUMPFACE>', value :settings.emoji.trumpface})).then((n) =>{setTimeout(function(){n.delete()},settings.reclutamiento.waitTimeMsgTemplates*1000)})})
  };
  if(!msg.content.startsWith(settings.prefix)){return}
  var command = util.msgCommand(msg.content,settings.prefix);
  if(msg.channel.type == 0){
    if(msg.channel.guild.id != settings.guild.id){return}
    if(command[0] == settings.cmds.lie1.cmd && util.roleByName(msg.channel.guild.members.get(msg.author.id),settings.roles.admin)){
      if(command[1] == settings.cmds.lie1.s.open.cmd){
        openLie(msg,settings,bot,settings.guild.voice.lieSala1)
        if(command[2] != settings.announceLie.silence){msg.channel.createMessage(util.replaceText(settings.announceLie.lieVRoomOpened,{key : '<EMOJI-LIE>', value : settings.emoji.lie},{key : '<ROOM>', value : 'LIE'}))}
      }else if(command[1] == settings.cmds.lie1.s.close.cmd){
        closeLie(msg,settings,bot,settings.guild.voice.lieSala1,settings.guild.voice.taberna)
        if(command[2] != settings.announceLie.silence){msg.channel.createMessage(util.replaceText(settings.announceLie.lieVRoomClosed,{key : '<EMOJI-LIE>', value : settings.emoji.lie},{key : '<ROOM>', value : 'LIE'}))}
      }
    }else if(command[0] == settings.cmds.lie2.cmd  && util.roleByName(msg.channel.guild.members.get(msg.author.id),settings.roles.admin)){
      if(command[1] == settings.cmds.lie2.s.open.cmd){
        openLie(msg,settings,bot,settings.guild.voice.lieSala2)
        if(command[2] != settings.announceLie.silence){msg.channel.createMessage(util.replaceText(settings.announceLie.lieVRoomOpened,{key : '<EMOJI-LIE>', value : settings.emoji.lie},{key : '<ROOM>', value : 'LIE 2'}))}
      }else if(command[1] == settings.cmds.lie2.s.close.cmd){
        closeLie(msg,settings,bot,settings.guild.voice.lieSala2,settings.guild.voice.taberna)
        if(command[2] != settings.announceLie.silence){msg.channel.createMessage(util.replaceText(settings.announceLie.lieVRoomClosed,{key : '<EMOJI-LIE>', value : settings.emoji.lie},{key : '<ROOM>', value : 'LIE 2'}))}
      }
    }
  }
  if(command[0] == settings.cmds.discord.cmd){
    mango.showMsg(msg,settings.cmds.discord)
  }else if(command[0] == settings.cmds.lie.cmd){
    mango.showMsg(msg,settings.cmds.lie)
  }else if(command[0] == settings.cmds.twitch.cmd){
    mango.showMsg(msg,settings.cmds.twitch)
  }else if(command[0] == settings.cmds.web.cmd){
    mango.showMsg(msg,settings.cmds.web)
  }else if(command[0] == settings.cmds.twitter.cmd){
    mango.showMsg(msg,settings.cmds.twitter)
  }else if(command[0] == settings.cmds.help.cmd){
    help(msg,settings,settings.help,settings.cmds)
  }else if(command[0] == settings.cmds.lolicop.cmd){
    showPics(msg,settings,memes,command[0],settings.cmds.lolicop);
  }else if(command[0] == settings.cmds.bot.cmd){
    settings = botAdmin(bot,msg,settings)
  }
};

mango.guildMemberAdd = function(guild,member,settings,bot){
  if(guild.id != settings.guildID){return};
  if(settings.switchs.welcome){
    var mentionAdmin = util.getGuildRoleName(guild,settings.roles.admin);
    //console.log('Mention Admin', mentionAdmin,mentionAdmin.name);
    if(mentionAdmin){
      bot.createMessage(guild.id,util.replaceText(settings.newMember.msg,{key : '<MEMBER>', value : member.mention},{key : '<ADMIN>', value : '<@&' + mentionAdmin[0].id + '>'},{key : '<RULES>', value : '<#' + settings.guild.text.normas + '>'},{key : '<LOGOFED>', value : settings.emoji.logofed}))
    }
  }
  if(settings.switchs.giveRoleNewMember){
    var roles = util.getGuildRoleName(guild,settings.roles.federado);
    if(roles){
      for(var i = 0; i < roles.length; i++) {
        member.addRole(roles[i].id,'');
      }
    }
  }
}

botAdmin = function(bot,msg,settings){
  //console.log(msg.author.id, settings.author.id);
  if(msg.channel.type != 0){return};
  if(!util.roleByName(msg.channel.guild.members.get(msg.author.id),settings.roles.admin)){return}
  var command = util.msgCommand(msg.content,settings.prefix);
  if(command[1] == settings.cmds.bot.s.playing.cmd){
    bot.editStatus("online", {name : msg.content.slice((settings.prefix + settings.cmds.bot.cmd + settings.cmds.bot.s.playing.cmd).length + 2)});
  };
  return settings
};

function help(msg,settings,lang,cmds){
  var text = '';
  var arrayCmds = {};
  var arrayCategory = [];
  var cat = ['general','FED','LIE'].reverse();
  //console.log('cat',cat);
  //console.log('Cmds',cmds);

  for (var i in cmds){
    if(!arrayCmds[cmds[i].category]){arrayCmds[cmds[i].category] = []};
    arrayCmds[cmds[i].category].push(i);
  }
  //console.log('ArrayCmds',arrayCmds);
  for(i in arrayCmds){
    arrayCmds[i] = arrayCmds[i].sort().reverse()
  };
  //console.log('sortedArrayCmds',arrayCmds);
  //console.log('category',arrayCategory);
  //console.log('ArrayCmds',arrayCmds);
  text += lang.help + '\n\n' + lang.helpNote + '\n\n';
  for (var i = cat.length - 1; i > -1; i--) {
    text += '**' + util.strCapitalize(cat[i]) + '**\n'
    //console.log('i',i, cat[i]);
    for (var j = arrayCmds[cat[i]].length-1; j > -1; j--) {
      //console.log('j',j,arrayCmds[cat[i]][j]);
      if(cmds[arrayCmds[cat[i]][j]].hide){continue}
      text += '`' + settings.prefix + cmds[arrayCmds[cat[i]][j]].cmd;
      //console.log(text);
      if(cmds[arrayCmds[cat[i]][j]].s){
        text += ' |';
        for (var k in cmds[arrayCmds[cat[i]][j]].s) {
          if(cmds[arrayCmds[cat[i]][j]].s[k].hide){continue}
          //console.log(k);
          text += cmds[arrayCmds[cat[i]][j]].s[k].cmd + ', ';
        }
        text = text.slice(0,-2);
        text += '|';
      }
      if(cmds[arrayCmds[cat[i]][j]].arguments){text += ' ' + cmds[arrayCmds[cat[i]][j]].arguments}
      text += '` - '+ cmds[arrayCmds[cat[i]][j]].description + '\n'
    }
    text += '\n';
  }
  //console.log(text);
  //msg.channel.sendTyping();
  if(msg.channel.type == 0){ // r!help a mensaje privado
    msg.author.getDMChannel().then((channel) => {channel.createMessage(text)})
  }else{
    msg.channel.sendTyping();
    msg.channel.createMessage(
      text
    );
  }
}

function showPics(msg,settings,pics,query,command){
  if(!command.enable){return}
  if(!pics[query] || query.length < 1){
    wrongCmd(msg,settings,pics,command)
    return
  };
  msg.channel.sendTyping();
  if(typeof pics[query] == 'object'){
    sendImage([pics[query].file],[],{msg : msg, settings : settings, pics : pics, query : query},function(results,container){
      //console.log('Hola',results);
      msg.channel.createMessage(util.replaceText(pics[query].msg, {key : '<AUTHOR>', value : msg.author.username}),{file : results, name : pics[query].name});
    })
  }else{
    msg.channel.createMessage(util.replaceText(pics[query], {key : '<AUTHOR>', value : msg.author.username}));
  }
};

sendImage = function(urls,results,container,callback){
  var url = urls.shift();
  var results = results || [];
  if(url.startsWith("https")){
    //if(container){'Petition'};
    https.get(url,function(res){
        var data = [];
      res.on('data',function(d){
        data.push(d);
      });
      res.on('end',function(){
        var buffer = Buffer.concat(data);
        //console.log(buffer.toString('base64'));
        callback(buffer,container);
      });
    }).on('error', (e) => {
      console.error(e);
    });
  }else if(url.startsWith("http")){
    //if(container){'Petition'};
    http.get(url,function(res){
        var data = [];
      res.on('data',function(d){
        data.push(d);
      });
      res.on('end',function(){
        var buffer = Buffer.concat(data);
        //console.log(buffer.toString('base64'));
        callback(buffer,container);
      });
    }).on('error', (e) => {
      console.error(e);
    });
  }
}

function announceLIE(msg,settings,bot){
  var message = msg.content.toLowerCase();
  //console.log(message);
  if(!message.match(new RegExp(settings.announceLie.keyword))){return}
  var textHour;
  if(message.match(new RegExp('\\d\\d' + settings.announceLie.separator + '\\d\\d'))){
    textHour = message.match(new RegExp('\\d\\d' + settings.announceLie.separator + '\\d\\d'))
  }else if(message.match(new RegExp('\\d\\d' + settings.announceLie.separatorH))){
    textHour = message.match(new RegExp('\\d\\d' + settings.announceLie.separatorH))
  }
  console.log(textHour);
  if(!textHour){return}
  var tomorrow = 0;
  if(message.match(new RegExp(settings.announceLie.tomorrow))){tomorrow = 1};
  //console.log(textHour);
  var diffTime = announceTime(settings,textHour[0],settings.announceLie.time,tomorrow);
  console.log(diffTime);
  if(diffTime == false){return};
  msg.addReaction(settings.emoji.notification);//MANDAR MENSAJE Y 5 min borrar
  console.log(util.replaceText(settings.announceLie.msgConfirm,{key : '<HOUR>', value : diffTime.hour},{key : '<ANNOUNCE>', value : diffTime.announce}));
  msg.channel.createMessage(util.replaceText(settings.announceLie.msgConfirm,{key : '<HOUR>', value : diffTime.hour},{key : '<ANNOUNCE>', value : diffTime.announce})

).then((m) => {setTimeout(() => {m.delete()},settings.announceLie.waitConfirm)})
  setTimeout(()=>{
    msg.channel.createMessage({
      content: util.replaceText(settings.announceLie.msg,{key : '<TIME>', value : settings.announceLie.time},{key : '<LIE>', value : settings.emoji.lie}),disableEveryone:false});
    openLie(msg,settings,bot,settings.guild.voice.lieSala1);
  },diffTime.time);
  return;
}

function announceTime(settings,text,minBefore,tomorrow){
  console.log('Tomorrow',tomorrow);
  var time = new Date();
  minBefore = minBefore || 0;
  var array
  if(text.includes(settings.announceLie.separator)){
    array = text.split(settings.announceLie.separator);
  }else if(text.includes(settings.announceLie.separatorH)){
    array = text.split(settings.announceLie.separatorH);
  }else{return false}
  console.log(array);
  if(array[0] == ''){array[0] = 0}
  if(array[1] == ''){array[1] = 0}
  array[0] = parseInt(array[0]);
  array[1] = parseInt(array[1]);
  console.log(array);
  if(typeof array[0] !== 'number' || typeof array[1] !== 'number' || isNaN(array[0]) || isNaN(array[1]) ){return false};
  if(array[0] > 23 || array[0] < 0 || array[1] > 59 || array[1] < 0 ){return false}
  var announce = new Date(time.getFullYear(),time.getMonth(),time.getDate()+tomorrow,parseInt(array[0]),parseInt(array[1]));
  var beforeTime = announce.getTime() - 60*1000*minBefore
  var diff = {time : (beforeTime - time.getTime()).toFixed(0), hour : util.zeroficationNumber(array[0]) + ':' + util.zeroficationNumber(array[1])}
  if(diff.time < 0){return false}
  var dateAnnounce = util.Date(beforeTime)
  diff.announce = dateAnnounce.day + '/' + dateAnnounce.month + '/' + dateAnnounce.year + ' - ' + util.zeroficationNumber(dateAnnounce.hour) + ':' + util.zeroficationNumber(dateAnnounce.min)
  console.log(diff.announce);
  console.log(diff.time);
  //var diff = (beforeTime).toFixed(0);
  return diff // milliseconds
};

function openLie(msg,settings,bot,channelID,message){
  var guild = bot.guilds.find(g => g.id === settings.guild.id)
  //console.log(guild);
  //console.log(settings.roles.federado);
  var roles = util.getGuildRoleName(guild,settings.roles.federado)
  //console.log(roles);
  if(!roles){return};
  bot.editChannelPermission(channelID, roles[0].id, 1048576, 0, "role", '')
  msg.addReaction(settings.emoji.accept)
};

function closeLie(msg,settings,bot,channelID,moveChannelID){
  var guild = bot.guilds.find(g => g.id === settings.guild.id)
  //console.log(guild);
  //console.log(settings.roles.federado);
  var roles = util.getGuildRoleName(guild,settings.roles.federado)
  //console.log(roles);
  if(!roles){return};
  bot.editChannelPermission(channelID, roles[0].id, 0, 1048576, "role", '')
  //console.log(membersVoiceChannel);
  var membersVoiceChannel = guild.members.filter(m => channelID === m.voiceState.channelID)
  if(!settings.switchs.kickVoiceChannelLIE){
      for (var i = 0; i < membersVoiceChannel.length; i++) {
      //console.log( membersVoiceChannel[i].voiceState);
      bot.editGuildMember(settings.guild.id, membersVoiceChannel[i].id, {channelID : moveChannelID},"")
    }
    msg.addReaction(settings.emoji.accept)
  }else{
    if(membersVoiceChannel.length > 0){
      bot.createChannel(settings.guild.id, 'Borra este canal', '2', '').then((channel) => {
        for (var i = 0; i < membersVoiceChannel.length; i++) {
          bot.editGuildMember(settings.guild.id, membersVoiceChannel[i].id, {channelID : channel.id},"").then(g => g)
        }
        //bot.deleteChannel(channel.id, '')
        setTimeout(()=>{bot.deleteChannel(channel.id, '')},10000)
      })
    }
  }

  /*for (var i = 0; i < membersVoiceChannel.length; i++) {
    //console.log( membersVoiceChannel[i].voiceState);
    console.log(membersVoiceChannel[i].username,membersVoiceChannel[i].voiceState.channelID);
    bot.editGuildMember(settings.guild.id, membersVoiceChannel[i].id, {channelID : moveChannelID},"")
  }*/
  msg.addReaction(settings.emoji.accept)
};

mango.showMsg = function(msg,cmd){
  msg.channel.createMessage(cmd.msg);
}

mango.loadCmds = function(path){
  const cmds = require(path).reverse();
  var commands = {}
  for (var i = cmds.length-1; i > -1 ; i--) {
    commands[cmds[i].cmd] = {};
    //console.log(cmds[i].command);
    for (var j in cmds[i]) {
      //console.log(cmds[i][j]);
      if(j != 's'){commands[cmds[i].cmd][j] = cmds[i][j]}
      else{
        commands[cmds[i].cmd][j] = {}
        for (var k = cmds[i][j].length-1; k > -1 ; k--) {
          commands[cmds[i].cmd][j][cmds[i][j][k].cmd] = cmds[i][j][k]
        }
      };
    }
  }
  //console.log(commands);
  return commands
}

function replaceMsg(message,settings,custom){
  var array = [
    {k : "<BOT-NAME>", v : settings.bot.name},
    {k : "<AUTHOR-NAME>", v : settings.author.name},
    //{k : "<ROLE-ADMIN>", v : settings.roles.admin},
    {k : "<EMOJI-LOGOFED>", v : settings.emoji.logofed},
    {k : "<EMOJI-LIE>", v : settings.emoji.lie},
    {k : "<EMOJI-RAJOYFACE>", v : settings.emoji.rajoyface},
    {k : "<EMOJI-TRUMPFACE>", v : settings.emoji.trumpface},
    {k : "<EMOJI-ANGRYPEPE>", v : settings.emoji.angrypepe},
    {k : "<EMOJI-GABENFACE>", v : settings.emoji.gabenface},
    {k : "<EMOJI-CRAZY>", v : settings.emoji.crazy},
    {k : "<EMOJI-BABYRAGE>", v : settings.emoji.babyrage}
    //{k : "<CHANNEL-BUGS>", v : "<#" + settings.guild.bugs + ">"},
    //{k : "<CHANNEL-BIBLIOTECA>", v : "<#" + settings.guild.biblioteca + ">"},
    //{k : "<CHANNEL-FOSO>", v : "<#" + settings.guild.id + ">"}
  ]
  if(custom){
    for (var i = 0; i < custom.length; i++) {

      custom[i].k = '<' + custom[i].k + '>';
      array.push(custom[i]);
    }
  };
  for (var i = 0; i < array.length; i++) {
    message = message.replace(new RegExp(array[i].k,'g'),array[i].v)
  }
  return message
}

function templateMsg(msg,settings,startsEndsWith,templates,callback){
  var message = msg.content;
  var pass = false;
  if(message.startsWith(startsEndsWith) && message.endsWith(startsEndsWith)){
    for (var i = 0; i < templates.length; i++) {
      if(message.includes(templates[i][0])){
        pass = true;
        var length = templates[i].length;
        for (var j = 1; j < length; j++) {
          if(!message.includes(templates[i][j])){
            pass = false
          }
        }
      }
    }
  }else{
    pass = false;
  }
  if(!pass){callback()}else{msg.addReaction(settings.emoji.surprise.slice(1,-1))}
}

module.exports = mango
