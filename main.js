const Discord = require('discord.js') // подключение библиотеки                  Видео про бота https://youtu.be/1lzPIhTaPDY
const client = new Discord.Client() // создание клиента

client.on('ready', () =>{ // ивент, когда бот запускается https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-ready
    client.generateInvite("ADMINISTRATOR").then(invite => console.log(`Ссылка на добавление ${invite}`))
    console.log(`Привет! ${client.user.tag} запустился!`) // информация в консоль про успешный запуск
})

client.on('message', message =>{ // ивент, когда приходит любое сообщение в чат https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-message
    if (message.author.bot) return; // если автор сообщения - бот, ничего не происходит 
    if (message.content == 'd.профиль') { // если пользователь написал "d.профиль" 
    let embed = new Discord.MessageEmbed() // создание ембед сообщения
    .setTitle(message.author.username) // в тайтле имя автора 
    let status = ''
    switch (message.author.presence.status) { // проверка статусов 
        case 'online':
            status = 'онлайн'; break; 
            case 'idle':
                status = ':orange_circle:нет на месте'; break;
                case 'offline':
                    status = 'нет в сети'; break;
                    case 'dnd':
                        status = ':red_circle:не беспокоить'; break;
    }
    embed.setDescription(`**Ваш дискорд айди: ${message.author.id}
    Ваш статус: ${status}
    Дата создания аккаунта: ${message.author.createdAt.toLocaleDateString()}
    Дата входа на сервер: ${message.member.joinedAt.toLocaleDateString()}
    **`) // описание ембеда
    .setColor('RANDOM') // рандомный цвет ембеда
    .setThumbnail(message.author.avatarURL()) // вставляем в ембед аватарку пользователя
    message.channel.send(embed) // отправляем сообщение в канал где была написана команда   
    }
})

client.on('messageDelete', message =>{ // ивент, когда удаляется любое сообщение с сервера https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
    let embed = new Discord.MessageEmbed()
    .setTitle('Было удалено сообщение!')
    .setColor('RANDOM')
    .addField(`Удалённое сообщение:`, message.content, true)
    .addField("Автор:",`${message.author.tag} (${message.author})`,true)
    .addField("Канал:", `${message.channel}`, false)
    .setFooter(' - ',`${message.author.avatarURL()}`)
    .setTimestamp(message.createdAt);
  client.channels.cache.get("712604761232375859").send(embed); // айди вашего канала с логами
})

client.on('guildMemberAdd', member =>{ // ивент, когда пользователь присоединяется к серверу https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
    let embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Привет, ${member.user.username}!`)
    .setDescription(`**Ты попал на мой сервер!
    Ты наш \`${client.guilds.get("613459974533939303").memberCount}\` участник! **`) // айди вашего сервера               !!!!!!!!!!
    .setFooter('Будь всегда на позитиве :3', 'https://cdn.discordapp.com/emojis/590614597610766336.gif?v=1')
    // .addField(`Участвуй в розыгрышах!`, `<#706487236220289054>`, true) // Добавляйте свои каналы по желанию
    // .addField(`Общайся в чате!`, `<#702364684199788625>`, true)
    // .addField(`Смотри видео наших ютуберов!`, `<#702363551184060546>`, true)
    .setColor('RANDOM')
    member.send(embed); // отправка сообщения в лс 

    let embed2 = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Пользователь вошел на сервер`)
    .addField('Пользователь:', member.user)
    .setColor('RANDOM')
    member.send(embed);
    client.channels.cache.get('712604761232375859').send(embed2) // айди вашего канала с логами
})

client.on('guildMemberRemove', member => { // ивент, когда пользователь выходит с сервера https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
    let embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Пользователь покинул сервер`)
    .addField('Пользователь:', member.user)
    .setColor('RANDOM')
    member.send(embed);
    client.channels.cache.get('712604761232375859').send(embed) // айди вашего канала с логами
  })

client.once('reconnecting', () => {
    console.log('Reconnecting!');
    });
    
    client.once('disconnect', () => {
    console.log('Disconnect!');
    });
    
    client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(d.)) return;
    
    const serverQueue = queue.get(message.guild.id);
    
    if (message.content.startsWith(`${d.}play`)) {
    execute(message, serverQueue);
    return;
    } else if (message.content.startsWith(`${d.}skip`)) {
    skip(message, serverQueue);
    return;
    } else if (message.content.startsWith(`${d.}stop`)) {
    stop(message, serverQueue);
    return;
    } else {
    message.channel.send('You need to enter a valid command!')
    }
    });
    
    async function execute(message, serverQueue) {
    const args = message.content.split(' ');
    
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('I need the permissions to join and speak in your voice channel!');
    }
    
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
    title: songInfo.title,
    url: songInfo.video_url,
    };
    
    if (!serverQueue) {
    const queueContruct = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
    };
    
    queue.set(message.guild.id, queueContruct);
    
    queueContruct.songs.push(song);
    
    try {
    var connection = await voiceChannel.join();
    queueContruct.connection = connection;
    play(message.guild, queueContruct.songs[0]);
    } catch (err) {
    console.log(err);
    queue.delete(message.guild.id);
    return message.channel.send(err);
    }
    } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(`${song.title} has been added to the queue!`);
    }
    
    }
    
    function skip(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();
    }
    
    function stop(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    }
    
    function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    
    if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
    }
    
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', () => {
    console.log('Music ended!');
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
    })
    .on('error', error => {
    console.error(error);
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    }


client.login('NDUxNzg5NzIzMTA3NzIxMjI2.WxAn9w.eKdKO3oGbz2-AwKrX9zmivW5ARo') // токен вашего бота
