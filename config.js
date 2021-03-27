module.exports = {
  mqtt: 'http://localhost',
  url: 'http://localhost:8080/api',
  topic: 'miflora/BonsaiCarmona',
  auth: 'Basic ' + Buffer.from('user:password').toString('base64'),
  picture: './picture.jpg'
}
