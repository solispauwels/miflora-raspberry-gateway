const config = require('./config')
const Gateway = require('./gateway')
const { mqtt, url, topic, auth, picture } = config

const plant = new Gateway(mqtt, url, topic, auth, picture)

plant.listen()
