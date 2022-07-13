// adapted from https://www.npmjs.com/package/cadence-to-json README

const fs = require('fs')
const path = require('path')
const transactionsPath = path.join(__dirname, 'src/transactions/')
const scriptsPath = path.join(__dirname, 'src/scripts/')

const convertCadenceToJs = async () => {
  const resultingJs = await require('cadence-to-json')({
    transactions: [transactionsPath],
    scripts: [scriptsPath],
    config: require('../flow.json'),
  })
  fs.writeFile(
    './lib/CadenceToJson.json',
    JSON.stringify(resultingJs, null, 2),
    (err) => {
      if (err) {
        console.error('Failed to read CadenceToJs JSON')
        process.exit(1)
      }
    },
  )
}

convertCadenceToJs()
