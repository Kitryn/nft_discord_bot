const Discord = require('discord.js')
const client = new Discord.Client()
const { DISCORD_BOT_TOKEN } = require('./keys.json')
const { get_all_mask_data_as_csv } = require('./mask_data')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
    if (msg.content === '!maskdata') {
        msg.channel.send('Getting mask data, please wait...')
        let buf = Buffer.from(await get_all_mask_data_as_csv(), 'utf8')
        msg.channel.send(new Discord.MessageAttachment(buf, 'out.csv'))
    }
})

client.login(DISCORD_BOT_TOKEN)
