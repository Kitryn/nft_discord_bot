const jsonexport = require('jsonexport')
const winston = require('winston')
const { format } = winston

winston.loggers.add('default', {
    format: format.json(),
    transports: [
        new winston.transports.Console()
    ]
})

const masknames = require('opensealib/names.json')
const { fetch_from_range } = require('opensealib/opensealib')
const { DECIMALS } = require('opensealib/constants')

async function get_all_mask_data() {
    let maskdata = await fetch_from_range()

    maskdata.forEach((elem) => {
        // HACK -- this only works because it mutates
        if (elem.lastSale.symbol === 'ETH' || elem.lastSale.symbol === 'WETH') {
            elem.lastSale.quantity = elem.lastSale.quantity / DECIMALS
        }
    
        if (elem.bestBid.symbol === 'ETH' || elem.bestBid.symbol === 'WETH') {
            elem.bestBid.quantity = elem.bestBid.quantity / DECIMALS
        }
    
        if (elem.bestAsk.symbol === 'ETH' || elem.bestAsk.symbol === 'WETH') {
            elem.bestAsk.quantity = elem.bestAsk.quantity / DECIMALS
        }
    })

    let output = []

    for (mask of maskdata) {
        let out = { ...mask }
    
        let maskTraits = masknames.find((elem) => {
            return parseInt(elem.index) === parseInt(out.tokenId)
        })
    
        let eyes = maskTraits.eyesdisplayName.slice(6)
        let item = maskTraits.itemdisplayName.slice(6)
        let maskType = maskTraits.maskdisplayName.slice(6)
        let skin = maskTraits.skindisplayName.slice(12)
        let character = maskTraits['base-characterdisplayName']
    
        out = {
            ...out, eyes, item, maskType, skin, character, // nct
        }
    
        output.push(out)
    }

    return output
}

async function get_all_mask_data_as_csv() {
    let maskdata = await get_all_mask_data()
    return await jsonexport(maskdata)
}

module.exports = {
    get_all_mask_data, get_all_mask_data_as_csv
}
