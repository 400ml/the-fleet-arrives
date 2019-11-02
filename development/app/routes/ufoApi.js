'use strict'

const ufoController = require('./controllers/ufoController.js')
const { howManyUFO, howAdvancedIsTheFleet, evacuationPriorities, oneIfByLand, railyTheTroops } = ufoController

module.exports = (app) => {
	app.get('/ufo/sightings/count', (req, res) => { 
    howManyUFO(req, res)
  })

  app.get('/ufo/sightings/unique', (req, res) => {
    howAdvancedIsTheFleet(req, res)
  })

  app.get('/ufo/sightings/priority', (req, res) => {
    evacuationPriorities(req, res)
  })
  		
	app.get('/ufo/sightings/zone', (req, res) => {
    oneIfByLand(req, res)
  })

  app.get('/ufo/sightings/troops', (req, res) => {
    railyTheTroops(req, res)
  })	
};