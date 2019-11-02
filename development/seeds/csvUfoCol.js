'use strict'

const _           = require('lodash')
const fs          = require('fs-extra')
const path        = require('path')
const csv         = require('fast-csv')
const MongoClient = require('mongodb').MongoClient

const ufoData     = []
const filePath = './seeds/ufo-sightings.csv'

MongoClient.connect('mongodb://localhost:27017/ufo_db', (err, db) => {
  if(!err) {
    console.log('Mongodb connected on port 27017')
  }
  db.db('ufo_db').createCollection('ufo_coll', {
	  validator: {
	     $jsonSchema: {
	        bsonType: 'object',
	        required: [ 'id', 'occurred_at', 'city', 'state', 'country', 'shape',
	        	'duration_seconds', 'duration_text', 'description', 'reported_on',
	        	'coordinates.longitude, coordinates.latitude' ],
	        properties: {
	           id: {
	           	bsonType: 'int',
							description: 'must be a string and is required'
	           },
						occurred_at: {
							bsonType: 'string',
							description: 'must be a string and is required'
						},
						city: {
							bsonType: 'string',
							description: 'must be a string and is required'
						},
						state: {
							bsonType: 'string',
							description: 'must be a string and is required'
						},
						country: {
							bsonType: 'string',
							description: 'must be a string and is required'
						},
						shape: {
							bsonType: 'string',
							description: 'must be a string and is required'
						},
				  	duration_seconds: {
					  	bsonType: 'int',
							description: 'must be a integer and is required'
						},
						duration_text: {
							bsonType: 'string',
							description: 'must be a string and is required'
						},
						description: {
							bsonType: 'string',
							description: 'must be a string and is required'
						},
						reported_on: {
						bsonType: 'string',
							description: 'must be a string and is required'
						},
						'coordinates.longitude': {
							bsonType: 'int',
							description: 'must be a int and is required'
						},
						'coordinates.latitude': {
							bsonType: 'int',
							description: 'must be a int and is required'
						},            
	        }
	     }
	  }
	})

	const csvReader = (path, processor) => {

	  return new Promise((resolve) => {
	    const parser = fs.createReadStream(`${path}`)
	      .pipe(csv({ headers: true, delimiter: ',' }))
	      .on('data', (row) => {
	        processor(row)
	      })
	      .on('end', () => {
	        resolve()        
	      })
	  })
	}

	const processRow = (row) => {
		const ufo = {
			id: Number(row.id),
			occurred_at: row.occurred_at, // "5/20/2010 21:30",
			city: String(row.city), // "tolland",
			state: String(row.state), // "ct",
			country: String(row.country), // "us",
			shape: String(row.shape), // "light",
			duration_seconds: Number(row.duration_seconds), // "10",
			duration_text: String(row.duration_text), // "10 sec",
			description: String(row.description), // "2 red blinking orbs.",
			reported_on: String(row.reported_on), // "6/3/2010",
			coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
		}

		ufoData.push(ufo)				
	}	

	csvReader(filePath, (row) => { processRow(row) })
		.then( () => {
			db.db('ufo_db').collection('ufo_coll').createIndex({ coordinates : '2dsphere' })
			return db.db('ufo_db').collection('ufo_coll').insertMany(ufoData)			
		})
		.then(() => {
			console.log('done')		
		})  
})
