const express        = require('express')
const MongoClient    = require('mongodb').MongoClient
const app            = express()

const port = 8000

MongoClient.connect('mongodb://localhost:27017/ufo_db', (err, db) => {
  if(!err) {
    console.log('Mongodb connected on port 27017')
  }

  global.db = db.db('ufo_db')
  require('./app/routes')(app)
  
  app.listen(port, () => {
  	console.log(`Server listen on port: ${port}`)
	})
})
