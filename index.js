const Discord = require('discord.js')
const client = new Discord.Client()
const { DISCORD_BOT_TOKEN } = require('./keys.json')

const winston = require('winston')
const { format } = winston
winston.loggers.add('default', {
    format: format.json(),
    transports: [
        new winston.transports.Console()
    ]
})

const { generate_hashmask_csv, generate_gan_v2_csv, generate_mooncat_csv } = require('opensealib/csv_generator') 


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
    if (msg.content === '!maskdata') {
        msg.channel.send('Getting mask data, please wait...')
        let buf = Buffer.from(await generate_hashmask_csv() ,'utf8')
        msg.channel.send(new Discord.MessageAttachment(buf, 'mask.csv'))
    } else if (msg.content === '!gandata') {
        msg.channel.send('Getting BGANV2 data, this may take awhile! please wait...')
        let buf = Buffer.from(await generate_gan_v2_csv(), 'utf8')
        msg.channel.send(new Discord.MessageAttachment(buf, 'bganv2.csv'))
    } else if (msg.content === '!catdata') {
        msg.channel.send('Getting catdata, this may take awhile...')
        let buf = Buffer.from(await generate_mooncat_csv(), 'utf8')
        msg.channel.send(new Discord.MessageAttachment(buf, 'cat.csv'))
    }
})

client.login(DISCORD_BOT_TOKEN)
