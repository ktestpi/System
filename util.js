var fs = require('fs');
var https = require('https');

var util = {}
util.JsonLoad2 = function(path){
  var obj
  fs.readFile(path, 'utf8', function(err, data) {
      if (err) throw err;
      console.log(data)
      obj = JSON.parse(data)
      //console.log(typeof obj)
      return obj
  })
}

util.JsonLoad = function(file){
  var obj = JSON.parse(fs.readFileSync(file,'utf8'))
  return obj
}

util.JsonSave = function(file,data){
  fs.writeFileSync(file, JSON.stringify(data), 'utf8')
}

util.DateF = function(time){
  var d;
  if(time){d = new Date(time)}
  else{d = new Date()}
  return '['+ util.zeroficationNumber(d.getDate()) + '-' + util.zeroficationNumber((d.getMonth()+1)) + '-' + d.getFullYear() + ' ' + util.zeroficationNumber(d.getHours()) + ':' + util.zeroficationNumber(d.getMinutes()) + ']'
}

util.Date = function(time){
  var d;
  if(time){d = new Date(time)}
  else{d = new Date()}
  return {day: d.getDate(), month : (d.getMonth()+1), year : d.getFullYear(), hour : d.getHours(), min : d.getMinutes()}
}


util.zeroficationNumber = function(text,digits){
  digits = digits || 2;
  text = text.toString();
  //console.log(text,text.length,digits);
  if(digits > text.length){
    text = "0".repeat(digits-text.length) + text
  }
  //console.log(text);
  return text
}

util.msgNoPrefix = function(message,prefix){
  return message.slice(prefix.length)
}

util.msgCommand = function(message,prefix){
  return util.msgNoPrefix(message,prefix).split(' ')
}

util.replaceText = function(text){
  //console.log(arguments.length);
  if(arguments.length > 0){
    var newText = text
    for(i = 1;i < arguments.length; i++){
      if(arguments[i].key && arguments[i].value){
        //console.log(arguments[i].key + ': ' + arguments[i].value);
        newText = newText.replace(arguments[i].key,arguments[i].value)
      }
    }
  }
  return newText
}

util.webRequest = function(url){
  //console.log(url,results);
  https.get(url,function(res){
      var chunks = '';
    res.on('data',function(d){
      chunks += d;
      return JSON.parse(chunks);
    });
    res.on('end',function(){
      //console.log(chunks);
      console.log(JSON.parse(chunks));

    });
  }).on('error', (e) => {
    console.error(e);
  });
}

util.webRequestMulti = function(urls,results,container,callback){
  var url = urls.shift();
  var results = results || [];
  //if(container){'Petition'};
  https.get(url,function(res){
      var chunks = '';
    res.on('data',function(d){
      chunks += d;
    });
    res.on('end',function(){
      results.push(JSON.parse(chunks));
      if(urls.length){
        setTimeout(function(){util.webRequestMulti(urls,results,container,callback)},200);
      }else{
        callback(results,container);
      }
    });
  }).on('error', (e) => {
    console.error(e);
  });
}

function postRequest(options,reqBody){
  //options = {host,path} , reqBody =
  //reqBody = '{"value1" : "E1", "value2" : "T", "value3" : "Z"}'
  options.headers = {'content-type' : 'application/json','content-length':reqBody.length};
      //host : "maker.ifttt.com", //--https://maker.ifttt.com/
  options.method = 'POST';
  options.body = reqBody;
      //port = 443,
      //body = { value1 = "E1", value2 = "T", value3 = "Z" },
      //path : "/trigger/eventmaker/with/key/WHVo4sC6HaYu3jQhickOj"
  const req = https.request(options, (res) => {
    //console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.write(options.body);
  req.end();
  req.on('error', (e) => {
    console.error(e);
  });
}

util.listDir = function(path){
  fs.access('path', (err) => {
    if (err) {
      //console.error("myfile doesn't exists");
      return;
    }});
  var files = fs.readdirSync(path)
  //console.log(files);
  return files
}

util.checkExistKey = function(keys){
  var check = true;
  for (var i = 0; i < keys.length; i++) {
    if((keys[i] === undefined) || (keys[i] === null)) {check = false; break};
  }
  return check
}
util.replaceUndNull = function(key,replaceWith){
  //console.log(key);
  if((key === undefined) || (key === null)){
    //console.log('UndNull');
    key = replaceWith};
  return key
}

util.strCapitalize = function(string){
  return string.charAt(0).toUpperCase() + string.slice(1)
}

util.numberToK = function(number,format,digits){
  digits = digits || 1
  format = format || 1000
  return (number/format).toFixed(digits)
}

util.getGuildRoleName = function(guild,name){
  var arrayName;
  var roles = [];
  if(typeof name == 'string'){arrayName = [name]}
  else(arrayName = name);
  //console.log(guild.roles);
  //console.log('ArrayName',arrayName);
  //var guildRoles = guild.roles.map((r) => {return r})
  var roles = []
  //console.log('GuildRoles',arrayName.length);
  for(var i = 0; i < arrayName.length; i++) {
    var guildRoles = guild.roles.find(r=> r.name.toLowerCase() === arrayName[i].toLowerCase())
    //console.log(guildRoles);
    if(guildRoles !== undefined){roles.push(guildRoles)}
  }
  //console.log('Roles');
  //console.log(roles);
  /*for(role in guildRoles){
    console.log('Role',role,guild.roles[role].name);
    for(var i = 0; i < arrayName.length; i++) {
      console.log('Roles names',role.name.toLowerCase(),arrayName[i].toLowerCase());
      if(guildRoles[role].name.toLowerCase() == arrayName[i].toLowerCase()){
        //console.log('Role');
        roles.push(guildRoles[role])
      }
    }
  }*/
  if(roles.length < 1){roles = false}
  return roles
}

util.roleByName = function(member,roleName){
  //console.log(member);
  var arrayRoleName;
  if(typeof roleName == 'string'){arrayRoleName = [roleName]}
  else{arrayRoleName = roleName};
  //console.log();
  if(member.roles.length < 1){return false}
    for(role in member.roles){
      for(var i = 0; i < arrayRoleName.length; i++) {
        //console.log(member.guild.roles.get(member.roles[role]).name);
        if(member.guild.roles.get(member.roles[role]).name.toLowerCase() == arrayRoleName[i].toLowerCase()){
          //console.log('True');
          return true
        }
      }
    }
  return false
};

module.exports = util
