let Discord = require("discord.js"),
      client = new Discord.Client(),
      fs = require("fs"),
      config = require("./config.json"),
      package = require("./package.json"),
      moment = require("moment");

client.on("ready", async () => {
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
  client.user.setStatus("online");

  setInterval(async() => {
    let random = [`on ${client.guilds.cache.size} servers`,`with ${client.users.cache.size} members!`,`with ${(client.users.cache.get(config.DevID) || client.users.fetch(config.DevID) || {tag: "Dummy#0000"}).tag}`,`${config.prefix}help`,`version ${package.version}`,`Helping Yu and Ayumi | ${config.prefix}help`,`Making Music With my Owner ${(client.users.cache.get(config.DevID) || client.users.fetch(config.DevID) || {tag: "Dummy#0000"}).tag}`];
    let status = random[Math.floor(Math.random() * random.length)];
    client.user.setActivity(status, {type: "PLAYING"}) //PLAYING, STREAMING, LISTENING, WATCHING
  }, 30000);
});

//Login
client.login(config.token);

client.on('message', message => {
  console.clear();

  //VARS
  let args = message.content.slice(config.prefix).trim().split(" ");
  if(!args) return;
  let command = args.shift();
  
   //HELP COMMAND
  if(command == `${config.prefix}help`) {
    return await message.channel.send(new Discord.MessageEmbed()
      .setColor(0xc5ca09)
      .setTitle(`${client.user.username}'s Commands`)
      .addField(`**__Information__**`,"`bot`,`servers`,`ping`", true)
      .addField(`**__Moderation__**`,"`kick`,`ban`", true)
      .addField(`**__Other__**`,"`avatar`,`invite`", false)
      .addField(`**__Dev__**`,"`uptime`,`restart`,`eval`",false)
      .setFooter(message.author.tag)
    );
  } else

  //PING COMMAND
  if(command == `${config.prefix}ping`) {
    return await message.channel.send(`Pong! **${Math.round(client.ws.ping)}**ms`);
  }

  //AVATAR COMMAND
  if(command == `${config.prefix}avatar`) {
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    return await message.channel.send(new Discord.MessageEmbed()
    .setTitle(`Avatar: ${target.user.username}`)
    .setImage(target.user.displayAvatarURL())
    .setDescription(`[Avatar Link](${target.user.displayAvatarURL()})`)
    .setFooter(message.author.tag)
    .setTimestamp()
    );
  } else 

  //INVITE COMMAND
  if(command == `${config.prefix}invite`) {
    return await message.channel.send(new Discord.MessageEmbed()
    .setColor(0x0acdfe)
    .setTitle(`Invites!`)
    .setDescription(`[Click here to invite me!](https://discordapp.com/oauth2/authorize?client_id=495895930747224064&permissions=2117598711&redirect_uri0=&&scope=bot) \nJoin my Support Server [here](https://discord.gg/xYB2b6E)`)
    .setFooter(message.author.tag)
    );
  } else

  //SERVERS COMMAND
  if(command == `${config.prefix}servers`) {
   return await message.channel.send(new Discord.MessageEmbed()
    .setTitle(`All servers where I'm on.`)
    .setFooter(message.author.tag)
    .setDescription(`**${client.guilds.size}** Servers: \n \n${client.guilds.cache.map(servers => servers.name).join(",\n")}`)
    );
  } else

  //stats COMMAND
  if(command == `${config.prefix}stats`) {
    let t = new Date(client.uptime), 
    days = t.getUTCDate()-1,
    minutes = t.getUTCMinutes(),
    hours = t.getUTCHours(),
    seconds = t.getUTCSeconds(),
    uptime = `**${days}**d, **${hours}**h, **${minutes}**m, **${seconds}**s`;

    return await message.channel.send(new Discord.MessageEmbed()
      .setAuthor(`Informations about ${client.user.username}`)
      .setDescription(`My prefix is **${config.prefix}**`)
      .addField(`Name + Tag`,`**${client.user.username}**#${client.user.discriminator}`,true)
      .addField(`ID`,`${client.user.id}`,true)
      .addField(`Dev`,`**${client.users.resolve(config.DevID).username}**#${client.users.resolve(config.DevID).discriminator}`, true)
      .addField("Ping",`Discord API: **${Math.round(client.ws.ping)}**ms`, true)
      .addField(`Uptime`,`${uptime}`, true)
      .addField("Status",`${config.Usertypes[client.user.presence.status]}`,true)
      .addField("Created at",`**${moment(client.user.createdAt).format("DD.MM.YYYY")}**`,true)
      .setThumbnail(client.user.displayAvatarURL)
      .setFooter(message.author.tag)
    );
  } else

  //KICK COMMAND
  if(command == `${config.prefix}kick`) {
    if(!message.member.hasPermission("KICK_MEMBERS")) return await message.channel.send(`You need Kick Permissions. ${message.author.tag}`);
    
    let member = message.mentions.members.first(); 
    if(!member) return await message.reply(`Please enter a user!`);
    if(!member.kickable) return await message.reply("Unable to kick this user."); 
    if(member.user.id == config.DevID) return await message.reply(`Can't kick the Dev!`);

    let reason = args.slice(1).join(' '); 
    if(!reason) return await message.reply(`Enter a reason!`);
    
    try {
      await member.kick(reason);
      return await message.reply(`**${member.user.username}**#${member.user.discriminator} got kicked because of: **${reason}**`);
    } catch(err) {
      return await message.channel.send(`Error kicking Member: ${err}`);
    }
  } else

   //BAN COMMAND
   if(command == `${config.prefix}ban`) {
    if(!message.member.hasPermission("BAN_MEMBERS")) return await message.channel.send(`You need Ban Permissions. ${message.author}`);
    
    let member = message.mentions.members.first();
    if(!member) return await message.reply(`Please enter a user!`);
    if(!member.bannable) return await message.reply("Unable to ban this user."); 
    if(member.user.id == config.DevID) return await message.reply(`Can't ban the Dev!`);

    let reason = args.slice(1).join(' ');
    if(!reason) return await message.reply(`Enter a reason!`);

    try {
      await member.ban(reason);
      return await message.reply(`**${member.user.username}**#${member.user.discriminator} got banned because of: **${reason}**`);
    } catch(err) {
      return await message.channel.send(`Error banning Member: ${err}`);
    }
  } else

  //UPTIME COMMAND
  if(command == `${config.prefix}uptime`) {
    if(message.author.id != config.DevID && !config.OwnerID.includes(message.author.id)) return await message.reply(`S-S-Stop you can't use this command!`);
      
    let t = new Date(client.uptime),
    days = t.getUTCDate()-1,
    minutes = t.getUTCMinutes(),
    hours = t.getUTCHours(),
    seconds = t.getUTCSeconds(),
    uptime = `**${days}** days, **${hours}** hours, **${minutes}** minutes and **${seconds}** seconds`;
  
    return await message.channel.send(uptime);
  } else

  //RESTART COMMAND
  if(command == `${config.prefix}restart`) {
    if(message.author.id != config.DevID && !config.OwnerID.includes(message.author.id)) return await message.reply(`Only the Dev can use this!`);
    
    let restartchannel = message.channel;
    await restartchannel.send(`Restart in progress.`);
    client.destroy();
    console.clear();
    client.login(config.token).then(async() => {
      return await restartchannel.send(`${message.author}, Restarted!`);
    });
  } else

   //Eval
   if(command == `${config.prefix}eval`) {
    if(message.author.id == config.DevID|| message.author.id == config.OwnerID) {
      let command = args.join(" ");
        function clean(text) {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
          } 
          if(config.token) config.token = "no stop to getting my token"
         try {
          let code = args.join(" ");
          let evaled = eval(command);
     
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
     
          message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }              
    } else {
        message.channel.send(`${message.author}, Go away only my Owner and my Dev can use this!`)
    } 
  } 


});
