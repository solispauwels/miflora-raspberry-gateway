const config = require('./config')
const Gateway = require('./gateway')
const { mqtt, url, topic, auth, picture } = config

console.debug('clear', mqtt, url, topic, auth, picture)
const plant = new Gateway(mqtt, url, topic, auth, picture)

plant.listen()
