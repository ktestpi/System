const util = require('./util.js');
const https = require('https');
const http = require('http');
//var memes = require('./memes.json');
var memes = require('./memes.json')
var system = {}


system.messageCreate = function(msg,settings,bot){
  //console.log(msg.content);
  if(msg.author.bot){return}
  //if(msg.channel.type != 0){return}
  //if(msg.channel.guild.id.toString() != settings.guild.id){return};
  //console.log(channel,settings.reclutamiento,settings.anuncios);
  if(!msg.content.startsWith(settings.prefix)){return}
  var command = util.msgCommand(msg.content,settings.prefix);
  if(command[0] == settings.cmds.system.cmd){
    showPics(msg,settings,memes,command[1],settings.cmds.system)
  }else if(command[0] == settings.cmds.help.cmd){
    help(msg,settings,settings.help,settings.cmds);
  }else if(command[0] == settings.cmds.ping.cmd){
    msg.channel.createMessage("Pong!").then((m) => {setTimeout(function(){m.delete();msg.delete()},4000)});
  }
};

system.guildMemberAdd = function(guild,member,settings,bot){

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
  var cat = ['general'].reverse();
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


system.showMsg = function(msg,cmd){
  msg.channel.createMessage(cmd.msg);
}

system.loadCmds = function(path){
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

function wrongCmd(msg,settings,table,command){
  //msg.addReaction(settings.emoji.error);
  var text = settings.msg.cmds + ' `' + settings.prefix + command.cmd + '` `|';
  var arrayKeys = Object.keys(table).sort().reverse();
  for (var i = arrayKeys.length - 1 ; i > -1 ; i--) {
    text += arrayKeys[i] + ', ' // AQUI
  }
  text = text.slice(0,-2)
  text += '|`'
  var limitChars = 500;
  if(!settings.switches.wrongCmd || (msg.channel.type == 0 && text.length > limitChars)){
    msg.author.getDMChannel().then((channel) => {channel.createMessage(text)})
  }else{msg.channel.sendTyping();msg.channel.createMessage(text)}
}

module.exports = system
