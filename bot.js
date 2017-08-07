const Discord = require('discord.js');
const bot = new Discord.Client();
const util = require('util');
var S = require('string');
const config = require('./config.json');

var readyspam = 0;
var firstrun = 1;
var emode = false;
var token = config.token;
var quoteStatus = false;
var quoteReaction = false;
var quoteHolder = false;

if (typeof config.quote !== 'undefined') {
  quoteStatus = true;
  quoteReaction = config.quote;
}
bot.on('ready', function () {
  console.log('Everything connected!');
  if (readyspam === 0) {
    readyspam = 1;
    setTimeout(function () {
      readyspam = 0;
    }, 3000);
  } else {
    console.error("Stopping due to client-ready spam, please restart the bot!");
    process.exit(1);
  }
});

bot.on('message', function (msg) {
  if (msg.author.id !== bot.user.id) return;
  if (S(msg.content).startsWith(config.prefix)) {
    var splitmsg = msg.content.split(" ");
    var cmd = S(splitmsg[0]).chompLeft(config.prefix).s;
    var args = splitmsg.slice(1);

    switch (cmd) {
      case 'eval':
        var code = args.join(' ');
        try {
          var evaled = eval(code);
          if (evaled === token || evaled === "token" || evaled.toString().indexOf(token) !== -1 || evaled.toString().indexOf("token") !== -1) {
            evaled = 'Don\'t eval your token, that is... Hmm, bad.';
            msg.delete();
          }
          pro = msg.channel.send("\`\`\`\n" + evaled.toString() + "\n\`\`\`");
          // TODO: .catch handle message with over 2k chars
          if (S(evaled.toString()).startsWith('[object')) {
            pro.then(m => m.delete(35000))
          }
        } catch (err) {
          if (err !== null && typeof err === 'object') {
            err = util.inspect(err);
          }
          msg.channel.send(":x: Error!\n\`\`\`\n" + err + "\n\`\`\`").then(m => m.delete(60000)
          )
          ;
          // TODO: .catch handle message with over 2k chars
        }
        break;
      case 'dumptxt':
        temp = "===" + msg.guild.name + "===\n";
        temp += getchans(msg.guild, true);
        msg.channel.send(temp);
        break;
      case 'ldumptxt':
        temp = "===" + msg.guild.name + "===\n";
        temp += getchans(msg.guild, false);
        msg.delete();
        console.log(temp);
        break;
      case 'ping':
        if (hasPermission(msg, 'EMBED_LINKS')) {
          var embed = getEmbed(':ping_pong: Ping!');
          msg.channel.send("", {
            embed: embed
          }).then(
            m => m.edit("", {
              embed: getEmbed(':ping_pong: Pong!', 'Latency is ' + (m.createdTimestamp - msg.createdTimestamp) + 'ms\nAPI Latency is ' + bot.ping + ' ms')
            })
          )
        } else {
          msg.channel.send(':ping_pong: Ping!').then(
            m => m.edit(':ping_pong: Pong!\nLatency is ' + (m.createdTimestamp - msg.createdTimestamp) + 'ms\nAPI Latency is ' + bot.ping + ' ms')
          )
        }
        break;
      case "pingtext":
      case "pingtxt"://hack: cleanup and merge into ping cmd by checking for txt on end
        msg.channel.send(':ping_pong: Ping!').then(
          m => m.edit(':ping_pong: Pong!\nLatency is ' + (m.createdTimestamp - msg.createdTimestamp) + 'ms\nAPI Latency is ' + bot.ping + ' ms')
        );
        break;
      case 'serverinfo':
        var guild = msg.guild;
        var user = guild.owner.user;
        var txt = "";
        var title = "Name: " + guild.name + "\n";
        txt += "Owner: " + user.username + "#" + user.discriminator + " (" + user.id + ")\n";
        txt += "Member Count: " + guild.memberCount + "\n";
        txt += "Channels: " + guild.channels.array().length + "\n";
        txt += "Roles: " + guild.roles.array().length + "\n";
        txt += "Region: " + guild.region + "\n";
        txt += "created At: " + guild.createdAt + "\n";
        if (hasPermission(msg, 'EMBED_LINKS')) {
          msg.channel.send("", {
            embed: getEmbed(title, txt).setThumbnail(guild.iconURL)
          });
        } else {
          msg.channel.send(title + "\n" + txt)
        }
        break;
      case 'serverinfotxt'://hack: cleanup and merge into ping cmd by checking for txt on end
        var guild = msg.guild;
        var user = guild.owner.user;
        var txt = "";
        var title = "Name: " + guild.name + "\n";
        txt += "Owner: " + user.username + "#" + user.discriminator + " (" + user.id + ")\n";
        txt += "Member Count: " + guild.memberCount + "\n";
        txt += "Channels: " + guild.channels.array().length + "\n";
        txt += "Roles: " + guild.roles.array().length + "\n";
        txt += "Region: " + guild.region + "\n";
        txt += "created At: " + guild.createdAt + "\n";
        msg.channel.send(title + txt);
        break;
      case 'embedmode':
        if (emode === true) {
          emode = false;
          msg.edit('Embed mode disabled');
        } else if (emode === false) {
          emode = true;
          msg.edit('Embed mode enabled');
        }
        break;
      case 'embed':
        msg.edit("", {
          embed: getEmbed(false, args.join(' '))
        });
        break;
      case 'spamlog':
        spamLog(msg, args[0]);
        break;
      case'quote':
        if (quoteHolder === false) {
          msg.channel.send('Nothing has been quoted yet...');
          break;
        }
        msg.delete().catch(function (err) {
        });
        author = quoteHolder.author;
        if (hasPermission(msg, 'EMBED_LINKS')) {
          msg.channel.send('', {
            embed: new Discord.RichEmbed().setTitle('Quoting: ' + author.username)
              .setAuthor(author.username + '#' + author.discriminator+ ' @' + quoteHolder.guild.name + '#' + msg.channel.name, author.avatarURL)
              .setDescription(quoteHolder.content)
          });
        } else {//also need a way to do this like ..quotetxt e.e
          msg.channel.send(
            'Quote: ' + author.username + '#' + author.discriminator + ' @' + quoteHolder.guild.name + '#' + msg.channel.name +
            '\n' + quoteHolder.cleanContent
          )
        }
        msg.channel.send(args.join(' '));

        break;
      case'quotemode':
        quoteStatus = !quoteStatus;
        msg.edit('Quote Mode now: ' + quoteStatus);
        break;//todo a way to get identifier of a emoji
    }
  } else {
    if (emode) {
      msg.edit("", {
        embed: getEmbed(false, msg.content)
      });
    }
  }
});
bot.on('messageReactionAdd', (messageReaction, user) => {
  if (quoteStatus !== true) return true;
  if (messageReaction.me !== true || user.username !== bot.user.username) return true;
  if (messageReaction.emoji.identifier !== quoteReaction) return true;
  quoteHolder = messageReaction.message;
  messageReaction.remove();
});
if (firstrun === 1) {
  bot.login(token)
    .then(function (r) {
      console.log("Login successful! " + r);
    })
    .catch(function (r) {
      console.error("Login not successful! " + r);
    });
  firstrun = 0;
} else {
  console.log("Not logging in again for preventing bot token reset!");
}

//Functions
function getchans(guild, channelID) {
  var temp = "";
  guild.channels.array().forEach(function (e, i, a) {
    if (e.type === "text") {
      if (channelID) {
        let name = e.toString();
      } else {
        let name = "#" + e.name;
      }
      temp += name + " -> {" + e.topic + "}\n";
      //console.log(util.inspect(e));
    }
  });
  return temp
}

function spamLog(msg, times = 10) {
  var line = '-';
  msg.channel.send('>').then(function (amsg) {
    var i = 1;
    var ival = bot.setInterval(function () {
      amsg.edit(line.repeat(i) + '>');
      i += 1;
      if (i >= times) {
        bot.clearInterval(ival);
        msg.channel.send('Finished');
      }
    }, 1000);
  });
}

function getEmbed(title, description = false, colour = true) {
  var embed = new Discord.RichEmbed();
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

function hasPermission(msg, perm) {
  return msg.channel.permissionsFor(msg.member).has(perm);
}
