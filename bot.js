const Discord = require('discord.js');
const bot = new Discord.Client();
const util = require('util')
const config = require('./config.json')

var readyspam = 0;
var firstrun = 1;
var emode = false;
var token = config.token;

bot.on('ready', () => {
  console.log('Everything connected!');
  if (readyspam == 0) {
    readyspam = 1;
    setTimeout(function() {
      readyspam = 0;
    }, 3000);
  } else {
    console.error("Stopping due to client-ready spam, please restart the bot!");
    process.exit(1);
  }
});

bot.on('message', msg => {
  if (msg.author.id !== bot.user.id) return;
  if (S(message.content).startsWith(config.prefix)) {
    var splitmsg = message.content.split(" ");
    cmd = S(splitmsg[0]).chompLeft(config.prefix).s;
    var args = splitmsg.slice(1);

    switch (cmd) {
      case 'eval':
        var code = args.join(' ');
        try {
          let evaled = eval(code);
          if (evaled === token || evaled == "token" || evaled.toString().indexOf(token) != -1 || evaled.toString().indexOf("token") != -1) {
            evaled = 'Don\'t eval your token, that is... Hmm, bad.';
            msg.delete();
          }
          pro = msg.channel.send("\`\`\`\n" + evaled + "\n\`\`\`");
          // TODO: .catch handle message with over 2k chars
          if (evaled !== null && typeof evaled === 'object') {
            //TODO: check if evaled has custom toString, if it does let it live
            pro.then(m => m.delete(60000))
          }
        } catch (err) {
          if (err !== null && typeof err === 'object') {
            err = util.inspect(err)
          }
          msg.channel.send(":x: Error!\n\`\`\`\n" + err + "\n\`\`\`").then(m => m.delete(60000));
          // TODO: .catch handle message with over 2k chars
        }
        break;
      case 'dumptxt':
        temp = "===" + msg.guild.name + "===\n"
        temp += getchans(msg.guild, true);
        msg.channel.send(temp);
        break;
      case 'ldumptxt':
        temp = "===" + msg.guild.name + "==="
        temp += getchans(msg.guild, false);
        msg.delete();
        console.log(temp);
        break;
      case 'ping':
        var embed = getEmbed('🏓 Ping!');
        msg.channel.send("", {
          embed: embed
        }).then(
          m => m.edit("", {
            embed: getEmbed('🏓 Pong!', 'Latency is ' + (m.createdTimestamp - msg.createdTimestamp) + 'ms\nAPI Latency is ' + bot.ping + ' ms');
          })
        );
        break;
      case 'serverinfo':
        var guild = msg.guild
        var user = guild.owner.user
        var txt = ""
        title = "Name: " + guild.name + "\n"
        txt += "Owner: " + user.username + "#" + user.discriminator + " (" + user.id + ")\n"
        txt += "Member Count: " + guild.memberCount + "\n"
        txt += "Channels: " + guild.channels.array().length + "\n"
        txt += "Roles: " + guild.roles.array().length + "\n"
        txt += "Region: " + guild.region + "\n"
        txt += "created At: " + guild.createdAt + "\n"
        msg.channel.send("", {
          embed: getEmbed(title, txt) //TODO: icon maybe
        });
        break;
      case 'embedmode':
        if (emode == true) {
          emode = false;
          msg.edit('Embed mode disabled');
        } else if (emode == false) {
          emode = true;
          msg.edit('Embed mode enabled');
        }
        break;
      case 'embed':
        msg.edit("", {
          embed: new Discord.RichEmbed().setDescription(args.join(' '))
        });
        break;
    }
  } else {
    if (emode) {
      msg.edit("", {
        embed: new Discord.RichEmbed().setDescription(msg.content)
      });
    }
  }
});

if (firstrun == 1) {
  bot.login(token)
    .then(function(r) {
      console.log("Login successful! " + r);
    })
    .catch(function(r) {
      console.error("Login not successful! " + r);
    });
  firstrun = 0;
} else {
  console.log("Not logging in again for preventing bot token reset!");
}

function getchans(guild, channelID) {
  var temp = "";
  guild.channels.array().forEach(function(e, i, a) {
    if (e.type == "text") {
      if (channelID) {
        var name = e.toString()
      } else {
        var name = "#" + e.name
      }
      temp += name + " -> {" + e.topic + "}\n";
      //console.log(util.inspect(e));
    }
  });
  return temp
}

function getEmbed(title, description = false, colour = true) {
  var embed = new Discord.RichEmbed()
  if (title !== false) {
    embed.setTitle(title)
  }
  if (description !== false) {
    embed.setDescription(description)
  }
  if (colour === true) {
    embed.setColor(Math.floor(Math.random() * 16777215))
  } else if ((typeof colour === 'string' || colour instanceof String) && colour !== 'false') {
    embed.setColor(colour)
  }
  return embed;
}
