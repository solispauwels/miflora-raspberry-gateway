const fs = require('fs')
const fetch = require('node-fetch')
const FormData = require('form-data')
const mqtt = require('mqtt')
const piCameraConnect = require('@zino-hofmann/pi-camera-connect')
const Jimp = require('jimp')
const { StillCamera } = piCameraConnect

class Gateway {
  constructor (mqtt, url, topic, auth, picture) {
    this.mqtt = mqtt
    this.url = url
    this.topic = topic
    this.auth = auth
    this.picture = picture

    this.camera = new StillCamera()
  }

  listen () {
    this.client = mqtt.connect(this.mqtt)
    this.client.on('connect', () => this.client.subscribe(this.topic, error => error && console.error(error)))
    this.client.on('message', (topic, message) => this.onMessage(JSON.parse(message.toString())))
  }

  onMessage (message) {
    message.temperature = message.temperature * 10
    message.date = Date.now()
    this.takePicture().then(() => {
      this.sendPicture(message.date)
      this.sendData(message)
    })
  }

  sendData (payload) {
    const body = JSON.stringify(payload)

    fetch(
      `${this.url}/insert`,
      { body, method: 'PUT', headers: { Authorization: this.auth, Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' } }
    )
      .then(res => res.text())
      .then(text => console.log(text))
      .catch(error => console.error(error))
  }

  sendPicture (name) {
    const contentLength = fs.statSync(this.picture).size
    const stream = fs.createReadStream(this.picture)
    const form = new FormData()

    form.append('picture', stream, { knownLength: contentLength })
    form.append('name', name)

    fetch(
      `${this.url}/upload`,
      { body: form, method: 'POST', headers: { Authorization: this.auth } }
    )
      .then(res => res.text())
      .then(text => console.log(text))
      .catch(error => console.error(error))
  }

  takePicture () {
    return this.camera.takeImage()
      .then(picture => Jimp.read(picture))
      .then(picture => picture.resize(1440, Jimp.AUTO))
      .then(picture => picture.quality(70))
      .then(picture => picture.writeAsync(this.picture))
  }
}

module.exports = Gateway
