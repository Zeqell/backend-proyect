const { Command } = require('commander')

const program = new Command()

program
    .option('--mode <mode>', 'Environment mode', 'production')
    .parse()

module.exports = program